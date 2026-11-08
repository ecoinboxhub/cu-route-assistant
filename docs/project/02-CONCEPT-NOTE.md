# 02 — Project Concept Note (Capstone Stage 1)

**Programme:** AIPIL (COSMOPOLITAN) – YIN Consortium — IDEAS
**Deliverable:** Capstone submission item 1 — Project concept note
**Status:** Awaiting trainer/facilitator approval of scope
**Date:** 26 September 2026

---

## 1. Project title

**CU Route Assistant — a grounded AI assistant that tells every applicant, student
and staff member exactly which of Cosmopolitan University's twelve-plus online
portals answers their question, and who to contact.**

Short name for deployment: **Ask CU**

---

## 2. Participants, cohort, and primary skill track

**Primary skill track:** Artificial Intelligence.

This satisfies the guideline requirement to identify a primary track and the
competencies demonstrated.

**Secondary competencies exercised:** Software Development and Engineering
(API service, embeddable web widget, version control, automated testing,
deployment). The Product Manager must declare AI as the **primary** track and
this project as an **AI solution that is delivered as software** — not a
software project with an AI feature. The intelligence is the product.

**Team:** 11 members working across the roles defined in `01-TEAM-AND-ROLES.md`.

This project was developed collaboratively by the team. Individual members are
not named here, and individual contributions are not itemised in this
documentation; accountability for the work as a whole rests with the team. The
role structure in `01-TEAM-AND-ROLES.md` describes how the work was divided and
reviewed, not who held which role.

**Cohort:** _to be completed by the team from the programme records._

**Client / beneficiary organisation:** Cosmopolitan University, Abuja — the
institution that both runs this programme and is the subject of the project link
supplied for this capstone.

---

## 3. Problem statement

Cosmopolitan University operates at least twelve separate, independently built
web properties. The same function — most visibly admissions — is published with
different email addresses and different phone numbers in different places, and
no single authoritative page states which property answers which question.

The main corporate site, `www.cosmopolitan.edu.ng`, is a JavaScript single-page
application that returns no content to any client that does not execute
JavaScript. Four separate routes were verified on 26 September 2026 and all four
returned only the shell *"You need to enable JavaScript to run this app."*

The result is that the people most likely to be excluded — applicants on metered
mobile data, on low-end handsets, using data-saver mode, or relying on assistive
technology that does not execute JavaScript — cannot read a single word of the
University's programmes, fees, or contact details from the front door. Everyone
else must already know which of twelve doors to knock on, and which of six email
addresses is currently correct.

A third-party aggregator has begun publishing the University's tuition fees,
explicitly because the University's own site does not answer the question. That
is corroborating evidence, not speculation.

**Full audit, with reproducible evidence for every claim:** `00-PROJECT-BRIEF.md`.

---

## 4. Intended users and beneficiaries

**Primary — prospective undergraduate applicants.**
The highest-value and highest-volume user. They are researching programmes and
fees from a phone, often on a prepaid data bundle, frequently sharing links in
WhatsApp where the preview renders blank. Their single task is: *"I want to apply
for X. Where do I go, and who do I ask?"*

**Secondary — applicants checking admission status.**
Their need is navigational, not informational. The assistant will not query any
live portal; it will route them correctly to the status page and explain the
steps.

**Secondary — current students needing an administrative route.**
Registration, grades, fees, library, e-learning, ICT helpdesk. The routing table
is the primary value here; the University already publishes these routes, they
are simply scattered.

**Tertiary — ICT helpdesk and admissions staff.**
Not end users, but the internal beneficiaries. Misrouted enquiries consume staff
time that is spent re-explaining routing that is already written down on the
domain. The assistant converts a recurring manual task into a self-service one.

**Explicitly not a target user in v1:** existing portal users seeking to
*perform* a transaction. The assistant advises and routes; it does not act.

---

## 5. Why the problem matters

- **It is a revenue and admissions problem.** A prospective applicant who cannot
  determine a fee or an application route is an applicant who does not apply, or
  applies to the wrong programme.
- **It falls hardest on the least resourced.** Excluding users on low bandwidth
  and low-end devices is an equity failure, not merely a performance one. This
  is the strongest justification for the project.
