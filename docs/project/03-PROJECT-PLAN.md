# 03 — Project Plan (Capstone Stage 2)

**Programme:** AIPIL (COSMOPOLITAN) – YIN Consortium — IDEAS
**Deliverable:** Capstone submission item 2 — Project plan
**Project:** CU Route Assistant — grounded AI information and routing assistant
**Date:** 26 September 2026
**Status:** Submitted for trainer/facilitator approval of scope. Per the capstone
guidelines, substantial implementation does not begin until this scope is
approved.

**Companion documents:** `00-PROJECT-BRIEF.md` (audit and evidence),
`01-TEAM-AND-ROLES.md` (role boundaries and deliverable ownership),
`02-CONCEPT-NOTE.md` (problem framing).

---

## 1. Objectives and success measures

### 1.1 Objectives

| # | Objective | Owner |
|---|---|---|
| O1 | Establish, from reproducible public evidence, that Cosmopolitan University's fragmented web presence prevents users from identifying the correct route and contact for their matter. | Product Manager |
| O2 | Deliver a working, publicly reachable AI assistant that answers questions about published University information **and** routes users to the correct destination, with a citation for every factual claim. | AI Engineer, Backend Engineer, Frontend Engineer |
| O3 | Guarantee that the assistant degrades rather than fails: fully usable with JavaScript disabled, with no network, and with the language model unavailable. | Backend Engineer, Frontend Engineer |
| O4 | Prove — with a pre-registered, frozen evaluation — that the system meets its accuracy, groundedness, refusal, accessibility, and cost thresholds. | QA Engineer |
| O5 | Collect no personal data, introduce no authentication, and perform no write action, so that the privacy and security surface is minimal by construction. | Cyber Security Engineer |
| O6 | Produce a complete, well-documented capstone portfolio with defensible individual evidence for all 11 members. | Project Manager |
| O7 | Leave the client with a maintainable system and a documented procedure for keeping its knowledge current. | AI Automation Engineer, DevOps Engineer |

### 1.2 Success measures — pre-registered

These thresholds are fixed **before** implementation. The evaluation set is
committed to the repository with a version-control timestamp earlier than the
first implementation commit, so that the result cannot be fitted after the fact.
If the system misses a threshold, the result is reported as a miss.

| # | Measure | Operational definition | Threshold |
|---|---|---|---|
| S1 | Routing accuracy | % of the 50 gold questions where the correct portal/office/contact is returned | ≥ 90% |
| S2 | Groundedness | % of factual claims carrying a citation resolving to a real CU page | **100%** |
| S3 | Refusal correctness | % of out-of-scope questions answered with a refusal or a route rather than an invention | 100% |
| S4 | Paraphrase robustness | Routing accuracy on the 20 reworded questions, using no keywords shared with the gold set | ≥ 80% |
| S5 | Task completion | 10 testers × 3 routing tasks: mean time-to-route, with vs. without the assistant | Demonstrable reduction vs. the current site |
| S6 | Keyboard accessibility | Primary journey completable using keyboard only | 100% |
| S7 | Screen-reader accessibility | Primary journey completable with a screen reader; every citation announced | 100% |
| S8 | Fallback integrity | Primary journey completable with JS disabled **and** with the model unavailable | 100% |
| S9 | Security | No unresolved high or critical finding at release | 0 |
| S10 | Privacy | Personal data collected, logged, or used for training | 0 records |
| S11 | Cost | Monthly running cost | Under the enforced ceiling in D15 |
| S12 | Portability | Runs on the cohort's actual hardware, with no GPU and no paid licence | Confirmed |

**Anti-gaming rules, agreed in advance:**

- The gold set is frozen before implementation and is never edited to fix a
  failure. A question is removed only if it is *ambiguous*, and the removal and
  its reason are logged with the QA Engineer's signature.
- Failures are reported with their output verbatim. No cherry-picked examples in
  the final report.
- If a baseline is beaten, a **keyword-matching baseline is also evaluated**, so
  that the claim "AI is necessary here" is evidenced rather than asserted.

