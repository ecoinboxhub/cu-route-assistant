# 00 — Project Brief: Discovery Audit & Solution Selection

**Programme:** AIPIL (COSMOPOLITAN) – YIN Consortium — IDEAS
**Skill track:** Artificial Intelligence (primary)
**Client / beneficiary:** Cosmopolitan University, Abuja — prospective applicants, current students, staff
**Audit date:** 26 September 2026
**Status:** Stage 1 (Problem definition) — awaiting trainer approval of scope

---

## 1. Audit scope and method

The target organisation is the institution named in the project link supplied for
this capstone, `cosmopolitan.edu.ng` (Cosmopolitan University, Abuja — the same
institution that administers the IDEAS programme).

Method:

1. HTTP retrieval of the public front door and four key public routes.
2. Retrieval of each separately-hosted sub-application named by the front door.
3. Web search for indexed pages, published contact routes, and third-party
   coverage of the same subject matter.
4. Comparison of contact channels published for the *same* function across
   different properties.

No authentication was attempted. No personal data was collected. No portal was
modified, scanned, or stressed. Retrieval was limited to publicly published pages.

---

## 2. Findings (evidenced)

### Finding A — The front door returns no content to any non-JavaScript client

`www.cosmopolitan.edu.ng` is a single-page application. Four separate routes
were requested and all four returned only the shell:

```
https://www.cosmopolitan.edu.ng/              -> "You need to enable JavaScript to run this app."
https://www.cosmopolitan.edu.ng/contact-us     -> "You need to enable JavaScript to run this app."
https://www.cosmopolitan.edu.ng/services/ict   -> "You need to enable JavaScript to run this app."
https://www.cosmopolitan.edu.ng/services/library -> (same shell, per search index)
```

Meanwhile, the separately hosted `admission.cosmopolitan.edu.ng` returns full
server-rendered HTML, and search crawlers have clearly indexed some content from
the main site. The result is **partial and inconsistent** discoverability rather
than total absence.

**Who this actually hurts.** The students and applicants most likely to be
excluded are precisely those with the least bandwidth and the least tolerance for
a slow page:

- applicants on metered, expensive mobile data in Nigeria;
- users on older or low-end Android handsets, where a large JS bundle is slow
  or times out;
- users whose browser has JavaScript disabled or blocked by data-saver mode;
- screen-reader and other assistive-technology users whose tooling does not
  execute JavaScript;
- crawlers, share-preview generators, and link previews in messaging apps.

This last group matters commercially: previews generated for links shared in
WhatsApp — a primary sharing channel for Nigerian applicants — render blank.

### Finding B — The university is fragmented across at least twelve separate web properties

Distinct, independently built and independently branded applications were
confirmed to exist under the same institutional domain:

| Property | Function evidenced |
|---|---|
| `www.cosmopolitan.edu.ng` | Main marketing / corporate site (SPA) |
| `admission.cosmopolitan.edu.ng` | Admission landing page — server-rendered |
| `ug.admission.cosmopolitan.edu.ng` | Undergraduate application + sign-in |
| `pg.admission.cosmopolitan.edu.ng` | Postgraduate application + sign-in |
| `certificates.cosmopolitan.edu.ng` | Certificate programmes (14 courses listed) |
| `apply.cosmopolitan.edu.ng` | AIPIL/IDEAS programme application + status check |
| `student.cosmopolitan.edu.ng` | Student portal (grades, registration) |
| `ccsa.cosmopolitan.edu.ng` | Centre for Climate-Smart Agriculture |
| `fims.cosmopolitan.edu.ng` | Farm Information Management System + public API docs |
| `films.cosmopolitan.edu.ng` | Cosmopolitan Film School |
| LinkedIn company page | Separate public channel with its own contact details |
| Third-party aggregators | e.g. a fee-aggregation site publishing CU fees |

There is no single authoritative index that says *which property answers which
question*. A user who wants to pay a fee, check an admission result, or find a
lecture hall must already know which door to knock on.

### Finding C — The same function is published with different contact details in different places

The route for **admissions** is published inconsistently:

