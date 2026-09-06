# Requirements and Traceability

Baseline: 2026-09-06

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

| ID | Requirement | Source | Status | Acceptance criteria | UI | API | DB/Data | Code | Evidence | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FR-DOC-001 | User can register/ingest a public text-layer PDF without blocking the HTTP request for the full processing duration. | `DECISIONS.md` | CONFIRMED | upload/register returns document/job identifiers; work is processed asynchronously | Data Sources / Evidence | planned | documents/jobs | phase 1 | tests/CI planned | NOT RUN |
| FR-PROV-001 | Every source PDF has a stable SHA-256 identity and provenance metadata. | `DECISIONS.md` | CONFIRMED | identical bytes produce identical SHA-256; source hash is persisted | Evidence | planned | documents/provenance | phase 1 | unit test | NOT RUN |
| FR-EXT-001 | Text-layer PDF extraction preserves page number and bounding box for extracted text. | `DECISIONS.md` | CONFIRMED | extraction output contains page + bbox + text and can map evidence to original page coordinates | Evidence viewer | planned | document_spans/chunks | phase 1 | generated PDF test | NOT RUN |
| FR-JOB-001 | Long-running ingestion uses a durable PostgreSQL-backed job queue and does not require Redis/Celery/Kafka. | `DECISIONS.md` | CONFIRMED | worker claims queued job with `FOR UPDATE SKIP LOCKED`; state transitions are persisted | Runs | planned | jobs | phase 1 | DB integration test | NOT RUN |
| FR-DB-001 | PostgreSQL + pgvector is the first-slice state source of truth. | `DECISIONS.md` | CONFIRMED | schema covers documents, spans/chunks, jobs, retrieval/evaluation/provenance metadata and enables vector extension | N/A | N/A | schema | phase 1 | migration check | NOT RUN |
| FR-RET-001 | Retrieval includes PostgreSQL lexical FTS. | `DECISIONS.md` | CONFIRMED | indexed chunks can be ranked by PostgreSQL FTS; product does not label this as BM25 | Evidence inspector | planned | chunks/search vector | later in slice | retrieval test | NOT RUN |
| FR-RET-002 | Retrieval includes dense vector search through pgvector. | `DECISIONS.md` | CONFIRMED | embedding model/version is recorded; top-K vector results are reproducible for a fixed index/model | Evidence inspector | planned | chunk_embeddings | later in slice | retrieval test | NOT RUN |
| FR-RET-003 | Lexical and dense ranks are combined with Reciprocal Rank Fusion. | `DECISIONS.md` | CONFIRMED | fused ranking can be reconstructed from input rank lists and configured constant | Evidence inspector | planned | run traces | later in slice | unit test | NOT RUN |
| FR-RET-004 | Fused candidates are reranked by a local cross-encoder. | `DECISIONS.md` | CONFIRMED | reranker model/version and scores are traceable; remote egress is not silently substituted | Evidence inspector | planned | run traces | later in slice | eval test | NOT RUN |
| FR-CIT-001 | Factual answer citations resolve to retrieved chunk and source PDF page/bbox. | `DECISIONS.md`, `UI_SPEC.md` | CONFIRMED | clicking citation identifies document/page/bbox used as evidence | Evidence viewer | planned | chunk/span lineage | later in slice | UI/API acceptance | NOT RUN |
| FR-EVAL-001 | Evaluation is reproducible and part of the product. | `DECISIONS.md` | CONFIRMED | evaluation run stores dataset/version/config and measured retrieval/citation/latency results | Evidence & Eval | planned | evaluation_* | later in slice | eval harness | NOT RUN |
| FR-OBS-001 | Request/job/evaluation traces record enough versions and IDs to reproduce results. | `DECISIONS.md` | CONFIRMED | run ID, document/index/parser/model versions, retrieved IDs/ranks/scores and stage latency are recorded as applicable | Inspector | planned | run_trace | incremental | contract tests | NOT RUN |
| SEC-EGR-001 | Product must have an explicit egress policy and may not claim zero-egress/air-gap without runtime evidence. | `DECISIONS.md`, `AGENTS.md` | CONFIRMED | execution mode and allowed network behavior are explicit; unsupported sovereignty claims are absent | sovereignty status | planned | run/config trace | incremental | policy/runtime check | NOT RUN |
| SEC-DATA-001 | Public repository/runtime examples use public or synthetic data only. | `AGENTS.md`, `PROJECT_BRIEF.md` | CONFIRMED | no company/internal data, credentials or private topology is committed | all | N/A | N/A | all | review/static check | PASS (repo policy only) |
| UI-001 | Publishing remains an engineering inspection workbench rather than a chatbot-first interface. | `UI_SPEC.md`, `DECISIONS.md` | CONFIRMED | navigation and evidence/task inspection remain primary; backend replaces synthetic states progressively | `prototype/` | future integration | N/A | prototype exists | publishing static check | PASS (publishing only) |

## Phase-1 Implementation Target — 2026-09-06

This implementation increment covers:

- FR-DOC-001
- FR-PROV-001
- FR-EXT-001
- FR-JOB-001
- FR-DB-001
- initial observability metadata needed by FR-OBS-001

Retrieval, reranking, answer generation and measured evaluation remain explicit next-slice work and are not represented as implemented.

## Assumptions / Open Questions

- Initial PDFs have a usable text layer; OCR/VLM is not required yet.
- First implementation uses a single FastAPI service plus worker process, not Spring/FastAPI split.
- Embedding/reranker concrete model choice remains unresolved until retrieval implementation and local runtime evaluation.
- Public authentication/multi-user RBAC remains deferred.

## Residual Risk

- NAS runtime compatibility and performance are not yet measured for the new backend.
- pgvector/PostgreSQL migration and `SKIP LOCKED` job behavior require integration execution evidence after code is added.
- Static publishing currently contains broad analysis-platform pages beyond the narrowed first backend slice; these remain UI/reference concepts until backed by real contracts.