---

## 2. Key features and deliverables

### 2.1 Features — v1, in priority order

| ID | Feature | Priority | Owner | Notes |
|---|---|---|---|---|
| F1 | Grounded question answering with a visible citation per factual claim | **Must** | AI Engineer | The core AI competency |
| F2 | Destination routing from a reconciled, provenance-tagged routing table | **Must** | AI Engineer, Backend | The user value |
| F3 | Graceful refusal with the best available alternative route | **Must** | AI Engineer | Prevents hallucination |
| F4 | Retrieval-only fallback when the model is unavailable | **Must** | Backend Engineer | Product never becomes useless |
| F5 | No-JavaScript static fallback listing answers and routes | **Must** | Frontend Engineer | Accessibility, and the finding that motivated the project |
| F6 | Single-`<script>`-tag embeddable widget | **Must** | Frontend Engineer | Deployable on any of the 12 properties |
| F7 | Source panel: every citation links to the real page | **Must** | Frontend Engineer | Lets the user verify the assistant |
| F8 | Plain-language "I am not sure" and "who to contact" out-of-band links | Should | Product Designer, Frontend | No-JS users get the same value |
| F9 | Corpus refresh pipeline with change detection and a delta report | Should | AI Automation Engineer | Keeps the system true; human approval required |
| F10 | In-product user feedback control | Should | Frontend, QA | Feeds the improvement log; collects no identity |
| F11 | Chained query handling ("and the fee?") | Could | AI Engineer | Only if S1 is already met |
| F12 | WhatsApp-link previews / share cards for the widget | Could | Frontend, DevOps | Nice-to-have; deprioritised |

**Deliberately absent:** accounts, user profiles, analytics dashboards,
translations, voice, images, live portal APIs, native apps, any write action.
Each exclusion is recorded with its reason so the reflective statement can
distinguish a decision from an oversight.

### 2.2 Deliverables — the capstone submission package

| # | Required submission item | Accountable role | Format |
|---|---|---|---|---|
| 1 | Project concept note | Product Manager | `02-CONCEPT-NOTE.md` |
| 2 | Project plan | Project Manager | `03-PROJECT-PLAN.md` *(this document)* |
| 3 | Final product or prototype | Solution Architect | Live URL + repository + demo video |
| 4 | Technical / production documentation | Backend Engineer | Architecture, setup, user guide, known limitations |
| 5 | Testing and validation evidence | QA Engineer | Reports, gold set, defect log, metrics table |
| 6 | Team contribution statement | Entire team | Collaborative statement, submitted once |
| 7 | Presentation / demo | Project Manager | Slides + live demo + recording |
| 8 | Reflective statement | Product Manager | Lessons, challenges, ethics, next steps |
| 9 | Sources and attribution list | DevOps Engineer | Libraries, models, APIs, assets, AI tools used |
| 10 | Authenticity declaration | Entire team | Team declaration, submitted once |

Supporting artefacts: `00-PROJECT-BRIEF.md` (audit), `01-TEAM-AND-ROLES.md`
(team and boundaries), and the repository itself (commit history as evidence of
the development sequence, including which defects were found when and what was
done about them).

---

## 3. Work breakdown and milestones

Nine milestones, mapped to the capstone's own stages. Durations are indicative
and expressed in working days from a common start.

### Milestone 1 — Orientation, topic selection, team formation
**Days 1–2 · Lead: Project Manager**

- Confirm the 11 roles and fill them against the programme records.
- Distribute and agree the boundary contract in `01-TEAM-AND-ROLES.md`.
- Establish the repository, branch protection, and the project board.
- Every member reads the capstone guidelines and signs that they have.

**Exit:** repository live, roles filled, boundaries signed by all 11.

### Milestone 2 — Problem definition and scope approval
**Days 3–6 · Lead: Product Manager**

- Complete and evidence the audit (D1).
- Finalise the problem statement, personas, and success measures (D2, S1–S12).
- Produce the concept note (D3).
- **Submit the concept note and this plan to the trainer/facilitator for scope
  approval.**