| Source | Address published |
|---|---|
| `admission.cosmopolitan.edu.ng` | `admission@cosmopolitan.edu.ng`, `+234 805 208 0828` |
| `www.cosmopolitan.edu.ng/contact-us` | `admissions@cosmopolitan.edu.ng` (Undergraduate) |
| `www.cosmopolitan.edu.ng/contact-us` | `pg.admissions@cosmopolitan.edu.ng` (Postgraduate) |
| `ug.admission.cosmopolitan.edu.ng` | `+234 806 559 0444`, `info@cosmopolitan.edu.ng` |
| `pg.admission.cosmopolitan.edu.ng` | `+234 806 559 0444`, `admission@cosmopolitan.edu.ng` |
| `www.cosmopolitan.edu.ng/services/ict` | `hayat.suleiman@cosmopolitan.edu.ng`, `+234 805 208 0828` |
| LinkedIn | yet another partial number fragment (`0912882…`) |

Neither the singular `admission@` nor the plural `admissions@` is documented as
canonical. The same ambiguity applies to other units: ICT publishes a personal
named email as its helpdesk route; the library publishes `library@`; CCSA
publishes `ccsa@`; the FIMS API publishes `api@`. None of these is discoverable
from a single place.

### Finding D — The institution's own content is not answering the public's questions

A third-party aggregator (`schoolnoble.com`) currently itemises CU tuition fees
and, tellingly, tells readers to "refer to the specific program pages on our
website" for accuracy. An external site is filling an information gap that the
institution's own front door is leaving open. This is corroborating evidence
that the current site fails a routine, high-value user task: **"what does this
programme cost, and how do I apply?"**

### Finding E — There is a genuine institutional asset being left unused

The University already publishes a *structured, machine-readable* API: an
OpenAPI specification with field-level data-classification, an explicit auth
scheme, scopes, status codes, and rate limiting. The institution has already
demonstrated the competence to build well-specified digital services. The gap is
not capability; it is that this content is never surfaced to the people who
need it.

---

## 3. Problem statement

> **Prospective applicants, current students, and staff of Cosmopolitan University
> cannot reliably determine, from the public web, which of the university's
> twelve-plus separate online properties answers their question, or which
> contact route is the correct and current one for a given matter — and on low
> bandwidth, low-end devices, or assistive technology, the main site displays no
> content at all.**
>
> The result is misdirected enquiries, abandoned applications, and staff time
> spent manually repeating routing instructions that are already written down
> somewhere on the domain.

**Target users (primary, in order):** prospective undergraduate applicants;
applicants checking admission status; current students needing a specific
administrative route; ICT helpdesk staff, who absorb the resulting load.

**Evidence the problem is real, not assumed:** Findings A–D above, each
independently reproducible against a public URL and recorded with the date and
the exact retrieval result.

**Why a broad topic was rejected.** Per the capstone guidelines, a problem must
be stated practically. "Improve the university's website" is not acceptable. The
scope is narrowed to one user task — *find the correct route and contact for my
matter* — because that task is (a) demonstrably failing, (b) solvable by a small
team, and (c) measurable.

---

## 4. Solution selected

### CU Route Assistant — a grounded AI information and routing assistant

A small, embeddable web assistant, grounded **exclusively** in content the
University already publishes, that does two things and nothing else:

1. **Answers** a question in plain language, quoting the source page and
   printing a citation for every claim.
2. **Routes** the user to the correct portal, office, email address, or phone
   number for their specific matter, drawn from a single reconciled routing
   table rather than from scattered pages.

It is delivered as one `<script>` tag that any of the twelve properties can
embed, so the assistant appears *at the point of confusion* rather than adding a
thirteenth door.

### Why this is the simplest possible AI product that still counts as AI

The guideline is to be minimal, not to be trivial. This is at the floor of what
is defensibly an AI system:

| Decision | Choice made | Why it is the light option |
|---|---|---|
| Learning approach | **Retrieval-Augmented Generation (RAG)** | No model training, no labelled data, no GPU, no tuning. The hard part is the assistant's *grounding*, and RAG makes correctness inspectable. |
| Knowledge source | The University's own published pages, manually curated to Markdown | Already written; no dataset to acquire, licence to clear, or label. Manual curation also avoids scraping terms-of-service questions. |
| Inference | A single hosted LLM API call per question, behind a swappable interface | No self-hosted inference to provision, patch, or pay for. |
| Embeddings | A small open-weights sentence embedding model, ONNX runtime | Roughly 50 MB, no PyTorch, runs on a free CPU tier. |
| Vector store | SQLite-backed store with cosine similarity | No separate database server to operate. |
| Vector index | **Not used.** Brute-force search over a corpus of a few hundred chunks | An index is premature at this size. Adding one is a documented next step, not a v1 requirement. |
| Data collected | **None.** No accounts, no logs of user identity, no training on user queries | Removes the entire privacy, consent, and data-protection surface from v1. |
| Interface | One chat panel, one link, no login | A prospective applicant must never be asked to sign in to be helped. |
| Actions | **Read-only.** It advises; it does not submit applications or call APIs | Removes write-permissions risk and third-party dependency. |

