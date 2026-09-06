# Requirements and Traceability

Baseline: 2026-09-06
Backend verification anchor: commit `94c6fc65f492a983164645ca1aebe892a8408fd2`, Backend CI run `34001712895`.
Publishing verification anchor: branch `publishing-complete-2026-09-06`, publishing CI run `34003929808` = PASS.

## Scope

### In scope — first vertical slice

```text
public text-layer PDF
-> SHA-256 provenance
-> page/bbox-preserving extraction
-> PostgreSQL + pgvector persistence
-> durable PostgreSQL-backed ingestion jobs
-> lexical FTS + dense retrieval
-> RRF + local reranker
-> citation-grounded response
-> citation -> source page/bbox
-> automated evaluation/regression
-> traceable egress/model/parser/index evidence
```

### Out of scope for first slice

OCR/VLM, L40S serving, Spring/JPA/RBAC, LangGraph, MCP, Kafka, mandatory Redis, Kubernetes, LoRA and generic multi-agent/model-playground functionality.

## Requirement Ledger

| ID | Requirement | Source | Source Status | Lifecycle Status | Acceptance criteria | Implementation reference | Evidence | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FR-DOC-001 | User can register/ingest a public text-layer PDF without blocking the HTTP request for full processing duration. | `DECISIONS.md` | CONFIRMED | IMPLEMENTED_NOT_VERIFIED | upload/register returns document/job identifiers; work is processed by worker | backend: `main.py`, `repository.py`, `worker.py`; UI: SCR-007 document pipeline contract | worker integration PASS; publishing document/job states PASS; HTTP multipart API E2E not yet executed | NOT RUN (backend E2E) |
| FR-PROV-001 | Every source PDF has stable SHA-256 identity and provenance metadata. | `DECISIONS.md` | CONFIRMED | IMPLEMENTED_NOT_VERIFIED | identical bytes produce identical SHA-256; source hash persisted and visible in evidence UI | `storage.py`, `documents.sha256`; UI SCR-007/008 | storage hash/dedupe unit test PASS; publishing provenance contract PASS | PASS (partial backend) |
| FR-EXT-001 | Text-layer PDF extraction preserves page number and bounding box. | `DECISIONS.md` | CONFIRMED | VERIFIED | output contains page+bbox+text persisted to spans; evidence UI exposes page/bbox mapping | `pdf_extractor.py`, `document_spans`; UI SCR-007/008 | extractor + worker integration PASS; citation->highlight publishing interaction contract PASS | PASS |
| FR-JOB-001 | Long-running ingestion uses durable PostgreSQL-backed job queue and no Redis/Celery/Kafka. | `DECISIONS.md` | CONFIRMED | VERIFIED | worker claims queued job with `FOR UPDATE SKIP LOCKED`; state transitions persist; UI distinguishes HTTP registration from job state | `jobs`, `claim_next_job`, worker; UI SCR-007 | exclusive claim + worker integration PASS; queued/processing/failed/ready publishing states PASS | PASS |
| FR-DB-001 | PostgreSQL + pgvector is first-slice state source of truth. | `DECISIONS.md` | CONFIRMED | VERIFIED | migration creates required schema/vector extension; UI never becomes authoritative runtime state | migrations; UI SCR-004/007 status contract | CI migration PASS; publishing labels backend/runtime boundary | PASS |
| FR-RET-001 | Retrieval includes PostgreSQL lexical FTS. | `DECISIONS.md` | CONFIRMED | PLANNED | indexed chunks ranked by PostgreSQL FTS; not mislabeled BM25 | scaffold only; UI SCR-008 contract | UI shows lexical rank as synthetic/planned; implementation absent | NOT RUN |
| FR-RET-002 | Retrieval includes dense vector search through pgvector. | `DECISIONS.md` | CONFIRMED | PLANNED | model/version recorded; reproducible top-K | scaffold only; UI SCR-008 contract | UI shows vector rank/similarity as synthetic/planned; implementation absent | NOT RUN |
| FR-RET-003 | Lexical+dense ranks are combined with Reciprocal Rank Fusion. | `DECISIONS.md` | CONFIRMED | PLANNED | fused rank reproducible from inputs/config | planned; UI SCR-008 contract | RRF UI contract only | NOT RUN |
| FR-RET-004 | Fused candidates are reranked by a local cross-encoder. | `DECISIONS.md` | CONFIRMED | PLANNED | local model/version/scores traceable; no silent remote substitution | planned; UI SCR-008 contract | reranker UI contract only | NOT RUN |
| FR-CIT-001 | Factual answer citations resolve to retrieved chunk and source PDF page/bbox. | `DECISIONS.md`, `prototype/UI_SPEC.md` | CONFIRMED | IN_PROGRESS | citation identifies evidence document/page/bbox | span foundation; UI SCR-008 | publishing citation selection changes source evidence highlight; backend retrieval/answer contract absent | PASS (publishing only) |
| FR-EVAL-001 | Evaluation is reproducible and part of product. | `DECISIONS.md` | CONFIRMED | PLANNED | eval run stores dataset/version/config and measured retrieval/citation/latency | planned; UI SCR-008 | synthetic mini-eval UX + explicit non-measured label PASS; backend harness absent | NOT RUN |
| FR-OBS-001 | Request/job/evaluation traces record enough versions/IDs to reproduce results. | `DECISIONS.md` | CONFIRMED | IN_PROGRESS | applicable run IDs, parser/index/model versions, ranks/scores, latency recorded | `run_traces`; UI SCR-007/008 | parser/job trace integration PASS; publishing inspector contract PASS; retrieval/eval trace absent | PASS (phase-1 partial) |
| SEC-EGR-001 | Explicit egress policy; no zero-egress/air-gap claim without runtime evidence. | `DECISIONS.md`, `AGENTS.md` | CONFIRMED | IN_PROGRESS | execution mode/network behavior explicit and unsupported sovereignty claim absent | docs/policy; UI global banner/SCR-008/012 | publishing changed to `Runtime egress NOT VERIFIED`; runtime enforcement/test absent | PASS (publishing wording) |
| SEC-DATA-001 | Public repo/runtime examples use public or synthetic data only. | `AGENTS.md`, `PROJECT_BRIEF.md` | CONFIRMED | VERIFIED | no company/internal data/credentials/private topology committed | repository + publishing content | current static/review evidence | PASS |
| UI-001 | Publishing remains engineering inspection workbench, not chatbot-first. | `prototype/UI_SPEC.md`, `DECISIONS.md` | CONFIRMED | IMPLEMENTED_NOT_VERIFIED | task/document/evidence inspection is primary; first-slice states and synthetic/backend boundary are explicit | `prototype/index.html`, `app-v2.js`, `styles-v2.css`, `publishing-complete.css`, `UI_SPEC.md` | publishing CI run `34003929808` PASS; independent final review pending | PASS (static contract) |