- Freeze scope; open the change log.

**Exit:** **trainer approval recorded.** No implementation starts before this
gate — as the guidelines require.

### Milestone 3 — Design review: architecture, plan, risks, ethics
**Days 7–11 · Lead: Solution Architect**

- Architecture diagram and context diagram (D5).
- ADRs: RAG over fine-tuning; ONNX embeddings over PyTorch; brute-force search
  over a vector index; SQLite store over a database server; no-auth read-only
  design.
- Freeze interface contracts I1–I6 (D6).
- Design: flows, wireframes, accessibility specification (D7).
- Privacy impact assessment and consent position (D14, partial).
- Risk register v1; cost ceiling agreed.

**Exit:** all ADRs accepted; all six interface contracts frozen and versioned;
accessibility targets agreed.

### Milestone 4 — Gold set and test strategy frozen — **before any implementation**
**Days 8–12, in parallel · Lead: QA Engineer**

- Write the 50 gold questions and expected answers from the audit evidence.
- Write the 20 paraphrase questions with no shared keywords.
- Write the out-of-scope set for refusal testing.
- Write the functional, accessibility, and fallback test cases.
- **Commit the gold set with a timestamp earlier than the first implementation
  commit.**
- Baseline: run the keyword-matching baseline.

**Exit:** provenance of the gold set demonstrably pre-dates implementation. This
is the single most important integrity gate in the project; if it slips, the
evaluation is worthless and must be re-run with a new set.

### Milestone 5 — Corpus, prompts, and retrieval
**Days 10–16 · Lead: AI Engineer**

- Curate ~30–50 published pages to Markdown with a provenance record (D8).
- Build the reconciled routing table with per-row provenance (D8).
- Choose and configure chunking and embeddings; document the rationale (D9).
- Design, version, and iterate the prompt; implement citation enforcement and
  refusal (D9).
- Build the evaluation harness and the limitations analysis (D10).

**Exit:** retrieval working end-to-end in a notebook or CLI; harness runs and
produces all measures; limitations documented **before** optimisation begins.

### Milestone 6 — Midpoint check: working prototype
**Days 17–20 · Lead: Solution Architect**

- Backend API service and the retrieval-only fallback (D11).
- Frontend chat widget, citation panel, and embed mechanism (D12).
- CI/CD, deployment, monitoring, health checks, cost ceiling (D15).
- Midpoint review against Milestone 2 approval.

**Exit criterion defined in advance:** *a working prototype reachable at a live
URL, answering at least 10 hand-checked questions with correct citations, with
the routing table returning correct destinations.* Anything less is a partial
pass and triggers the recovery path in Section 5, Risk R1.

### Milestone 7 — Testing, improvement, and validation
**Days 21–27 · Lead: QA Engineer**

- Execute functional, usability, accessibility, fallback, and regression tests.
- Run the full evaluation; record results verbatim, including failures.
- Iterate against S1–S12; log every change and its effect.
- Run the 10-tester task-completion study with and without the assistant.
- Threat model finalised; security assessment; licence scan; privacy review
  (D14).
- Automation pipeline: snapshot, diff, delta report, human approval queue (D13).
- Test reports, defect log, validation evidence pack (D17).

**Exit:** evidence pack complete; no unresolved high/critical security finding;
every measure either met or reported as a miss with an explanation.

### Milestone 8 — Documentation, team statements, final submission
**Days 28–31 · Lead: Backend Engineer (docs) / Project Manager (coordination)**

- Technical documentation: architecture, setup and run, user guide, known
  limitations (D18).
- Sources and attribution list, including all AI-tool use (D9 submission item).
- Team contribution statement (D19).
- Reflective statement (D20).
- Team authenticity declaration.

**Exit:** the submission checklist in the capstone guidelines is verifiably
complete — every box evidenced by a named artefact.

### Milestone 9 — Demonstration, oral defence, and assessment
**Days 32–35 · Lead: Project Manager**

- Slides and demo script; live demo plus a recording as contingency.
- **Individual mock oral defences** — every member defends their own artefact
  unaided, because the guidelines confirm assessors will ask individual
  questions and may set an individual practical task.
