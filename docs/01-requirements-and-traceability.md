# Requirements and Traceability

Baseline: 2026-09-06
Evidence anchor for current backend verification: commit `94c6fc65f492a983164645ca1aebe892a8408fd2`, Backend CI run `34001712895`.

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
| FR-DOC-001 | User can register/ingest a public text-layer PDF without blocking the HTTP request for full processing duration. | `DECISIONS.md` | CONFIRMED | IMPLEMENTED_NOT_VERIFIED | upload/register returns document/job identifiers; work is processed by worker | `backend/app/main.py`, `backend/app/repository.py`, `backend/app/worker.py` | worker integration PASS; HTTP multipart API E2E not yet executed | NOT RUN |
| FR-PROV-001 | Every source PDF has stable SHA-256 identity and provenance metadata. | `DECISIONS.md` | CONFIRMED | IMPLEMENTED_NOT_VERIFIED | identical bytes produce identical SHA-256; source hash persisted | `backend/app/storage.py`, `documents.sha256` | storage hash/dedupe unit test PASS; API->DB persistence E2E not yet executed | PASS (partial) |
| FR-EXT-001 | Text-layer PDF extraction preserves page number and bounding box. | `DECISIONS.md` | CONFIRMED | VERIFIED | output contains page+bbox+text persisted to spans | `backend/app/pdf_extractor.py`, `document_spans` | extractor unit test + worker integration PASS in CI run `34001712895` | PASS |
| FR-JOB-001 | Long-running ingestion uses durable PostgreSQL-backed job queue and no Redis/Celery/Kafka. | `DECISIONS.md` | CONFIRMED | VERIFIED | worker claims queued job with `FOR UPDATE SKIP LOCKED`; state transitions persist | `jobs`, `claim_next_job`, `worker.py` | exclusive claim integration + worker integration PASS | PASS |
| FR-DB-001 | PostgreSQL + pgvector is first-slice state source of truth. | `DECISIONS.md` | CONFIRMED | VERIFIED | migration creates required schema and vector extension | `backend/migrations/001_initial.sql` | CI migration PASS against pgvector/PostgreSQL service | PASS |
| FR-RET-001 | Retrieval includes PostgreSQL lexical FTS. | `DECISIONS.md` | CONFIRMED | PLANNED | indexed chunks ranked by PostgreSQL FTS; not mislabeled BM25 | `chunks.text_search` scaffold only | retrieval implementation/test absent | NOT RUN |
| FR-RET-002 | Retrieval includes dense vector search through pgvector. | `DECISIONS.md` | CONFIRMED | PLANNED | model/version recorded; reproducible top-K | `chunk_embeddings` scaffold only | model not selected; retrieval absent | NOT RUN |
| FR-RET-003 | Lexical+dense ranks are combined with Reciprocal Rank Fusion. | `DECISIONS.md` | CONFIRMED | PLANNED | fused rank reproducible from inputs/config | planned | absent | NOT RUN |
| FR-RET-004 | Fused candidates are reranked by a local cross-encoder. | `DECISIONS.md` | CONFIRMED | PLANNED | local model/version/scores traceable; no silent remote substitution | planned | absent | NOT RUN |
| FR-CIT-001 | Factual answer citations resolve to retrieved chunk and source PDF page/bbox. | `DECISIONS.md`, `prototype/UI_SPEC.md` | CONFIRMED | PLANNED | citation identifies evidence document/page/bbox | UI concept + span data foundation | retrieval/answer contract absent | NOT RUN |
| FR-EVAL-001 | Evaluation is reproducible and part of product. | `DECISIONS.md` | CONFIRMED | PLANNED | eval run stores dataset/version/config and measured retrieval/citation/latency | planned | absent | NOT RUN |
| FR-OBS-001 | Request/job/evaluation traces record enough versions/IDs to reproduce results. | `DECISIONS.md` | CONFIRMED | IN_PROGRESS | applicable run IDs, parser/index/model versions, ranks/scores, latency recorded | `run_traces`, worker trace | parser/job trace integration PASS; retrieval/eval trace not yet applicable | PASS (phase-1 partial) |
| SEC-EGR-001 | Explicit egress policy; no zero-egress/air-gap claim without runtime evidence. | `DECISIONS.md`, `AGENTS.md` | CONFIRMED | IN_PROGRESS | execution mode/network behavior explicit and unsupported sovereignty claim absent | docs/policy; runtime enforcement planned | policy wording present; runtime egress test absent | NOT RUN |
| SEC-DATA-001 | Public repo/runtime examples use public or synthetic data only. | `AGENTS.md`, `PROJECT_BRIEF.md` | CONFIRMED | VERIFIED | no company/internal data/credentials/private topology committed | repository policy/content | current implementation review/static inspection | PASS |
| UI-001 | Publishing remains engineering inspection workbench, not chatbot-first. | `prototype/UI_SPEC.md`, `DECISIONS.md` | CONFIRMED | VERIFIED | evidence/task inspection remains primary; synthetic backend boundary explicit | `prototype/` | prior static/publishing verification | PASS (publishing only) |

## Conditional Mapping — current phase

| Requirement | UI | API | DB/Data | Operation/Security |
| --- | --- | --- | --- | --- |
| FR-DOC-001 | Data Sources / Evidence concept | `POST /api/v1/documents`, document/job reads | documents/jobs | worker process |
| FR-EXT-001 | Evidence viewer concept | future evidence API | document_spans | parser version trace |
| FR-JOB-001 | Runs concept | job status read | jobs/run_traces | worker claim/processing |
| FR-DB-001 | N/A | N/A | PostgreSQL/pgvector schema | migration/deploy guide |

## Current Phase-1 Completion Boundary

Implemented and CI-verified foundation:

- coordinate-preserving text-layer extraction;
- durable PostgreSQL queue claim/state transitions;
- PostgreSQL/pgvector baseline migration;
- worker integration through document `READY`, job `SUCCEEDED`, span persistence, run trace;
- storage hashing/dedupe/path-boundary unit behavior.

Still required before the phase-1 ingestion foundation is called fully verified:

- HTTP multipart API -> DB/job -> worker -> status end-to-end acceptance;
- independent AGY/Gemini final review and reconciliation;
- NAS/runtime smoke via approved device-control path.

Retrieval/reranking/citation/evaluation remain later work and are not represented as implemented.

## Assumptions / Open Questions

- Initial PDFs have a usable text layer; OCR/VLM remains deferred.
- One FastAPI service plus worker remains the first implementation shape.
- Embedding/reranker concrete model choice remains unresolved until retrieval implementation and local runtime evaluation.
- Public authentication/multi-user RBAC remains deferred.

## Residual Risk

- NAS runtime compatibility/performance is not yet measured for backend.
- stale `RUNNING` job recovery is not implemented/tested and is a known operational limitation before production-like use.
- broad publishing UI contains synthetic concepts beyond the narrowed backend slice.
- explicit runtime egress enforcement/evidence is not yet implemented.
