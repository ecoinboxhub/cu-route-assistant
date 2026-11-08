# 01 — Team Structure, Role Boundaries & Interfaces

**Project:** CU Route Assistant — grounded AI information and routing assistant
**Team size:** 11 roles
**Governance model:** Single-threaded ownership. Every deliverable has exactly one
accountable role. No shared ownership.

This document is a boundary contract, not an org chart. Each role owns a
distinct, non-overlapping set of artefacts and is explicitly forbidden from
producing another role's artefacts. This exists for two reasons: professional
software practice, and the IDEAS capstone requirement that **no participant
receives credit for work they cannot explain, demonstrate, or evidence**.

---

## 1. Why boundaries are enforced strictly

The capstone guidelines state that "a team may share a product, but no
participant will receive credit for work they cannot explain, demonstrate, or
evidence," and that assessors will ask individual questions and may require an
individual practical task to verify authorship.

In an 11-role team on a deliberately small project, the main risk is not
conflict — it is **role collapse**, where two or three people quietly do
everything and the remaining eight have nothing to evidence. Enforced boundaries
are the control against that.

**The six boundary rules:**

1. **One primary accountability per role.** A role owns its deliverables
   alone. Where one role genuinely assists another, the help is recorded as
   assistance in the role matrix below and disclosed in the project attribution
   list.
2. **No role holds production authority over another role's artefact.** The
   Backend Engineer does not deploy. DevOps does not change application code. The
   Cyber Security Engineer does not build features. AI Automation does not
   change the retrieval algorithm.
3. **Escalation, never lateral override.** A blocked role escalates to the
   Solution Architect (technical) or the Product Manager (scope or priority). The
   Project Manager records the escalation and its resolution. Nobody simply does
   the other person's job to move faster.
4. **No role approves its own work.** QA does not grant release approval. The
   Project Manager does not approve their own schedule. The Cyber Security
   Engineer requires a second reviewer to sign off their own remediation. This
   rule is what makes the QA and security sign-offs worth anything.
5. **Written output per role.** Each role produces a named document or artefact.
   Verbal-only contributions do not count as evidence.
6. **Every role must be independently demonstrable.** If a member cannot open
   their own artefact, run their own check, and explain their own decisions
   unaided, the boundary has been violated and the work is not creditable.

---

## 2. Role definitions

### 2.1 Solution Architect

**Mission:** own the technical integrity of the whole system and the reasoning
that connects it to the problem.

**Owns:** system architecture and context diagram; technology selections and
the trade-off reasoning behind each; Architecture Decision Records (ADRs);
the interface contracts between components; technical risk register; the
feasibility verdict on the Product Manager's scope; review of every role's
artefact for technical coherence.

**Explicitly does not own:** production code; user interface design; the project
schedule; product prioritisation; deployment.

**Boundary rule:** may not implement. Their contribution to the build is
decisions and contracts, not code.

**Definition of done:** a reviewed architecture diagram, a signed ADR for every
material technology choice (each stating the alternatives rejected and why), and
published interface contracts that Backend, Frontend, AI, and Automation build
against without renegotiating them informally.

---

### 2.2 Product Manager

**Mission:** own the problem, the users, the scope, and the definition of value.

**Owns:** the problem statement and its evidence base; user personas and the
primary/secondary user distinction; the feature backlog and priority order; the
scope freeze; success measures and their thresholds; the client and stakeholder
relationship; the product acceptance criteria; the decision log on what is
out of scope.

**Explicitly does not own:** technical design; implementation; the schedule;
test execution.

**Boundary rule:** may not resolve a technical question by fiat, and may not
expand scope after the scope freeze without a documented trade-off — every
addition must name what it displaces.

**Definition of done:** an approved concept note with a problem statement traceable
to the audit evidence, a prioritised backlog, a frozen scope, and measurable
acceptance criteria signed by the trainer or facilitator.

---

### 2.3 Project Manager