- Evidence pack indexed to the rubric; deliverable matrix closed out.
- Submission.

**Exit:** every member has demonstrated unaided command of their own
deliverable; the full package is submitted.

### 3.1 Critical path

```
M2 Scope approval ──> M3 Contracts frozen ──> M6 Prototype ──> M7 Validation ──> M9 Defence
        │                        │                    │              │
        └──> M4 Gold set frozen ─┴────────────────────┴──────────────┘
```

**M4 is a hard predecessor of any implementation work.** The gold set must be
committed before the first line of implementation. This is non-negotiable: the
whole evidentiary value of the project depends on it.

### 3.2 Parallelisation

M4 (QA), M5 (AI), and M7's security work are independent of the API and the
widget, so they proceed from Day 8 in parallel rather than queueing behind
Backend work. Given 11 roles, this parallelism is what makes a 35-day plan
realistic.

---

## 4. Roles and responsibilities

Full definitions, boundaries, and definitions of done are in
`01-TEAM-AND-ROLES.md` and are not repeated here. Summary:

| Role | Owns for this project | Top three deliverables |
|---|---|---|
| Product Manager | Problem, users, scope freeze, success measures, client | D1, D2, D3 |
| Project Manager | Plan, schedule, risk, deliverables matrix, coordination | D4, D21, submission tracking |
| Solution Architect | Architecture, ADRs, interface contracts, technical integrity | D5, D6, ADR sign-offs |
| Product Designer | Flows, wireframes, accessibility specification | D7 |
| AI Engineer | Corpus, chunking, embeddings, retrieval, prompts, evaluation, limitations | D8, D9, D10 |
| Backend Engineer | API service, fallback mode, technical documentation | D11, D18 |
| Frontend Engineer | Embeddable widget, citations, fallbacks, bundle | D12 |
| AI Automation Engineer | Corpus refresh, change detection, delta reports, publish queue | D13 |
| Cyber Security Engineer | Threat model, prompt-injection defence, privacy review, licence scan | D14 |
| DevOps Engineer | CI/CD, deployment, monitoring, cost ceiling, attribution list | D15 |
| QA / QC Engineer | Gold set, test strategy, execution, evidence pack, release recommendation | D16, D17 |

**Gate approval authority:** trainer/facilitator approves scope at M2. QA
recommends release at M7. Cyber Security holds a veto. Only the client and
trainer jointly may waive a security finding, and the waiver is recorded.

---

## 5. Risks, dependencies, and mitigation

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| **R1** | **Gold set frozen after implementation begins**, invalidating the entire evaluation | Medium | **Critical** | M4 runs Days 8–12 in parallel; CI check refuses implementation commits that post-date the gold-set commit; a late freeze forces a **new** gold set, not a repaired one | QA |
| R2 | Client publishes nothing new, or cannot confirm canonical contacts; the routing table contains disputed rows | High | Medium | Proceed on published evidence; mark every unconfirmed row *unverified* in the UI; keep client involvement off the critical path | PM |
| R3 | Hallucinated fee, deadline, or contact detail | Medium | **Critical** | Citation enforcement; refusal behaviour; 100% groundedness threshold; out-of-scope test set; keyword baseline for comparison; a "verify before you rely on this" notice | AI Eng |
| R4 | Prompt injection — a user plants text in a query to extract the system prompt or override grounding | Medium | High | Input sanitisation; system-prompt isolation; output filtering; injection cases in the security test set; the read-only, no-auth design limits the blast radius to bad text on screen | Cyber Sec |
| R5 | LLM API unavailable, rate-limited, or out of free credit at demo time | Medium | High | Retrieval-only fallback; health check and alert; a recorded demo as contingency; the product is designed so this failure is a graceful degradation, not an outage | Backend, DevOps |
| R6 | Corpus pages change or disappear after curation | Medium | Medium | Refresh pipeline with change detection; per-row provenance; delta report; source links let users verify | AI Automation |
| R7 | Scope creep from an enthusiastic client or team member | High | Medium | Scope freeze at M2; every addition must name what it displaces; the PM's decision log | PM |
| R8 | Over-claiming benefit in the portfolio — asserting the system "solves" the problem | Medium | High | Concept note and reflective statement state the narrow claim; the excluded-scope list is published; limitations documented before optimisation, not after | PM, AI Eng |
| R9 | Cost overruns on free tiers once limits are exceeded | Low | Medium | Cost ceiling with an enforced shutdown policy; caching; a documented monthly estimate | DevOps |
| R10 | Role collapse — a few members do the work, others cannot evidence theirs | Medium | **Critical** for the capstone | Enforced boundaries; a deliverable matrix with exactly one owner per item; a mock oral defence at M9 that exposes it | PM, Solution Architect |
| R11 | Accessibility failures discovered late, requiring a redesign | Medium | Medium | Accessibility targets agreed at M3, not at M7; QA tests against the Designer's written specification | Designer, QA |
| R12 | A team member is unavailable, or the team is smaller than 11 | Medium | Medium | Documented merge order in `01-TEAM-AND-ROLES.md`; QA is never merged into engineering | PM |
| R13 | Assessment against a rubric weighted 25% to technical quality, with a small product | Low | Medium | Depth over breadth: grounding, evaluation integrity, and documentation quality are where the marks are; a narrow project done rigorously outscores a broad one done superficially | Solution Architect |

