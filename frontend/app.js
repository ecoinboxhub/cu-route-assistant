/* CU Route Assistant — static frontend.
 *
 * No framework, no build step, no analytics, no cookies. Every value from the
 * API is inserted with textContent or createElement, never innerHTML, so a
 * question cannot become markup and the page can run under `script-src 'self'`.
 */
(function () {
  "use strict";

  var config = window.CU_ROUTE_CONFIG || {};
  var params = new URLSearchParams(window.location.search);
  var API = (params.get("api") || config.apiBase || "").replace(/\/+$/, "");
  if (!API) {
    API = window.location.protocol === "file:" ? "http://127.0.0.1:8003" : window.location.origin;
  }

  var CATEGORY_LABELS = {
    admissions: "Applying and programmes",
    fees: "Fees and payment",
    it: "Technical support",
    student: "Student services",
    staff: "Staff services",
    library: "Library",
    general: "General enquiries",
    careers: "Careers",
    research: "Research centres",
    technical: "APIs and data",
  };

  var state = {
    routes: [],
    topics: [],
    category: "all",
    search: "",
    routingVersion: "",
    busy: false,
  };

  function $(id) {
    return document.getElementById(id);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function appendRichText(parent, text) {
    // Supports the small Markdown subset the composer emits: **bold** and
    // _italic_. Everything else is a literal text node.
    var tokens = String(text || "").split(/(\*\*[^*]+\*\*|_[^_\n]+_)/g);
    tokens.forEach(function (token) {
      if (!token) return;
      if (token.length > 4 && token.slice(0, 2) === "**" && token.slice(-2) === "**") {
        parent.appendChild(el("strong", "", token.slice(2, -2)));
      } else if (token.length > 2 && token.charAt(0) === "_" && token.charAt(token.length - 1) === "_") {
        parent.appendChild(el("em", "", token.slice(1, -1)));
      } else {
        parent.appendChild(document.createTextNode(token));
      }
    });
  }

  function hostOf(url) {
    try {
      return new URL(url).host;
    } catch (error) {
      return url;
    }
  }

  function categoryLabel(key) {
    return CATEGORY_LABELS[key] || key.replace(/-/g, " ");
  }

  function verificationLabel(value) {
    if (value === "published_conflicting") return "Published · conflicting";
    if (value === "derived") return "Derived";
    if (value === "published_route_index_only") return "Route index only";
    return "Published";
  }

  function verificationClass(value) {
    if (value === "published_conflicting") return "verify-conflict";
    if (value === "derived") return "verify-derived";
    return "verify-published";
  }

  function fetchJSON(path, options) {
    var controller = new AbortController();
    var timer = setTimeout(function () {
      controller.abort();
    }, 25000);
    var init = Object.assign({ signal: controller.signal, headers: { Accept: "application/json" } }, options || {});
    return fetch(API + path, init)
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return {};
          })
          .then(function (body) {
            if (!response.ok) {
              var detail = body && body.detail;
              if (Array.isArray(detail)) detail = detail.map(function (d) { return d.msg; }).join("; ");
              var error = new Error(detail || "Request failed with status " + response.status);
              error.status = response.status;
              throw error;
            }
            return body;
          });
      })
      .finally(function () {
        clearTimeout(timer);
      });
  }

  /* ------------------------------------------------------------------ toast */

  var toastTimer = null;
  function toast(message) {
    var node = $("toast");
    if (!node) return;
    node.textContent = message;
    node.hidden = false;
    requestAnimationFrame(function () {
      node.classList.add("is-visible");
    });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      node.classList.remove("is-visible");
      setTimeout(function () {
        node.hidden = true;
      }, 180);
    }, 2200);
  }

  function copyText(text, label) {
    function done() {
      toast("Copied " + label);
    }
    function fallback() {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } catch (error) {
        toast("Copy failed — select the text instead");
      }
      document.body.removeChild(area);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  /* ------------------------------------------------------------- answer view */

  function answerBadge(result) {
    if (result.intent === "unsafe" || result.intent === "refuse") {
      return { text: "Refused · unsafe request", cls: "badge-refused" };
    }
    if (result.abstained || result.grounding === "abstained") {
      return { text: "No published answer", cls: "badge-abstained" };
    }
    if (result.grounding === "grounded") {
      return { text: "Grounded answer", cls: "badge-grounded" };
    }
    return { text: "Routed to an office", cls: "badge-partial" };
  }

  function modeText(result) {
    var embedder = result.trace && result.trace.embedder ? result.trace.embedder : "";
    var mode = result.mode || "full";
    return embedder ? mode + " · " + embedder : mode;
  }

  function addContactRow(list, key, value, href, copyLabel) {
    if (!value) return;
    var row = el("li", "contact-row");
    row.appendChild(el("span", "contact-key", key));
    var valueNode;
    if (href) {
      valueNode = el("a", "contact-value");
      valueNode.href = href;
      valueNode.textContent = value;
      if (/^https?:/.test(href)) {
        valueNode.target = "_blank";
        valueNode.rel = "noopener noreferrer";
      }
    } else {
      valueNode = el("span", "contact-value", value);
    }
    row.appendChild(valueNode);
    if (copyLabel) {
      var button = el("button", "copy-btn", "Copy");
      button.type = "button";
      button.setAttribute("aria-label", "Copy " + copyLabel);
      button.addEventListener("click", function () {
        copyText(value, copyLabel);
      });
      row.appendChild(button);
    }
    list.appendChild(row);
  }

  function routeCard(route, primary) {
    var card = el("article", "route-card" + (primary ? " is-primary" : ""));

    var head = el("div", "route-head");
    var titleWrap = el("div");
    titleWrap.appendChild(el("h3", "route-title", route.label));
    if (route.summary) titleWrap.appendChild(el("p", "route-summary", route.summary));
    head.appendChild(titleWrap);
    head.appendChild(el("span", "verify-badge " + verificationClass(route.verification), verificationLabel(route.verification)));
    card.appendChild(head);

    var contacts = el("ul", "contact-list");
    if (route.entry_point) {
      addContactRow(contacts, "Go to", route.entry_point, route.entry_point, "link");
    }
    if (route.office) addContactRow(contacts, "Office", route.office, null, null);
    if (route.email) addContactRow(contacts, "Email", route.email, "mailto:" + route.email, "email address");
    if (route.phone) addContactRow(contacts, "Phone", route.phone, "tel:" + route.phone.replace(/[^\d+]/g, ""), "phone number");
    if (route.alternative_phone) {
      addContactRow(contacts, "Alt phone", route.alternative_phone, "tel:" + route.alternative_phone.replace(/[^\d+]/g, ""), "phone number");
    }
    if (route.whatsapp) {
      var digits = String(route.whatsapp).replace(/[^\d]/g, "");
      addContactRow(contacts, "WhatsApp", route.whatsapp, digits ? "https://wa.me/" + digits : null, "WhatsApp number");
    }
    if (route.hours) addContactRow(contacts, "Hours", route.hours, null, null);
    if (route.address) addContactRow(contacts, "Address", route.address, null, "address");
    if (contacts.childNodes.length) card.appendChild(contacts);

    if (route.verification === "published_conflicting") {
      card.appendChild(
        el(
          "p",
          "route-note",
          "The University publishes more than one value for this destination. Both routes are shown where known; try the second if the first does not answer."
        )
      );
    } else if (route.verification === "derived") {
      card.appendChild(
        el(
          "p",
          "route-note",
          "Compiled by cross-referencing published routes; no single page states it."
        )
      );
    }

    if (route.source_url) {
      var source = el("p", "source-line", "Compiled from: ");
      var link = el("a", "", hostOf(route.source_url));
      link.href = route.source_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      source.appendChild(link);
      card.appendChild(source);
    }

    return card;
  }

  function renderAnswer(result) {
    var badge = answerBadge(result);
    var badgeNode = $("answer-badge");
    badgeNode.className = "badge " + badge.cls;
    badgeNode.textContent = badge.text;
    $("answer-mode").textContent = modeText(result);

    $("answer-question").textContent = result.question;
    var body = $("answer-body");
    clear(body);
    appendRichText(body, result.answer);

    var primary = $("answer-primary");
    clear(primary);
    if (result.primary_route) {
      primary.appendChild(el("p", "alternatives-title", "Primary destination"));
      primary.appendChild(routeCard(result.primary_route, true));
    }

    var alternatives = $("answer-alternatives");
    clear(alternatives);
    if (result.also_consider && result.also_consider.length) {
      alternatives.appendChild(el("p", "alternatives-title", "Also consider"));
      result.also_consider.forEach(function (route) {
        alternatives.appendChild(routeCard(route, false));
      });
    }

    var citations = $("answer-citations");
    clear(citations);
    if (result.citations && result.citations.length) {
      citations.appendChild(el("p", "citations-title", "Sources"));
      result.citations.forEach(function (citation) {
        var item = el("div", "citation");
        var head = el("div", "citation-head");
        var link = el("a", "", citation.source_title || hostOf(citation.source_url));
        link.href = citation.source_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        head.appendChild(link);
        if (citation.retrieved_at) {
          head.appendChild(el("span", "citation-meta", "retrieved " + citation.retrieved_at));
        }
        if (citation.verification) {
          head.appendChild(el("span", "citation-meta", citation.verification.replace(/_/g, " ")));
        }
        item.appendChild(head);
        if (citation.snippet) {
          var details = document.createElement("details");
          var summary = document.createElement("summary");
          summary.textContent = "Read the quoted passage";
          var quote = document.createElement("blockquote");
          quote.textContent = citation.snippet;
          details.appendChild(summary);
          details.appendChild(quote);
          item.appendChild(details);
        }
        citations.appendChild(item);
      });
    }

    $("answer-disclaimer").textContent = result.disclaimer || "";

    var section = $("answer-section");
    section.hidden = false;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderAnswerError(question, message) {
    $("answer-badge").className = "badge badge-partial";
    $("answer-badge").textContent = "Service unavailable";
    $("answer-mode").textContent = "";
    $("answer-question").textContent = question;

    var body = $("answer-body");
    clear(body);
    body.appendChild(
      el(
        "p",
        "",
        message +
          " Your question has been kept in the box so you can try again. This is an outage, not a refusal: the University may well have published the answer."
      )
    );

    clear($("answer-primary"));
    clear($("answer-alternatives"));
    clear($("answer-citations"));
    $("answer-disclaimer").textContent = "";

    var section = $("answer-section");
    section.hidden = false;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ------------------------------------------------------------------- ask */

  function setBusy(busy) {
    state.busy = busy;
    var button = $("ask-button");
    button.disabled = busy;
    button.textContent = busy ? "Asking…" : "Ask the assistant";
  }

  function ask(question) {
    if (state.busy) return;
    var trimmed = String(question || "").trim();
    if (!trimmed) {
      $("question").focus();
      toast("Type a question first");
      return;
    }
    setBusy(true);
    $("answer-badge").className = "badge";
    $("answer-badge").textContent = "Searching";
    $("answer-mode").textContent = "";
    $("answer-question").textContent = trimmed;
    var body = $("answer-body");
    clear(body);
    body.appendChild(el("p", "muted", "Searching the published record…"));
    clear($("answer-primary"));
    clear($("answer-alternatives"));
    clear($("answer-citations"));
    $("answer-disclaimer").textContent = "";
    $("answer-section").hidden = false;

    fetchJSON("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ question: trimmed }),
    })
      .then(function (result) {
        renderAnswer(result);
      })
      .catch(function (error) {
        var message;
        if (error.status === 429) {
          message = "Too many requests in a short time. Wait a minute, then ask again.";
        } else if (error.status === 422) {
          message = "That question could not be accepted. Keep it under 500 characters and try again.";
        } else if (error.status) {
          message = "The assistant replied with an error (HTTP " + error.status + ").";
        } else {
          message = "The assistant is not reachable right now.";
        }
        renderAnswerError(trimmed, message);
      })
      .finally(function () {
        setBusy(false);
      });
  }

  /* ------------------------------------------------------------- directory */

  function routeMatches(route) {
    if (state.category !== "all" && route.category !== state.category) return false;
    if (!state.search) return true;
    var haystack = [
      route.label,
      route.office,
      route.category,
      categoryLabel(route.category || ""),
      route.email,
      route.phone,
      route.address,
      route.notes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.indexOf(state.search.toLowerCase()) !== -1;
  }

  function renderDirectory() {
    var list = $("directory-list");
    clear(list);

    var visible = state.routes.filter(routeMatches);
    if (!state.routes.length) {
      list.appendChild(el("p", "error-state", "The routing table could not be loaded. Check that the API is running, then reload."));
      $("directory-status").textContent = "Directory unavailable.";
      return;
    }

    if (!visible.length) {
      list.appendChild(el("p", "empty-state", "No destination matches that search. Try an office name, a service, or a phone number."));
    } else {
      visible.forEach(function (route) {
        list.appendChild(routeCard(route, false));
      });
    }

    $("directory-status").textContent =
      visible.length +
      " of " +
      state.routes.length +
      " destinations shown" +
      (state.routingVersion ? " · routing table v" + state.routingVersion : "") +
      ".";
  }

  function renderCategoryFilters() {
    var container = $("category-filters");
    clear(container);
    var categories = [];
    state.routes.forEach(function (route) {
      if (route.category && categories.indexOf(route.category) === -1) categories.push(route.category);
    });
    categories.sort(function (a, b) {
      return categoryLabel(a).localeCompare(categoryLabel(b));
    });

    var all = el("button", "chip" + (state.category === "all" ? " is-active" : ""), "All");
    all.type = "button";
    all.addEventListener("click", function () {
      state.category = "all";
      renderCategoryFilters();
      renderDirectory();
    });
    container.appendChild(all);

    categories.forEach(function (category) {
      var chip = el(
        "button",
        "chip" + (state.category === category ? " is-active" : ""),
        categoryLabel(category)
      );
      chip.type = "button";
      chip.addEventListener("click", function () {
        state.category = category;
        renderCategoryFilters();
        renderDirectory();
      });
      container.appendChild(chip);
    });
  }

  function renderUnpublished() {
    var container = $("unpublished-list");
    clear(container);
    if (!state.topics.length) {
      container.appendChild(el("p", "muted", "No unpublished topics are declared."));
      return;
    }

    var byId = {};
    state.routes.forEach(function (route) {
      byId[route.route_id] = route;
    });

    state.topics.forEach(function (topic) {
      var card = el("article", "unpublished-card");
      card.appendChild(el("h3", "", topic.label));
      if (topic.note) card.appendChild(el("p", "", topic.note));

      var hints = topic.route_hints || (topic.route_hint ? [topic.route_hint] : []);
      var names = hints
        .map(function (id) {
          return byId[id] ? byId[id].label : null;
        })
        .filter(Boolean);
      if (names.length) {
        card.appendChild(el("p", "route-hint", "The office that owns it: " + names.join(" · ")));
      }
      container.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ boot */

  function updateLinks() {
    ["privacy-link", "fallback-link", "health-link", "noscript-fallback"].forEach(function (id) {
      var node = $(id);
      if (!node) return;
      if (id === "privacy-link") node.href = API + "/api/privacy";
      if (id === "health-link") node.href = API + "/api/health";
      if (id === "fallback-link" || id === "noscript-fallback") node.href = API + "/fallback";
    });
  }

  function loadHealth() {
    fetchJSON("/api/health")
      .then(function (health) {
        var status = $("service-status");
        var text = $("status-text");
        status.classList.remove("is-ok", "is-degraded", "is-down");
        if (health.degraded) {
          status.classList.add("is-degraded");
          text.textContent = "Online · degraded";
          status.title =
            "Embedder: " +
            (health.embedder && health.embedder.active ? health.embedder.active : "unknown") +
            ". The service is answering from a documented fallback configuration.";
        } else {
          status.classList.add("is-ok");
          text.textContent = "Online";
          status.title = "Embedder: " + (health.embedder && health.embedder.active ? health.embedder.active : "active");
        }
        if (health.corpus && health.corpus.documents) {
          $("stat-pages").textContent = health.corpus.documents;
        }
        if (health.routes) $("stat-routes").textContent = health.routes;
        if (health.unpublished_topics) $("stat-topics").textContent = health.unpublished_topics;
      })
      .catch(function () {
        var status = $("service-status");
        status.classList.remove("is-ok", "is-degraded");
        status.classList.add("is-down");
        $("status-text").textContent = "Service offline";
      });
  }

  function loadDirectory() {
    fetchJSON("/api/routes")
      .then(function (data) {
        state.routes = data.routes || [];
        state.topics = data.unpublished_topics || [];
        state.routingVersion = data.routing_table_version || "";
        $("stat-routes").textContent = data.count || state.routes.length;
        $("stat-topics").textContent = state.topics.length;
        if (data.count) {
          $("directory-status").textContent =
            data.count + " destinations · routing table v" + state.routingVersion + ".";
        }
        renderCategoryFilters();
        renderDirectory();
        renderUnpublished();
      })
      .catch(function () {
        state.routes = [];
        state.topics = [];
        renderDirectory();
        renderUnpublished();
      });
  }

  function wireForm() {
    var form = $("ask-form");
    var textarea = $("question");
    var counter = $("char-count");

    textarea.addEventListener("input", function () {
      counter.textContent = textarea.value.length + " / 500";
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      ask(textarea.value);
    });

    textarea.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        ask(textarea.value);
      }
    });

    document.querySelectorAll(".samples .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        textarea.value = chip.getAttribute("data-question") || chip.textContent.trim();
        counter.textContent = textarea.value.length + " / 500";
        ask(textarea.value);
      });
    });

    var search = $("directory-search");
    var searchTimer = null;
    search.addEventListener("input", function () {
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        state.search = search.value.trim();
        renderDirectory();
      }, 140);
    });
  }

  function boot() {
    updateLinks();
    wireForm();
    loadHealth();
    loadDirectory();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