- **It wastes institutional knowledge that already exists.** The routing
  information is published. It is simply not presented in a form a person or a
  machine can use. No new content is required to fix it.
- **It is provably being worked around.** An external site is filling the
  University's information gap. Unreconciled contact details published across
  twelve properties is an institutional transparency problem, and the routing
  table is a direct, proportionate fix.
- **It is a bounded, solvable problem.** Unlike "improve education" or "reduce
  unemployment", this has a defined failing task, a defined user, a defined
  success measure, and a team that can finish it.

---

## 6. Proposed solution

A small, embeddable, **grounded** AI assistant, delivered as a single
`<script>` tag, that does exactly two things:

1. **Answers** the question in plain language, using only content the University
   has published, with a citation printed beside every factual claim.
2. **Routes** the user to the correct portal, office, email, or phone number for
   their specific matter, from a single reconciled routing table with per-row
   provenance.

It is built as a **Retrieval-Augmented Generation** system: no model is trained,
no dataset is labelled, no GPU is required. The knowledge base is the
University's own published pages, curated into Markdown, chunked, embedded with a
small open-weights model, and searched by cosine similarity over a few hundred
chunks. A single language-model call composes the answer from the retrieved
chunks only.

**Three behaviours matter more than the technology:**

- **It cites or it does not say it.** Any factual claim without a resolvable
  source citation is suppressed.
- **It refuses gracefully.** For anything outside the published corpus, it says
  it does not have that information and gives the best available route. It
  never invents a fee, a deadline, or a contact.
- **It degrades, it does not break.** With no JavaScript, a no-network client,
  or an unavailable model, the user receives a static, working answer-and-routing
  list. The product never becomes less useful than a single well-built HTML page.

**Why RAG and not something else:** it is the floor of what is defensibly an AI
system, it requires no training data or compute, and — decisively for capstone
assessment — it makes correctness *inspectable*. Every answer can be traced to a
source URL, which means the AI Engineer's claims are demonstrable rather than
asserted.

---

## 7. Expected benefit and outcome

| Measure | Definition | Target |
|---|---|---|
| **Routing accuracy** | % of 50 held-out real applicant questions where the correct destination is returned | ≥ 90% |
| **Groundedness** | % of factual claims carrying a citation that resolves to a real University page | **100%** — anything less is a defect |
| **Refusal correctness** | % of out-of-scope questions where the assistant declines rather than invents | 100% |
| **Task completion** | 10 testers, 3 routing tasks each: mean time-to-route and wrong-turn errors, with vs. without the assistant | Measurable reduction vs. the current site |
| **Accessibility** | Full task completion with keyboard only, and with a screen reader, on the primary journey | 100% |
| **Fallback integrity** | Primary journey still completable with JavaScript disabled and with the model unavailable | 100% |
| **Cost** | Monthly running cost of the deployed product | Under a documented, enforced ceiling |

**The honest limits of the benefit.** This project will not fix the underlying
fragmentation, will not make the main site render, and will not publish fee
figures the University has not published. It makes the *existing* published
information findable, correct, and citable. That is a real reduction in
transaction cost for a real user, achieved in the time available, without
requiring production access the team does not have. Overstating this in the
reflective statement would be a failure of academic integrity, not a strength.

---

## 8. SDG, community, and institutional connection

- **SDG 4 — Quality Education.** Directly reduces the cost of accessing
  legitimate admissions, programme, and tuition information — disproportionately
  benefiting applicants with the fewest resources.
- **SDG 9 — Industry, Innovation and Infrastructure.** Applies retrieval
  grounding, evaluation discipline, and reproducible deployment to a
  public-facing institutional service.
- **SDG 10 — Reduced Inequalities.** The explicit target user is the person on a
  low-end device, on metered data, or using assistive technology — the group the
  current implementation excludes.
- **SDG 16 — Peace, Justice and Strong Institutions.** A single reconciled,
  accountable, provenance-tracked routing table is a concrete act of
  institutional transparency.
- **Institutional.** Serves an IDEAS objective directly: future-ready digital
  skills producing a solution with social and economic value, using technology
  the University has already shown it can build well — the same discipline is
  visible in its own published OpenAPI specification.

---

## 9. Tools, data, equipment, and external support required

### 9.1 Data — public, published, and curated only

