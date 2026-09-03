# Current State

Last updated: 2026-09-03 KST

## Status

Architecture/product narrowing is complete and the first durable UI publishing build is live from the Synology NAS. Backend product implementation has not started yet.

## Authoritative scope

Read in this order:

1. `AGENTS.md`
2. `PROJECT_BRIEF.md`
3. `DECISIONS.md`
4. `prototype/UI_SPEC.md`
5. this file

`DECISIONS.md` narrows the broad product brief into the first implementation slice. `prototype/UI_SPEC.md` is the current UI/information-architecture contract.

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

## Publishing build

Source:

```text
prototype/index.html
prototype/styles.css
prototype/app.js
prototype/README.md
prototype/UI_SPEC.md
```

The build is intentionally dependency-free static HTML/CSS/JS and contains only synthetic example projects/data/metrics.

Implemented publishing interactions include:

- multi-project Control Center;
- analysis-task list/search/filter and task detail;
- G1-G6 lifecycle presentation;
- recurring analysis/run comparison/drift presentation;
- experiments/model registry and explicit candidate activation review;
- data-source/profiling views;
- evidence/retrieval inspector and citation-to-bbox interaction;
- synthetic mini-evaluation interaction;
- personal AI-provider profile selection UX;
- create/review modal flows;
- desktop-first responsive behavior for narrow/mobile screens.

Static publishing hardening includes no external frontend dependencies, `noindex`, no-referrer and a CSP that denies browser network connections (`connect-src 'none'`) in this publishing build.

## Current NAS publishing runtime

Owned by `son1004007/device-control` through the bounded `Sovereign prototype runtime` operation.

Verified 2026-09-03:

- Synology loopback static HTTP: PASS;
- Cloudflare Quick Tunnel container: running;
- external HTTP post-check from Synology: PASS;
- current preview URL: `https://punch-chronicles-glasgow-scan.trycloudflare.com`;
- published content: synthetic static UI only;
- public authentication: none.

The Quick Tunnel URL is temporary and may change after tunnel/container restart. It is a review/share URL, not a production deployment contract.

## Agent/runtime status

- Synology `sovereign-workbench` remains the dedicated non-production agent workspace managed through `son1004007/device-control`.
- Existing operational workspaces remain separate.
- AGY architecture/IA reviews are runtime-proven through the restricted bridge.
- AGY `workspace-write` is still not accepted as an authoring path: the latest canary returned success but made no file change (`manifest_changed=no`). Current role: design/review advisor.
- Codex NAS re-authentication succeeded in the sense that the previous token/refresh-token authentication errors disappeared, but current Codex runs stop on account usage quota. Current role: unavailable until quota permits use again.
- GitHub remains the durable source-of-truth authoring path; NAS is the publishing/runtime target.

## Next product work

1. review the live publishing build and adjust information architecture/UX;
2. add the dedicated Analysis Recipe catalog if the current grouping is accepted;
3. define provenance/document/chunk/job/evaluation schemas;
4. implement coordinate-preserving text-layer PDF ingestion;
5. implement PostgreSQL/pgvector persistence and durable Postgres-backed job worker;
6. implement lexical FTS + vector retrieval + RRF + reranker;
7. implement citation/bbox response contract and automated evaluation;
8. progressively replace synthetic UI states with real backend contracts and measured evidence.

## Deferred

OCR/VLM, L40S serving, Spring/JPA/RBAC integration, LangGraph, MCP and a dedicated observability dashboard come after the first measured vertical slice. Kafka, mandatory Redis, Kubernetes and LoRA are intentionally out of current scope.
