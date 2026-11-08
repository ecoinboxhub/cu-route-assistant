# CU Route Assistant

A grounded AI assistant that answers questions about Cosmopolitan University,
Abuja, and routes people to the right office — using only what the University
itself publishes, and citing every factual claim.

**Deployment status**

The static frontend is live. The API is not deployed yet, so the web app
currently reports "Service offline" and cannot answer questions until the
Render service is approved. The no-JavaScript fallback is served by the API,
so it is unavailable too.

| | URL | Status |
|---|---|---|
| Web app | <https://cu-route-assistant.vercel.app> | Live (Vercel) |
| API | <https://cu-route-assistant-api.onrender.com> | Pending Render approval |
| API health | <https://cu-route-assistant-api.onrender.com/api/health> | Pending |
| No-JavaScript version | <https://cu-route-assistant-api.onrender.com/fallback> | Pending |
| API documentation | <https://cu-route-assistant-api.onrender.com/docs> | Pending |

To bring the API up, approve the Blueprint at
<https://render.com/deploy?repo=https://github.com/ecoinboxhub/cu-route-assistant>
and set `CRA_ALLOWED_ORIGINS` and `CRA_WEB_PUBLIC_URL` to the Vercel origin.
[`docs/operations.md`](docs/operations.md) has the full procedure.

The repository is a monorepo:

- **`backend/`** — the FastAPI service, the curated corpus, the routing table,
  the evaluation sets, and the test suite. Deployed to Render.
- **`frontend/`** — a dependency-free static site. Deployed to Vercel.
- **`docs/`** — architecture, operations, limitations, and attribution.
- **`design/`** — the design system the interface is built from.

---

## The problem it solves

The University runs at least twelve separate web properties, publishes the same
admissions email address differently in four of them, and serves no content at
all to clients that do not execute JavaScript. An applicant asking "how much is
tuition and who do I email" cannot get a reliable answer from the public web.
This is a routing problem, and that is what the product solves.

---

## The two things it does

1. **Answers** a question in plain language, quoting the source and printing a
   citation for every factual claim.
2. **Routes** the user to the correct portal, office, email, or phone number,
   from a single reconciled routing table with per-row provenance.

And, just as importantly, what it does *not* do: it never states a fact the
University has not published, and it never sends a user to an office that does
not own their question. Cosmopolitan University publishes no tuition figure on any
page reachable at audit time, so the assistant says so and gives the applicant
the admissions email. That is the correct behaviour, and the evaluation set
treats any invented amount as a critical failure.

---

## Quick start

Requires Python 3.11 or later. No GPU, no database server, no paid licence.

```bash
git clone https://github.com/ecoinboxhub/cu-route-assistant.git
cd cu-route-assistant

python -m venv .venv
.venv\Scripts\activate                  # Windows
# source .venv/bin/activate             # macOS / Linux

pip install -r backend/requirements.txt

cd backend
uvicorn app.api:app --reload --port 8000
```

Open <http://127.0.0.1:8000/>. The API health check is
<http://127.0.0.1:8000/api/health>, which reports the active embedder, the
degradation state, and the ports the process expects.

`app.api:app` is the combined single-process app: the JSON API under `/api/*`
and the server-rendered, no-JavaScript experience on `/`. It is the shape the
test suite exercises and the shape deployed on Render.

The static frontend in `frontend/` is for Vercel. To run it locally against a
local API, serve the directory with any static server and set the API location:

```bash
# from the repository root
python -m http.server 5173 --directory frontend
# open http://127.0.0.1:5173/?api=http://127.0.0.1:8000
```

### Two processes, one codebase

The backend can also be split into an API process and a page-rendering process.
That split is optional; it exists because the pages do not need the assistant to
render, and loading it anyway costs memory and cold-start time. The deployed
architecture uses one Render process plus the static Vercel site.

```bash
cd backend
uvicorn app.api:backend_app  --port 8003   # JSON API only
uvicorn app.api:frontend_app --port 5020   # pages and widget only
```

Both shapes share exactly one decision path: `Assistant.ask`. A test asserts
that serving a page imports neither `torch` nor `sentence_transformers`, so the
saving cannot be lost quietly.

### No model download? It still runs.