| Data | Source | Volume | Status |
|---|---|---|---|
| Knowledge corpus | Publicly published pages on `cosmopolitan.edu.ng` and its sub-domains | ~30–50 pages | Manually curated to Markdown; no crawling |
| Routing table | Contact routes published across the properties in Finding C | ~15–25 rows | Reconciled, each row carrying a provenance URL |
| Evaluation set | Realistic applicant questions written by the team | 50 questions | **Frozen and version-controlled before implementation** |
| Paraphrase set | Re-wordings of the gold questions | 20 questions | Tests robustness beyond keyword matching |
| Personal data | **None** | — | No collection at any point |

**Data ethics.** Only publicly published pages are used. No authentication is
attempted, no portal is modified or scanned, and no personal data is collected,
logged, or used for training. Because the assistant's entire value depends on
institutional accuracy, the University's published pages are treated as the
authoritative source and any conflict is resolved in the University's favour.

### 9.2 Tools and technology — free-tier only, no paid licences

| Layer | Choice | Note |
|---|---|---|
| Language | Python 3.11+ | |
| API framework | FastAPI + Uvicorn | Generates the OpenAPI spec |
| Embeddings | `all-MiniLM-L6-v2` via ONNX runtime (~50 MB) | No PyTorch; runs on CPU |
| Vector store | SQLite-backed store, brute-force cosine similarity | No database server; an index is a documented v2 step |
| Language model | Hosted LLM API behind a swappable interface | Free tier; retrieval-only fallback if unavailable |
| Frontend | React + Vite, built to a single embeddable bundle | |
| Embedding mechanism | One `<script>` tag, no host build step | |
| Version control | Git | Code, prompts, corpus, config, and gold set |
| CI/CD | GitHub Actions | |
| Hosting | Free-tier application and static hosting | |
| Design | Figma (free tier) | |
| Project tracking | Repository issues and project board | |
| Monitoring | Free-tier uptime and log tooling | Structured logs, no user identity |

### 9.3 Equipment

The work requires: a laptop with 8 GB RAM or more, a stable internet
connection, and a modern browser. **No GPU, no server, no drone, no specialist
hardware, and no paid subscription is required by any role.** This is a
deliberate design constraint so that the project is reproducible on the hardware
the cohort actually has.

### 9.4 External support required

| Support | From | Why | If unavailable |
|---|---|---|---|
| Scope approval and milestone sign-off | Trainer / facilitator | Required by the capstone guidelines | Project cannot progress past Stage 2 |
| Corroboration of the routing table | University ICT / admissions | Confirming canonical contacts | Proceed from published evidence only; flag every unconfirmed row as *unverified* in the UI |
| Named client data owner | University | Accepting corrections to published facts | Assistant still operates; corrections route to the published generic address |
| Review of the accessibility specification | University | Confirming priority users | Proceed to WCAG-aligned targets as the default |
| 10 volunteer testers | Cohort peers | Task-completion measurement | Substitute team members; sample size stated as a limitation |

**Critical dependency, stated plainly:** the project can be built entirely
without client involvement, because every input is already public. Client
involvement improves the routing table's accuracy but is not on the critical
path. This is deliberate — a capstone must not depend on an organisation's
calendar to be completable.

### 9.5 Explicitly out of scope for v1

Fine-tuning or training any model; voice input or output; multilingual support
(stated limitation, Nigerian English in v1); image or document understanding;
live integration with any portal or the FIMS API; mobile native applications;
user accounts; multiple languages; analytics dashboards; any write action.

Every exclusion is a documented decision with a reason, and the v2 candidate
list is recorded in the project plan.

---

## 10. Statement of feasibility

This is achievable by an 11-member team in the available window because it
requires **no model training, no dataset acquisition, no labelled data, no GPU,
no client data, and no production system access.** The corpus is text that
already exists and is already published. The two genuinely hard engineering
tasks — grounding the model so it cannot invent facts, and proving the evaluation
was not written to fit the result — are precisely the competencies the AI track
assesses, and both are owned by defined roles with their own definition of done.

The project's main risk is not technical difficulty. It is over-claiming. The
concept note therefore commits to the narrow, demonstrable claim stated in
Section 7 and to documenting everything excluded.