### 5.1 Dependencies

| Dependency | Type | Needed by | Fallback |
|---|---|---|---|
| Trainer/facilitator scope approval | **Hard gate** | M2 exit | Cannot proceed. Escalate to the programme team. |
| University pages publicly readable | Hard | M5 | Abundant substitutes exist; already validated in the audit |
| Embedding model availability | Hard | M5 | Alternative open-weights model; the ADR records the trade-off |
| LLM API free tier | Soft | M5 | Retrieval-only mode; the product still functions |
| Free-tier hosting | Soft | M6 | Local or LAN demo as an interim; no client data is involved, so this is low risk |
| 10 volunteer testers | Soft | M7 | Team members as substitutes; the reduced sample size is declared as a limitation |

**Note on the single hard gate.** The trainer's scope approval is the only
genuine external blocker, and it is a required part of the capstone process
rather than a project risk. Everything else has a documented fallback that
degrades the outcome but does not stop the project.

---

## 6. Accessibility and inclusion considerations

Accessibility is a **design constraint fixed at M3**, not a final QA check. This
is deliberate: the problem this project addresses was itself caused by an
implementation that excluded users, and repeating that error in the solution
would be indefensible.

| Consideration | Design response | Verified by |
|---|---|---|
| **No-JavaScript users** | A fully static, server-rendered answer-and-routing page. Not a degraded error state — a real, complete experience. | QA S8 |
| **Screen-reader users** | Semantic HTML, ARIA only where native semantics are insufficient, every citation announced, focus management on message insert, live regions used correctly. | QA S7 |
| **Keyboard-only users** | Full keyboard operability, visible focus indicators, logical focus order, no keyboard trap, skip link. | QA S6 |
| **Low bandwidth** | Small initial payload; no auto-loading of the model; text-first responses; citations are links, not images. | Frontend, QA |
| **Low-end devices** | No WebGL, no heavy client-side computation, no framework requirement at the embed site. | Frontend |
| **Low literacy / plain language** | Short sentences, no jargon, no unexplained acronyms, a "show me the phone number" shortcut. Reviewed by the Designer against real user wording. | Designer, QA |
| **Colour and contrast** | WCAG AA contrast targets minimum; never colour as the sole indicator of citation status or error. | QA |
| **Language** | Nigerian English as the working language, matching the audience. Multilingual support is declared out of scope for v1 and recorded as a v2 candidate. | PM |
| **Gender** | The product serves all applicants. Persona research is not narrowed to a subset, and the corpus is free of gender-specific assumptions. | PM, Designer |
| **Assistive technology** | Guidance on support needs is requested from the programme team early, as the guidelines direct. | PM |
| **Reasonable support for team members** | Adjustments — extended time, accessible formats, alternative presentation routes, assistive technology, approved alternative team roles — are requested early and must preserve the competency being assessed. | PM |

