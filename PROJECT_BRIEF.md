# Sovereign AI Data Workbench — Initial Product Brief

Status: concept / architecture review

## Goal
Build a portfolio-grade, enterprise-oriented AI application workbench that demonstrates measurable AI application engineering rather than a simple chatbot or model-training demo.

## Intended capability areas

1. **Document AI**
   - image/scanned PDF ingestion
   - OCR/VLM-based extraction
   - layout/table/figure-aware structured extraction
   - compare documents and produce structured JSON

2. **Enterprise RAG / Search**
   - chunking + metadata
   - vector search + keyword/BM25 hybrid retrieval
   - reranking
   - citation-grounded answers

3. **Agent workflows**
   - tool/function calling
   - LangGraph-style stateful workflows
   - document/search/database/API tools
   - retry/fallback and human approval where needed
   - MCP integration where it provides real value

4. **Evaluation**
   - reproducible evaluation datasets
   - retrieval metrics such as Recall@K, MRR, nDCG
   - answer correctness / groundedness / faithfulness
   - model, prompt, retrieval and workflow comparison
   - real measured results only; no invented benchmark numbers

5. **Enterprise application layer**
   - Spring Boot backend for domain/API/auth/RBAC where useful
   - Python/FastAPI for AI orchestration and model-facing services
   - PostgreSQL/pgvector
   - long-running job handling, streaming, retry/idempotency, session/job state

## Infrastructure direction

- Synology NAS is the preferred always-on home environment for UI, orchestration, storage and non-GPU tasks.
- A separate L40S x4 GPU environment may be used for model/VLM/embedding/reranker evaluation when GPU compute materially helps.
- Public portfolio artifacts must use public or synthetic data only. Do not depend on company/internal data, credentials, topology or configuration.
- The NAS agent execution workspace is intentionally isolated from DSM configuration, production CISA data, secrets, backups and Docker socket access.

## First visible milestone

Create a useful browser-based UI prototype, run it on the Synology NAS, and make it reachable through an intentionally configured external/private access URL. The UI should eventually let a user ingest documents, run experiments/workflows, inspect outputs, compare evaluation results and understand what the system actually did.

## Current engineering status

The repository is just being initialized. Before implementing product features, the agent execution path is being validated so AGY/Codex can safely read and write only this isolated project workspace. Existing operational repositories remain read-only and separate.

## Review question

Before implementation, identify what is missing, over-engineered, incorrectly prioritized, or architecturally risky. Recommend the smallest sequence of product increments that would make this project technically credible and useful as an engineering portfolio, while preserving the data/security boundary above.