**Mission:** own time, dependencies, risk, and the completeness of delivery.

**Owns:** the project plan, work breakdown, and milestone schedule; the
dependency and critical-path register; the risk register with mitigations; the
meeting cadence, minutes, and action log; the status reporting; the deliverable
tracking matrix showing every required capstone submission item and its owner;
blocker and escalation log; handover and close-out.

**Explicitly does not own:** what the product should do; how it is built; the
quality of any individual's work product.

**Boundary rule:** does not set priorities (Product Manager) and does not
challenge technical feasibility (Solution Architect). The Project Manager's
instrument is visibility, not authority over content.

**Definition of done:** a plan with milestones traceable to the capstone's own
stages, a live risk register, a complete deliverable matrix, and a final
submission checklist that is demonstrably full.

---

### 2.4 Product Designer

**Mission:** own how the user experiences the problem and the solution.

**Owns:** usability review of the current fragmented experience; user flows for
the three primary journeys; wireframes and the final interface design; the
chat and fallback experiences; the citation and routing-result presentation
pattern; accessibility design to WCAG-aligned criteria, including a
non-JavaScript fallback that remains fully usable; the design system tokens for
consistency.

**Explicitly does not own:** implementation of the design; infrastructure;
retrieval behaviour.

**Boundary rule:** does not write production code. A designer's deliverable is a
specification a Frontend Engineer can build from without asking what was meant.

**Definition of done:** user flows, annotated wireframes, a written accessibility
specification with target contrast and focus-order requirements, and a documented
design decision for presenting source citations such that a non-specialist can
act on them.

---

### 2.5 AI Engineer

**Mission:** own everything that makes the assistant intelligent, and the
evidence that it is.

**Owns:** the curated knowledge corpus and its provenance record; the chunking
strategy; the embedding model selection; the retrieval strategy and its
parameters; prompt design and revision; citation enforcement and the
refusal-to-answer behaviour; the evaluation harness; the measurement of
groundedness, routing accuracy, and paraphrase robustness.

**Explicitly does not own:** corpus freshness in production (AI Automation owns
that); the web interface; the API service; infrastructure.

**Boundary rule:** may not change the corpus without recording provenance, and
may not weaken a grounding control to make a test pass. All prompt changes are
version-controlled and reversible.

**Definition of done:** a versioned prompt file, a documented retrieval
configuration, the evaluation harness producing all three measures from
Section 6 of the Project Brief, and a written limitations analysis covering
hallucination risk, out-of-scope questions, and the conditions under which the
system should refuse to answer.

---

### 2.6 Backend Engineer

**Mission:** own the server-side contract and its reliability.

**Owns:** the API service; the request-handling and session logic; integration
with the AI Engineer's retrieval component; input validation; rate limiting;
structured logging with a privacy-preserving design; error handling and
graceful degradation when the model is unavailable; the API contract
documentation.

**Explicitly does not own:** prompt design; embedding or retrieval tuning; the
user interface; deployment pipelines.

**Boundary rule:** owns the interface to the AI component but not the AI logic
behind it. Retrieval-parameter changes are an AI Engineer decision routed
through the Solution Architect, never edited silently in service code.

**Definition of done:** a documented, versioned API contract; a working service
with a **retrieval-only fallback mode** that keeps the product usable when the
language model is unavailable — a condition the Product Manager will test for;
and a demonstration that no personal data is persisted.

---

### 2.7 Frontend Engineer

**Mission:** own the embeddable interface.

**Owns:** the chat widget implementation; the single-`<script>`-tag embedding
mechanism; client-side state and accessibility behaviour; rendering of answers,
citations, and routing cards; bundle size; graceful degradation to the static
fallback; the non-JavaScript fallback experience specified by the Designer.

**Explicitly does not own:** visual and interaction design decisions; server
logic; retrieval.

