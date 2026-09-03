# Architecture Decisions

Last updated: 2026-09-03 KST

This document records the current implementation decisions for the first vertical slice. It intentionally narrows the broader ideas in `PROJECT_BRIEF.md`.

## Product focus

The first milestone is not a generic AI playground, multi-agent platform, or model-training project.

It is one auditable end-to-end document intelligence slice:

```text
public PDF
  -> content hash + provenance
  -> coordinate-preserving extraction
  -> chunk/index
  -> lexical FTS + dense vector retrieval
  -> reciprocal-rank fusion
  -> cross-encoder reranking
  -> citation-grounded answer
  -> click citation -> original PDF page/bbox
  -> reproducible automated evaluation
```

## Naming: `sovereign-ai-data-workbench`

Keep the name only if the implementation makes sovereignty observable rather than cosmetic.

Required properties for the name to remain justified:

- no company/internal data in the public portfolio repository or evaluation corpus;
- explicit model/data egress policy;
- a local/controlled-egress execution mode that can be tested;
- SHA-256 identity for source documents;
- traceable lineage from source document -> extraction -> chunk -> retrieval -> citation;
- auditable model/parser/index versions for each result.

Do not claim full air-gap or zero-egress operation until it is demonstrated by runtime evidence.

## BUILD NOW

### 1. FastAPI application/orchestration

Use one Python/FastAPI backend for the first slice. Avoid Spring/FastAPI service splitting until the product flow and contracts are stable.

### 2. PostgreSQL + pgvector as the state source of truth

PostgreSQL owns document metadata, chunks, vector metadata, job state, evaluation runs, provenance records and structured traces.

Large/raw artifacts remain on an allow-listed NAS project volume; PostgreSQL stores stable relative artifact identifiers rather than host-specific absolute paths where possible.

### 3. Durable lightweight job execution

Use a PostgreSQL-backed job table/worker pattern for long-running ingestion/indexing work. Prefer `FOR UPDATE SKIP LOCKED` before adding Redis, Celery or Kafka.

The web request path must not synchronously own long-running PDF processing.

### 4. Coordinate-preserving PDF ingestion and provenance

Initial documents should contain a usable text layer. Preserve at minimum:

- source SHA-256;
- page number;
- bounding box;
- extracted text;
- chunk identifier;
- parser/version metadata.

OCR/VLM is a later extension, not required for the first slice.

### 5. Hybrid retrieval, but label it correctly

The initial lexical component is PostgreSQL full-text search (`tsvector`/GIN + `ts_rank_cd`), **not true BM25**.

Combine:

- PostgreSQL lexical FTS ranking;
- pgvector dense retrieval;
- Reciprocal Rank Fusion (RRF);
- a local cross-encoder reranker.

Do not introduce Elasticsearch/OpenSearch or a BM25-specific PostgreSQL extension until measured retrieval failures justify it.

### 6. Citation lineage and PDF evidence navigation

Every factual answer citation must resolve back to a retrieved chunk and then to the source document page/bounding box. The first UI must allow the user to click a citation and inspect the original evidence location.

### 7. Automated evaluation/regression

Evaluation is part of the product, not a later reporting feature.

Minimum initial corpus target:

- 5 public documents spanning tables, technical layouts and hierarchical text;
- approximately 30 manually defined Golden QA cases including factual, table/multi-hop and unanswerable questions.

Measure separately:

- extraction/coordinate mapping;
- retrieval Hit@K and MRR;
- citation precision and groundedness/faithfulness;
- negative/unanswerable handling;
- latency;
- NAS resource usage.

Any numeric quality or latency threshold is an initial project gate only after baseline measurement; do not present it as an industry standard.

### 8. Minimal observability and egress evidence

Build structured request/job/evaluation traces now, but defer a dedicated observability dashboard.

Record enough information to reproduce a result: request/run ID, document/index versions, retrieved chunk IDs/ranks/scores, model/parser versions and stage latency.

Implement and test an explicit egress policy before claiming sovereign/air-gapped behavior.

## BUILD AFTER THE VERTICAL SLICE

- OCR/VLM extraction for scanned/image-only documents;
- L40S model serving and controlled NAS-to-GPU inference path;
- Spring Boot + JPA/RBAC enterprise integration layer, if it adds a clear product boundary rather than duplicating FastAPI;
- LangGraph agent workflows after deterministic retrieval/document tasks are measurable and stable;
- MCP only for a concrete external tool integration use case;
- dedicated observability dashboard;
- document-level ACL/RBAC and multi-user security model.

## SKIP FOR NOW

- fine-tuning / LoRA;
- Kafka;
- Redis as a mandatory dependency;
- Kubernetes;
- generic multi-model playground;
- broad multi-agent framework work without a measured user problem.

## First browser UI

The initial browser experience should look like an engineering inspection workbench, not a chatbot.

Recommended information architecture:

1. provenance/sovereignty status: source hash, parser/index/model versions, egress mode;
2. document/pipeline panel: upload, ingestion stages, job state;
3. grounded answer panel: answer plus clickable chunk/page citations;
4. PDF evidence panel: source page plus bbox highlight;
5. engineering inspector/evaluation drawer: lexical/vector/RRF/reranker rankings, stage latency and eval result.

## Immediate implementation order

1. provenance data model + coordinate-preserving PDF parser;
2. PostgreSQL schema + pgvector + durable job worker;
3. lexical FTS + dense retrieval + RRF + reranker;
4. citation-grounded response contract + PDF bbox mapping;
5. automated evaluation/regression harness and inspection UI.

The GPU, agent, Spring integration and scanned-document VLM path are phase-two work only after this flow is demonstrably working and measured.