**Deliberately excluded from v1**, with reasons:

- no fine-tuning or custom model — unjustifiable without data;
- no voice input/output — doubles surface area for no user benefit here;
- no multilingual support — a stated limitation, with Nigerian English as the
  working language and translation flagged for v2;
- no image or document understanding — unnecessary for a routing task;
- no integration with the FIMS or any live portal API — would introduce
  authentication, rate-limit, and availability risk for zero added user value;
- no mobile native app — a script tag covers the need at a fraction of the cost.

---

## 5. Alternatives considered and rejected

| Option | Why rejected |
|---|---|
| A static, hand-written FAQ page | Genuinely useful, but not an AI system; it fails the AI track and offers no capability to cite, generalise across twelve properties, or handle unexpected phrasing. Retained as the product's **fallback mode**. |
| A rule-based keyword chatbot | Cheaper and more predictable, and it passes the *same* 50-question evaluation with a worse score on paraphrase robustness. Rejected on the grounds that the task genuinely benefits from semantic matching — but the evaluation is run for both so the claim is evidenced, not asserted. |
| A chatbot with live web search | Answers questions the University has not published, and would confidently fabricate fee figures. Directly violates the accuracy and ethics criteria. |
| Fine-tuning a model on University content | Requires curated instruction data, a training budget, and a re-run every time a fee changes. Disproportionate to the problem. |
| Rebuilding or fixing the main website | A real and worthwhile problem, but it is an IT infrastructure project, not a capstone; it is unbounded in scope, requires production access, and cannot be delivered as a demonstrable prototype in the time available. Recommended to the client as a separate engagement, and referenced in the reflective statement. |
| An AI-powered fee or scholarship calculator | Attractive, but depends on structured, current, authoritative fee data that the University does not publish in a usable form. It would either guess or require a data owner — an external dependency the capstone cannot control. |

---

## 6. Expected benefit and how it will be measured

The product is only accepted if it measurably beats the status quo. Three
pre-registered measures, defined before build:

1. **Routing accuracy** — on a held-out set of 50 real applicant questions, the
   percentage for which the assistant returns the correct destination. Target:
   90% or above.
2. **Groundedness** — the percentage of factual claims that carry a citation
   resolving to a real University page. Target: 100%. Any uncited factual claim
   is treated as a defect, not a limitation.
3. **Task completion** — 10 prospective-testers, unassisted, asked to locate the
   correct contact route for three matters, measured against the same task
   attempted with the current site. Target: a reduction in mean time-to-route and
   in wrong-turn errors.

A 50-question evaluation set and its expected answers will be frozen and
version-controlled before implementation begins, so that the test cannot be
written to fit the result.

---

## 7. Alignment with the SDGs and IDEAS objectives

- **SDG 4 — Quality Education:** lowers the transaction cost of finding
  legitimate admissions, tuition, and programme information, disproportionately
  benefiting applicants with the fewest resources.
- **SDG 9 — Industry, Innovation and Infrastructure:** applies retrieval
  grounding and evaluation discipline to a public-facing institutional service.
- **SDG 10 — Reduced Inequalities:** directly targets users on low bandwidth,
  low-end devices, and assistive technology, who are excluded by the current
  implementation.
- **SDG 16 — Peace, Justice and Strong Institutions:** a single reconciled,
  accountable routing table is a small act of institutional transparency.

This directly serves the IDEAS goals of practical competence, employability, and
future-ready digital skills with social and economic value.

---

## 8. Risks to obtaining client data

Stated plainly, because it affects the schedule:

- The corpus is limited to publicly published pages, so the assistant can only
  be as current as the University's own publishing. **If the University does not
  publish fee figures, the assistant will not know them, and will say so.** This
  is correct behaviour and must not be presented as a defect.
- No live portal integration is in scope, so status-checking questions will be
  answered by *routing*, not by *answering*.
- If the client supplies no named data owner, the routing table is built purely
  from published evidence and its provenance is documented per row, so that
  disputed rows are individually traceable.