**The critical design test.** If the assistant is not usable with JavaScript
disabled, the project has rebuilt the problem it was created to solve. F5 is
therefore a must-have, not a nice-to-have.

---

## 7. Ethical, privacy, safety, and intellectual-property considerations

### 7.1 Privacy and consent — the strongest position available

- **No personal data is collected.** No accounts, no names, no email addresses,
  no phone numbers, no IP-based identity, no cookies for tracking, no
  cross-session profiling.
- **No personal data is logged.** Logs record latency, status, model
  identifier, token counts, and error codes. They do not record the content of a
  user's question. Where a query must be inspected to debug a fault, it is
  handled as an opt-in diagnostic that the user can switch off.
- **No user query is used to train or fine-tune any model.** This is stated in
  the product's terms of use and verified by the Cyber Security Engineer.
- **No consent is required, because no personal data is gathered** — the simplest
  possible position under data-protection law, and the reason it was chosen.
- User feedback (F10) is a rating and optional free text with no identity field.
- **No third-party transmission of user content** beyond the model API call
  required to answer, which is disclosed in the terms of use. Nothing is used for
  advertising or analytics.

### 7.2 Accuracy and integrity

- **The assistant cites or it does not assert.** Uncited factual claims are
  suppressed (F1, S2 = 100%).
- **It refuses rather than guesses** (F3, S3 = 100%). Out-of-scope questions
  receive an explicit "I don't have that information" plus the best route.
- **The user's most important action is verification.** Every citation links to
  the real University page, and a standing notice tells users to confirm
  time-sensitive facts — fees and deadlines — with the University directly. The
  assistant is a routing aid, not an authority.
- **Fabrication is prohibited outright**: no invented test results, no invented
  user feedback, no invented metrics. If a test was not run, the report says so.
- **The keyword baseline is always run**, so that the claim that AI is necessary
  is evidenced rather than asserted.

### 7.3 Safety

- **No write actions.** The assistant cannot submit an application, alter a
  record, or call a live portal API. This removes an entire class of harm and
  means a defect can never corrupt client data.
- **No authentication in v1**, so there is no credential handling and no
  access-control surface to breach.
- **Adversarial-input defences** on prompt injection and input sanitisation, with
  a dedicated test set (R4).
- **Rate limiting and input size limits** to contain denial-of-service risk.
- **TLS in transit**, security headers, and no secrets in client-side code.
- **Physical safety:** none. No drone, no hardware, no field equipment, no
  regulated physical activity. The corresponding regulatory and permission
  questions in the drone track's expectations do not apply to this project.

### 7.4 Intellectual property and licensing

- **Our own work:** the corpus is quoted from publicly published University pages
  for the purpose of answering questions about those pages — nominative,
  attributed use. **Every page is cited.** No bulk republication of content is
  presented as ours.
- **Third-party materials:** the embedding model, language model, libraries,
  fonts, and any stock assets are recorded in the attribution list with their
  licences, and scanned by the Cyber Security Engineer.
- **Respect for data-use restrictions:** only publicly accessible pages are
  used. No authentication is attempted, no paywalled or restricted content is
  accessed, and no page is crawled at a rate that could burden the server —
  curation is manual.
- **Trademarks and endorsement:** the product is clearly labelled as a student
  capstone, not an official University service, and does not purport to speak for
  the institution.
- **Model output terms:** the licence and data-retention terms of the chosen
  language-model API are checked before selection, recorded in the relevant ADR,
  and re-checked if the provider changes.
- **The routing table is a factual directory.** Factual contact information
  published by an institution is not its copyrighted expression; each row is
  nonetheless cited to its source so any correction is traceable.

### 7.5 Disclosure of AI tool use

Consistent with the guidelines: any generative AI used as a learning or
production aid is **disclosed in the attribution list**, the work is verified,
and the team remains accountable for the result. No AI-generated
content is presented as independently authored research, and no AI-generated
result is submitted as a test outcome that was not actually run.