The neural embedder is a 90 MB download on first use. The deployment described
in `render.yaml` runs in the documented lexical mode (`CRA_EMBEDDER=lexical`),
which needs no model and reports `mode: lexical_fallback` in every response and
in `/api/health`, so a degraded run can never be mistaken for a full one.
Measured cost of that degradation: routing accuracy 0.98 against 1.00, and 7 ms
median latency against 72 ms.

The neural path remains available:

```bash
pip install -r backend/requirements-neural.txt
cd backend
CRA_EMBEDDER=auto uvicorn app.api:app --reload      # macOS / Linux
$env:CRA_EMBEDDER="auto"; uvicorn app.api:app --reload   # Windows PowerShell
```

#### Use Python 3.12 for the neural embedder

On Windows, the neural embedder needs PyTorch, and PyTorch does not currently
load on Python 3.14. The oldest release published for `cp314` is 2.9.0, and
2.9.0 introduced a DLL-initialisation failure on Windows that is still open at
2.14.1 ([pytorch#166628](https://github.com/pytorch/pytorch/issues/166628),
[#169429](https://github.com/pytorch/pytorch/issues/169429)). The fix everyone
reports is 2.8.0, which has no `cp314` wheel.

```bash
py install 3.12
py -3.12 -m venv .venv
.venv\Scripts\pip install -r backend/requirements-neural.txt
.venv\Scripts\pip install "torch==2.8.0" --index-url https://download.pytorch.org/whl/cpu
```

CI pins Python 3.12, which is why it is green — the pin is load-bearing.

---

## Routes

| Route | What it is |
|---|---|
| `/` | The assistant, with the widget |
| `/fallback` | The complete experience, no JavaScript required |
| `/api/ask` | `POST {"question": "..."}` — the only write-shaped endpoint, and it writes nothing |
| `/api/routes` | The routing table as data, so any page can render a directory without this service |
| `/api/health` | Build state, active embedder, degradation status |
| `/api/privacy` | Machine-readable statement of the data this service handles |
| `/docs` | OpenAPI UI |

On the dedicated API process, `/` is a short notice naming the API, its docs, its
health check, and the frontend. The frontend process serves no API routes and
returns `404` for `/docs`, `/redoc`, and `/openapi.json`: a Swagger page listing
zero endpoints is a worse advertisement than a 404.

### Embedding the widget

One script tag, on any page:

```html
<script src="https://cu-route-assistant-api.onrender.com/widget.js" defer></script>
```

That is the whole integration. The script loads its own stylesheet relative to
its own URL, mounts inline if the page provides `<div id="cra-root">` and as a
floating launcher otherwise, and posts to `window.CU_ROUTE_API` — served by the
service as `/widget-config.js` so that `script-src` can stay `'self'` with no
`unsafe-inline`. To point it at a different API host, set `window.CU_ROUTE_API`
before the tag and add that origin to the CORS allow-list.

The styling, the mounting, the keyboard behaviour and the failure message are all
covered by `backend/tests/widget_dom_check.mjs`, which runs the real file
against a small fake DOM. A test that greps a script for a string proves the file
was written, not that it works.

---

## Verifying the claims

The evaluation sets in `backend/eval/` were committed **before the first line of
implementation**. That is the difference between a measurement and a
demonstration, and it is checkable:

```bash
cd backend
python scripts/verify_integrity.py     # automated, also runs in CI
git diff 8596c72 HEAD -- eval/*_set.json   # must print nothing
```

The gate runs two independent checks, because one of them was found to be
insufficient. It verifies that the sets *predate* the implementation, **and**
that they are still byte-identical to their state at the freeze commit. The
ordering check alone passed on a test set whose expected answers had been
rewritten in a later commit — the exact failure the gate exists to prevent. See
`backend/eval/CHANGELOG.md` §4, which includes the attack and the fix.

Changes made *in response to* observed failures are disclosed in
`backend/eval/CHANGELOG.md` with before/after numbers. The frozen cases
themselves have never been edited, and the system was changed twice after the
freeze.

### Results

All figures from `python scripts/run_eval.py`, on the frozen sets, with the
versions stamped into `backend/eval/results.json`.

| Measure | Set | Result | Threshold |
|---|---|---|---|
| Routing accuracy | 50 gold questions | **1.00** (50/50) | ≥ 0.90 |
| Paraphrase robustness | 20 reworded questions | **1.00** (20/20) | ≥ 0.80 |
| Refusal correctness | 15 out-of-scope questions | **1.00** (15/15) | 1.00 |
| Groundedness | every answered case | **1.00** | 1.00 |
| Violations | forbidden strings and patterns | **0** | 0 |

### The baseline, run every time

An evaluation that never compares against a simpler alternative is a
demonstration. The keyword-only matcher — no embeddings, no language model — is
scored on the same frozen sets:

| Set | Full system | Keyword baseline |
|---|---|---|
| gold | 1.00 | 0.96 |
| paraphrase | 1.00 | 1.00 |
| out-of-scope | 1.00 | 0.93 |

**This is the most important table in the repository, and it does not flatter
the project.** A keyword matcher gets within 4 points on routing accuracy and
ties on paraphrase robustness. The honest reading is that most of the routing
work in this domain is lexical, because the destinations are named things and
users use the institutional words for them.

The measurable value the semantic component adds is narrower and specific:

- it closes the paraphrase gap that the vocabulary could not (`P06`, a user
  describing a lockout without saying "password" or "portal", is the case that
  motivated the plain-speech vocabulary work);
- it is what makes the *abstention* decisions defensible, since it can tell that
  a question with no institutional content is not merely a question phrased in
  unfamiliar words;
- it holds up on questions nobody anticipated, which a curated keyword list
  structurally cannot.

A project brief claiming "AI is essential here" would not survive this table.
The claim this repository makes is the narrower one that the evidence supports.

### Running the evaluation

```bash
cd backend
python -m unittest discover -s tests -t .        # 173 tests
python scripts/run_eval.py                       # neural embedder
python scripts/run_eval.py --embedder lexical    # no model, degraded mode
python scripts/run_eval.py --baseline-only       # keyword matcher alone
```

---

## How it works

```
question
   │
   ├─ 1. safety screen          harmful / academic-integrity request → refuse + route
   ├─ 2. unpublished topic      University has not published this → decline + who to ask
   ├─ 3. route                  hybrid: 0.62 neural + 0.38 keyword, with a threshold
   ├─ 4. retrieve               exact vector search, then document-level expansion
   ├─ 4.5 domain scope          not about this university at all → decline with the reason
   ├─ 6. abstain                nothing cleared the evidence bar → say so
   └─ 5. compose                verbatim extraction, or a model that is verified first
                                     │
                              answer + citation + destination
```

Every consumer — the API, the widget, the no-JavaScript page, the evaluation
harness — calls the same `Assistant.ask`. There is exactly one decision path, so
what the evaluation measures is what a user gets.

**Grounding is structural, not aspirational.** The default composer cannot invent
a fact because it cannot write one: every sentence it emits is a span retrieved
from a cited document, and a test asserts that character for character. When a
language model is configured, its output must carry resolvable citation markers
and is discarded in favour of extraction if verification fails. A model can make
the product better and cannot make it ungrounded.

**Abstention overrides everything.** It is applied last and wins over all of the
above. When nothing clears the evidence threshold the system says it does not
know, rather than dressing a weak match up as an answer.

### Why these choices

| Decision | Rationale |
|---|---|
| RAG, no fine-tuning | No training data exists, and grounding becomes inspectable |
| Brute-force search, no vector index | An index is premature at 25 chunks; documented as a v2 step |
| SQLite-free, in-memory index | No database server to operate |
| Extractive by default | A composer that cannot write cannot hallucinate |
| Model optional | The product works at demo time with the model down; degradation is a designed state |
| No auth, read-only, no accounts | Removes the entire credential and data-protection surface |
| `all-MiniLM-L6-v2` | 22 MB of weights, CPU-only, no GPU, no paid licence |
| Lexical mode in production | 0.98 routing accuracy without a 2 GB dependency or a 90 MB model download |

---

## Privacy and safety

Stated as commitments, and each one is checkable rather than asserted:

- **No personal data is collected.** No accounts, no cookies, no analytics, no
  IP-based identity, no cross-session profiling.
- **No personal data is logged.** Logs carry status, latency, model identifier,
  token counts, and error codes. Not the content of a question.
- **No user query is used to train or fine-tune any model.**
- **No write actions.** The assistant cannot submit an application, alter a
  record, or call a live portal API. A defect cannot corrupt client data.
- **No consent is required, because there is no personal data to consent to.**

`GET /api/privacy` publishes all of this as JSON, so the claim does not depend on
anyone reading a policy page.

Security controls: input length limits, a fixed-window rate limiter, TLS in
transit, a safety gate that refuses unauthorised-access and academic-integrity
requests *before* retrieval, and a set of response security headers —
`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` — set by
`backend/app/api.py` on every response including errors.

The CSP is `script-src 'self'` with no `unsafe-inline` and no `unsafe-eval`,
which holds because the widget builds its DOM with `createElement` and
`textContent` rather than innerHTML. `style-src` does allow `'unsafe-inline'`, a
real and accepted relaxation: `/fallback` carries its stylesheet in a `<style>`
block so the no-JavaScript page needs no second request.

Rejected questions are answered with a 422 that names the field, the location and
the reason but **not the value**. Pydantic attaches the submitted input to every
validation error it raises, so a 20 KB over-length question used to come back
inside the error body — larger than any answer the service gives, and handed to
whatever intermediary logged the response.

---

## Deployment

| Component | Host | Configuration |
|---|---|---|
| Backend (`backend/`) | Render | Blueprint in [`render.yaml`](render.yaml); `uvicorn app.api:app`; `CRA_EMBEDDER=lexical` |
| Frontend (`frontend/`) | Vercel | Static site; no build step; API location in `frontend/config.js` |

The Render service trusts the platform proxy (`CRA_TRUST_PROXY=true`) so the rate
limiter counts visitors rather than the proxy, and it accepts browser requests
only from the Vercel origin (`CRA_ALLOWED_ORIGINS`). There is no wildcard: the
API has no authentication, and an open CORS policy would let any site use it as
an oracle.

Deployments are reproducible from the repository:

```bash
# Backend: approve the Render Blueprint once; every later push to main deploys.
# https://render.com/deploy?repo=https://github.com/ecoinboxhub/cu-route-assistant

# Frontend: Vercel is Git-connected to main, so a push deploys it.
# To deploy by hand instead:
cd frontend
npx vercel@latest --prod
```

See [`docs/operations.md`](docs/operations.md) for the full deployment,
verification, monitoring, and rollback procedure.

---

## Layout

```
backend/
  app/            HTTP interface, pipeline, router, retriever, composer,
                  scope, safety, server-rendered fallback, widget assets
  data/
    corpus/       12 curated pages, with retrieval date and verification per page
    routing_table.json   29 destinations, 12 unpublished topics, per-row provenance
  eval/           The three frozen sets, and the results stamped with versions
  scripts/        Build the index, run the evaluation, verify the integrity gate,
                  and diff a proposed corpus refresh against the committed corpus
  tests/          173 tests, including the widget run against a fake DOM
frontend/
  index.html      Static, dependency-free frontend
  styles.css
  app.js
  config.js       The API location
  vercel.json     Security headers and the API origin in connect-src
docs/             Architecture, operations, limitations, attribution
design/           Design system
render.yaml       Render Blueprint for the backend
```

---

## Documentation

| Document | What is in it |
|---|---|
| [docs/architecture.md](docs/architecture.md) | How the system is put together, and the decisions behind it |
| [docs/operations.md](docs/operations.md) | Running it, deploying it, monitoring it, rolling it back |
| [docs/known-limitations.md](docs/known-limitations.md) | What it cannot do, stated plainly |
| [docs/attribution.md](docs/attribution.md) | Every library, model, and data source with its licence |
| [design/DESIGN-SYSTEM.md](design/DESIGN-SYSTEM.md) | The interface's type, colour, spacing, and component rules |

---

## Project context

An AI capstone for Cosmopolitan University, Abuja, under the AIPIL / IDEAS
programme. The problem was chosen from an audit of the University's public web
presence rather than assigned, and the scope was deliberately narrowed to a
single user task — *find the correct route and contact for my matter* — because
that task is demonstrably failing, solvable by a small team, and measurable.

This is a student project. It is not an official University service and does not
speak for the institution.

---

## Licence

The source code is released under the [MIT Licence](LICENSE). The quoted
institutional content in `backend/data/corpus/` remains the property of
Cosmopolitan University and is used descriptively, with attribution and citation,
to answer questions about the University's own published pages. See
[docs/attribution.md](docs/attribution.md) §4.
