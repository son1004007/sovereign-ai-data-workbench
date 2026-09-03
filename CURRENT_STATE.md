# Current State

Last updated: 2026-09-03 KST

## Status

Architecture review complete; product implementation has not started yet.

## Authoritative scope

Read in this order:

1. `AGENTS.md`
2. `PROJECT_BRIEF.md`
3. `DECISIONS.md`
4. this file

`DECISIONS.md` narrows the broad product brief into the first implementation slice.

## First vertical slice

```text
public text-layer PDF
  -> SHA-256 provenance
  -> page/bbox-preserving extraction
  -> PostgreSQL + pgvector
  -> PostgreSQL lexical FTS + vector retrieval + RRF
  -> local reranker
  -> citation-grounded result
  -> citation -> original PDF bbox inspection
  -> automated evaluation/regression
```

## Current execution infrastructure

- Synology `sovereign-workbench` is the dedicated non-production project workspace managed through `son1004007/device-control`.
- Existing operational workspaces remain separate.
- AGY architecture review has been runtime-proven through the restricted bridge without modifying this workspace.
- AGY workspace-write file editing is not yet accepted as operational: the latest write canary still encountered a `write_file` permission denial.
- Codex workspace-write is also not accepted as operational: the latest test reached Codex but its NAS ChatGPT authentication state was expired/reused and execution failed before editing.
- Direct GitHub repository changes remain the current source-of-truth authoring path until both agent write canaries pass.

## Next product work

1. define provenance/document/chunk/job/evaluation schemas;
2. implement coordinate-preserving text-layer PDF ingestion;
3. implement PostgreSQL/pgvector persistence and durable Postgres-backed job worker;
4. implement lexical FTS + vector retrieval + RRF + reranker;
5. implement citation/bbox response contract and automated evaluation;
6. build the inspection-oriented browser UI and deploy it to the isolated NAS project runtime.

## Deferred

OCR/VLM, L40S serving, Spring/JPA/RBAC integration, LangGraph, MCP and a dedicated observability dashboard come after the first measured vertical slice. Kafka, mandatory Redis, Kubernetes and LoRA are intentionally out of current scope.