---

## 8. Planned testing and validation method

Testing is proportionate to the project and mapped to the three evidence classes
the guidelines accept: functional and usability tests, user feedback, and
demonstration against defined acceptance criteria.

### 8.1 Test layers

| Layer | Method | Owner | Output |
|---|---|---|---|
| **Unit** | Chunking, cosine similarity, routing-table lookup, citation parsing, prompt-output validation | AI Eng, Backend | Coverage report |
| **Integration** | Frontend → API → retrieval → model, including the retrieval-only path and model-unavailable path | Backend, Frontend | Integration report |
| **Contract** | I1–I6 conformance, verified by the consumer, not the producer | Solution Architect | Contract test report |
| **Functional** | Each F1–F10 feature against its acceptance criterion | QA | Functional test report |
| **AI quality** | The 50 gold questions, 20 paraphrases, and the out-of-scope set | AI Eng, QA | Metrics table S1–S4 |
| **Accessibility** | Keyboard-only, screen reader, contrast, focus order, no-JS fallback, WCAG-aligned checks against the Designer's written spec | QA, Designer | Accessibility report S6–S8 |
| **Usability** | 10 testers × 3 real routing tasks, with and without the assistant; think-aloud; time-to-route and wrong-turn errors recorded | QA, Designer | Usability report S5 |
| **Security** | Prompt-injection cases, input sanitisation, secrets scan, dependency and licence scan, TLS and header check, rate-limit verification | Cyber Sec | Security assessment S9 |
| **Performance** | Response latency, cold-start, concurrency, failure behaviour | DevOps, Backend | Performance report |
| **Cost** | Token and hosting consumption against the ceiling | DevOps | Cost report S11 |
| **Regression** | Full re-run of the gold set on every change to prompts, corpus, or retrieval config | QA | Regression log |
| **Operational** | Deploy, health check, alert fires, rollback demonstrated, refresh pipeline detects a change and queues it for approval | DevOps, AI Automation | Runbook evidence |

### 8.2 Validation method — the integrity requirements

1. **The gold set is frozen before implementation** and is version-controlled
   with a timestamp earlier than the first implementation commit. Enforced by a
   CI check. This is the difference between a real evaluation and a
   demonstration.
2. **Two independent runs.** The evaluation is run once at the midpoint and once
   at final release, so improvement is evidenced rather than asserted.
3. **A keyword-matching baseline is always run**, so that the necessity of the AI
   approach is measured.
4. **Results are recorded verbatim**, including failures, with the exact prompt
   version, corpus version, and model identifier for each run. Without those
   three version stamps a result cannot be reproduced and is not admissible as
   evidence.
5. **Defects are re-tested by QA, not closed by the author.** A fix is verified
   by a role other than the one that wrote it.
6. **Negative and out-of-scope testing is mandatory.** A system that only ever
   answers correctly when asked a question it was tuned on has not been
   evaluated, it has been demonstrated.
7. **Limitations are documented before optimisation starts**, so that the
   limitations section describes the real system rather than a flattering
   memory of it.
8. **Tester identity and consent:** the 10 usability testers give informed
   consent, are told the session is observed, may decline at any point, and are
   not identifiable in the report. Their questions are not retained.

### 8.3 Acceptance criteria for release

The build is releasable only when **all** of the following hold:

- S1 ≥ 90%, S2 = 100%, S3 = 100%, S4 ≥ 80%;
- S6, S7, S8 = 100%;
- S9 = 0 unresolved high or critical findings; S10 = 0 personal data records;
- S11 within the enforced cost ceiling;
- every F-feature marked *Must* is implemented and tested;
- documentation, user guide, and known limitations complete;
- QA has issued a written release recommendation.

**If a threshold is missed, the result is reported as a miss** in the validation
evidence, together with the analysis of why, and the next improvement step. The
guidelines do not permit passing on the strength of an attractive-looking product
alone, and the team will not report a number it did not measure.