**Boundary rule:** implements the designer's specification. Where a specification
is ambiguous or unusable, the disagreement is raised to the Product Manager as a
scope or design decision and recorded — it is not settled unilaterally in code.

**Definition of done:** a widget embeddable on any of the University's
properties with a single tag and no build step required of the host; a working
fallback for both no-JavaScript and no-network conditions; keyboard-operable
and screen-reader-verified, with evidence from QA.

---

### 2.8 AI Automation Engineer

**Mission:** own how the assistant stays true over time, without anyone
hand-editing it.

**Owns:** the corpus refresh pipeline; scheduled re-ingest; change detection
between snapshots; generation of a human-readable delta report listing what
changed, was added, and disappeared; the reconciled routing-table draft and its
provenance; the draft-refresh and publish workflow; a no-change monitoring
signal. Every generated change is **drafted and queued for human approval** —
never auto-published.

**Explicitly does not own:** the retrieval algorithm; the prompt; the user
interface; the decision to publish (that is the client's).

**Boundary rule:** may not auto-publish. May not alter retrieval behaviour.
Automating the *production* of content never automates the *approval* of it.

**Definition of done:** a runnable pipeline that takes a snapshot, produces a
diff report, and opens a review item; a documented run showing a change correctly
detected and correctly held for approval; a recovery path if the pipeline fails.

---

### 2.9 Cyber Security Engineer

**Mission:** own the safety of the system and the data it handles, and hold the
power to block the release.

**Owns:** the threat model; prompt-injection defence and input sanitisation;
secrets handling and credential rotation; authentication and authorisation
review for any endpoint that requires them; TLS, security headers, and
transport security; a privacy and consent compliance review; dependency and
software-licence scanning; the vulnerability assessment; the data-retention and
anonymisation policy.

**Explicitly does not own:** feature implementation; infrastructure
provisioning; performance tuning.

**Boundary rule:** holds an explicit veto. May halt the release for a security
or privacy defect without seeking consensus. In return, every finding must
include a reproduction and a proposed remediation, and a vulnerability the team
has declined to fix must be recorded as an accepted, signed risk with a reason
— never silently dropped.

**Definition of done:** a threat model covering at least prompt injection,
data exfiltration, and denial-of-service; a privacy review confirming that no
personal data is collected, logged, or used for training; a licence-scan report;
and either a clean assessment or a documented, accepted risk register.

**Note on scope:** because v1 collects no personal data and requires no login,
this role's workload is genuinely small by design. The role is retained because
prompt injection against a retrieval system is a real attack surface even in a
read-only product, and removing the role would be the wrong trade.

---

### 2.10 DevOps Engineer

**Mission:** own the path from a commit to a running, observable, recoverable
service.

**Owns:** CI/CD pipelines; environment provisioning and secrets injection;
deployment and rollback; monitoring, health checks, and alerting; the
infrastructure-as-code definition; the cost ceiling and its monitoring; log
aggregation; backup and restore.

**Explicitly does not own:** application code; test design; product features;
model behaviour.

**Boundary rule:** does not change application code to fix a deployment problem.
An application defect is reported to the owning engineer with evidence.

**Definition of done:** one-command deploy; a demonstrated rollback; a health
check and an alert on model unavailability; a documented monthly cost estimate
and a spend ceiling with a shutdown policy — the capstone constraint that the
product must remain affordable to run.

---

### 2.11 QA / QC Engineer

**Mission:** own the evidence that the product works, and the right to withhold
release.

**Owns:** the test strategy; the frozen 50-question gold set and its expected
answers, version-controlled *before* build; functional, usability, accessibility,
and regression test execution; defect reporting with reproduction steps; the
re-test cycle; the validation evidence pack required by the capstone guidelines;
the release recommendation.

**Explicitly does not own:** fixing defects in others' code; writing the tests
that the developers wrote for themselves; approving the release alone.

**Boundary rule:** reports and re-tests; does not repair. A developer may fix a
defect in their own code, but the fix is re-tested by QA before closure. Where
QA and an engineer disagree on severity, the Product Manager arbitrates as a
scope or risk decision, recorded in the log.

**Definition of done:** a frozen gold set with a version-control history proving
it predates implementation; a test report covering all three measures from the
Project Brief; an accessibility check against the Designer's specification; a
defect log with resolution evidence; and a written release recommendation.

**Critical integrity requirement:** the gold set is committed to the repository
with a timestamp earlier than the first commit of the AI Engineer's
implementation. Without that provenance, the evaluation proves nothing and
invalidates itself. This is the QA Engineer's first deliverable, not the last.

---

## 3. Interface contracts between roles

Cross-role work fails at interfaces, so each interface is an explicit contract
owned jointly but versioned by a single accountable role.

| # | Interface | Produced by | Consumed by | Contract artefact |
|---|---|---|---|---|
| I1 | Retrieval service | AI Engineer | Backend Engineer | Versioned API: `query(text, top_k) -> ranked chunks with source URLs` |
| I2 | Public API | Backend Engineer | Frontend Engineer | Versioned OpenAPI spec; error and fallback schema |
| I3 | Design specification | Product Designer | Frontend Engineer | Annotated wireframes, flow diagrams, accessibility spec |
| I4 | Embedding contract | AI Engineer | AI Automation Engineer | Corpus format, chunk schema, refresh trigger |
| I5 | Deployment & secrets | DevOps Engineer | All engineering roles | Environment matrix, secret injection method, deploy/rollback runbook |
| I6 | Defect reports | QA Engineer | Owning engineer | Defect template with reproduction steps and severity rubric |
| I7 | Scope & priority | Product Manager | Entire team | Frozen scope document, backlog, acceptance criteria |
| I8 | Architecture decisions | Solution Architect | Entire team | ADRs; interface contracts I1–I6 |
| I9 | Progress & risk | Entire team | Project Manager | Weekly status format; risk register entries |
| I10 | Security findings | Cyber Security Engineer | Owning engineer, DevOps | Finding with reproduction, severity, remediation, sign-off |

**Change control:** a change to any contract in I1–I6 is raised to the Solution
Architect, who records it as an ADR with a version bump. Contract changes are
never made by a consumer role to suit its own implementation.

---

## 4. Deliverable → role matrix

One accountable role per deliverable. This records the division of work and the
separation of duties between roles. It is not a record of individual
contribution: individuals are not named, and no entry here evidences or claims
anything about who did the work.

| # | Deliverable | Accountable role | Supporting roles |
|---|---|---|---|
| D1 | Audit and evidence base | Product Manager | QA |
| D2 | Problem statement and success measures | Product Manager | Solution Architect |
| D3 | Concept note (Stage 1) | Product Manager | Project Manager, Solution Architect |
| D4 | Project plan, risk register, schedule (Stage 2) | Project Manager | All leads |
| D5 | Architecture diagram and ADRs | Solution Architect | Backend, DevOps, AI |
| D6 | Interface contracts I1–I6 | Solution Architect | Backend, Frontend, AI, DevOps |
| D7 | Flows, wireframes, accessibility spec | Product Designer | Frontend, QA |
| D8 | Curated corpus and provenance record | AI Engineer | AI Automation, Product Manager |
| D9 | Retrieval configuration and prompt design | AI Engineer | Solution Architect |
| D10 | Evaluation harness and limitations analysis | AI Engineer | QA |
| D11 | API service and fallback mode | Backend Engineer | AI Engineer, DevOps |
| D12 | Embeddable chat widget and fallbacks | Frontend Engineer | Product Designer, Backend |
| D13 | Corpus refresh pipeline and delta reports | AI Automation Engineer | AI Engineer, DevOps |
| D14 | Threat model, privacy review, licence scan | Cyber Security Engineer | Solution Architect, Backend |
| D15 | CI/CD, deployment, monitoring, cost ceiling | DevOps Engineer | Solution Architect |
| D16 | Frozen gold set and test strategy | QA Engineer | Product Manager |
| D17 | Test reports, defect log, validation evidence | QA Engineer | All engineering roles |
| D18 | Technical documentation and user guide | Backend Engineer | Frontend, DevOps, AI Engineer |
| D19 | Team contribution statement | Entire team | — |
| D20 | Reflective statement | Product Manager | Entire team |
| D21 | Presentation, demo, and oral defence rehearsal | Project Manager | Entire team |

---

## 5. RACI across the project stages

| Stage | Accountable role | Deliverables | Consulted roles |
|---|---|---|---|
| 1 — Define problem | Product Manager | D1, D2 | QA, Solution Architect |
| 2 — Plan solution | Project Manager | D4 | All leads, trainer/facilitator |
| 3 — Build | Solution Architect | D5, D6, D8–D15 | Product Manager, Cyber Security, QA |
| 4 — Test and validate | QA Engineer | D16, D17 | Entire team |
| 5 — Present and defend | Project Manager | D21 | Entire team |

Columns are named for roles rather than people. The separation the table
describes — in particular QA holding its own approval authority — is a property
of the process, and holds whoever occupies each seat.

**Single approval authority per gate.** The trainer or facilitator approves
scope at the end of Stage 2, as the guidelines require. QA owns the Stage 4
evidence. The Cyber Security Engineer holds a veto that only the client and
trainer jointly can waive.

---

## 6. Resourcing reality check

This must be stated honestly rather than discovered in week six.

**Eleven roles is a large team for a deliberately small product.** That is not a
design flaw — the team is structured to demonstrate the full professional
lifecycle, and an 11-member approved team submission is permitted under the
guidelines. But it carries two real risks:

1. **Some roles will have a genuinely thin workload.** The Cyber Security role
   is small *by design*, because v1 collects no personal data. The AI Automation
   role is a narrow pipeline. A thin role produces less to show, which is a
   resourcing risk as much as a submission one.
2. **Coordination can exceed production.** On a two-week build, meeting and
   synchronisation overhead could plausibly exceed the value of the
   specialisation.

**Mitigations, in priority order:**

- **Each role's definition of done is a real, defensible artefact.** No role is
  decorative. Every role in the matrix above owns at least one deliverable that
  can be opened, run, and explained unaided.
- **If the team is smaller than 11, merge in this order** — DevOps into Backend
  Engineer; AI Automation into AI Engineer; Project Manager into Product
  Manager; Solution Architect into AI Engineer. **Do not merge QA into
  engineering.** Independent testing is the one boundary that cannot be
  collapsed, because a team that tests its own work has no evidence at all.
- **Sequential rather than parallel where sensible.** Roles whose work is front-
  loaded (Product, Design, Architecture) should not wait idly for Backend work to
  start; the corpus curation, prompt design, and gold set are independent of the
  API and can proceed in parallel from day one.

---

## 7. Working agreement

- **Written first.** Decisions live in ADRs, the decision log, and meeting
  minutes — not in chat, and not in memory.
- **Version control is mandatory** for code, prompts, corpus, configuration, and
  the gold set. Dated working files are the fallback where that is impractical.
- **Cite everything.** Datasets, libraries, models, APIs, fonts, images, and any
  AI tool used, disclosed in the attribution list.
- **Honest limitations over quiet omissions.** A documented limitation is
  evidence of rigour. An undeclared gap discovered by an assessor is a failed
  criterion.
- **No fabrication.** No invented user feedback, no invented test results, no
  invented metrics. If a test was not run, the report says so.
- **Disclose AI assistance.** Use of any generative tool is permitted, but must
  be transparent and the work must remain explainable, testable, and owned.
- **The client is the source of truth for institutional facts.** Where the
  assistant's output conflicts with the University, the University is right and
  the corpus is wrong.