## DLV-02 Publishing Coverage

| Requirement / UI concern | Screen coverage | Current publishing evidence |
| --- | --- | --- |
| project context | SCR-002 | separate project list/context/action screen |
| task lifecycle | SCR-003 + SCR-003-A | list/search + 10 stable detail tabs |
| document ingestion | SCR-007 | mixed/processing/ready/failed/empty/permission states |
| upload dependency | SCR-007 | actual submit disabled until backend connection |
| durable job visibility | SCR-007 | document/job/status/pipeline contract |
| provenance | SCR-007/008 | SHA/parser/artifact/run identity contract |
| citation/bbox | SCR-008 | clickable citation changes highlighted source evidence |
| retrieval inspection | SCR-008 | lexical/vector/RRF/reranker/latency synthetic contract |
| evaluation | SCR-008 | mini-eval interaction + explicit synthetic label |
| recurring | SCR-009 | cadence/timezone/window/version/comparison/drift/retraining |
| model lifecycle | SCR-010 | baseline/current/candidate + explicit activation review |
| provider policy | SCR-012 | profile/scope/quota/policy-denied + no silent substitution |
| loading/processing | SCR-007 | PROCESSING/QUEUED states |
| empty | SCR-003/SCR-007 | search-empty/document-empty states |
| error | SCR-007 | FAILED text-layer example |
| disabled | SCR-005/SCR-007 | real execution/upload dependency states |
| permission denied | SCR-004/SCR-007 | access/permission state contract |

## Conditional Mapping — current phase

| Requirement | UI | API | DB/Data | Operation/Security |
| --- | --- | --- | --- | --- |
| FR-DOC-001 | SCR-007 | `POST /api/v1/documents`, document/job reads | documents/jobs | worker process |
| FR-PROV-001 | SCR-007/008 | document/evidence reads planned | documents/document_spans | hash/parser trace |
| FR-EXT-001 | SCR-007/008 | future evidence API | document_spans | parser version trace |
| FR-JOB-001 | SCR-007 | job status read | jobs/run_traces | worker claim/processing |
| FR-RET-001~004 | SCR-008 contract | future retrieval API | chunks/embeddings/run traces | model/index/egress policy |
| FR-CIT-001 | SCR-008 | future answer/evidence API | chunk/span lineage | citation contract |
| FR-EVAL-001 | SCR-008 | future eval API | future evaluation tables | measured artifact only |
| SEC-EGR-001 | global + SCR-008/012 | future runtime policy | run/config trace | no unsupported zero-egress claim |

## Current Completion Boundary

### Publishing

Implemented and static-CI verified on `publishing-complete-2026-09-06`:

- 12 reachable menu screens;
- separate project context;
- 10 analysis-task detail tabs;
- first-slice document ingestion state screen;
- first-slice provenance/retrieval/citation/evaluation inspection screen;
- empty/error/disabled/permission/policy-denied review states;
- synthetic vs real/runtime boundary wording;
- mobile/responsive styles and navigation regression contract;
- zero external runtime dependency contract.

Still required before DLV-02 is called fully accepted:

- independent AGY/Gemini final review and reconciliation;
- browser/runtime visual smoke in an approved accessible environment if available.

### Backend

Implemented and CI-verified foundation:

- coordinate-preserving text-layer extraction;
- durable PostgreSQL queue claim/state transitions;
- PostgreSQL/pgvector baseline migration;
- worker integration through document `READY`, job `SUCCEEDED`, span persistence, run trace;
- storage hashing/dedupe/path-boundary unit behavior.

Still required before ingestion backend foundation is fully verified:

- HTTP multipart API -> DB/job -> worker -> status E2E;
- backend independent review reconciliation of accepted findings;
- NAS/runtime smoke via approved device-control path.

Retrieval/reranking/citation/evaluation backend logic remains later work and is not represented as implemented.

## Assumptions / Open Questions

- Initial PDFs have a usable text layer; OCR/VLM remains deferred.
- One FastAPI service plus worker remains the first implementation shape.
- Embedding/reranker concrete model choice remains unresolved until retrieval implementation and local runtime evaluation.
- Public authentication/multi-user RBAC remains deferred; permission-denied states are a future contract only.

## Residual Risk

- browser-level visual smoke has not been executed for this publishing branch in the current environment;
- NAS runtime compatibility/performance is not yet measured for backend;
- stale `RUNNING` job recovery is not implemented/tested;
- explicit runtime egress enforcement/evidence is not yet implemented.
