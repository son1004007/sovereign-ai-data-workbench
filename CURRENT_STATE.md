# Current State

Last updated: 2026-09-03 KST

## Status

Architecture/product narrowing is complete and the durable UI publishing build is live from the Synology NAS. Backend product implementation has not started yet.

The publishing build is now **Korean-first and feature-judgment oriented**. It is intended to help a reviewer understand each page before deciding whether the feature belongs in the product.

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
prototype/guide.css
prototype/app.js
prototype/enhancements.js
prototype/korean-guide.js
prototype/README.md
prototype/UI_SPEC.md
```

The build is intentionally dependency-free static HTML/CSS/JS and contains only synthetic example projects/data/metrics.

### Korean guided review mode

The visible UI is Korean-first. Technical product terms such as SQL, RAG, MAPE, LightGBM and provider/product names remain where they are useful, but navigation, task names, statuses, controls and explanations are localized.

Every major page receives a guidance panel with:

- what the page is for;
- when the analyst uses it;
- what information matters on the page;
- what happens if the feature does not exist;
- one concrete usage example;
- an explicit product judgment label: `필수`, `권장`, or `조건부`.

Current judgment guidance:

- 통합 관제: 필수;
- 프로젝트: 필수;
- 분석 과제 / 과제 상세: 필수;
- 데이터 소스: 필수;
- 분석 레시피: 권장;
- AI 계정·모델 연결: 권장;
- 정기 분석: 반복 업무가 있을 때 조건부;
- ML 실험·모델: ML을 사용할 때 조건부;
- 근거·평가: 문서 AI/RAG를 사용할 때 조건부.

Implemented publishing interactions include:

- multi-project Control Center;
- analysis-task list/search/filter and task detail;
- G1-G6 lifecycle presentation;
- explicit Code & Execution and Results task views;
- recurring analysis/run comparison/drift presentation;
- experiments/model registry and explicit candidate activation review;
- data-source/profiling views;
- reusable Analysis Recipe catalog and recipe-promotion flow;
- evidence/retrieval inspector and citation-to-bbox interaction;
- synthetic mini-evaluation interaction;
- personal AI-provider profile selection UX;
- create/review modal flows;
- desktop-first responsive behavior for narrow/mobile screens.

Static publishing hardening includes no external frontend dependencies, `noindex`, no-referrer and a CSP that denies browser network connections (`connect-src 'none'`) in this publishing build.

The `Publishing prototype static check` workflow validates JavaScript syntax including `korean-guide.js`, required guided-review assets, Korean feature-judgment markers, routing, CSP and zero external runtime URLs. The latest Korean-guided check passed on 2026-09-03.

## Current NAS publishing runtime

Owned by `son1004007/device-control` through the bounded `Sovereign prototype runtime` operation.

Verified 2026-09-03 after Korean guided publishing update:

- Synology loopback static HTTP: PASS;
- Cloudflare Quick Tunnel container: running;
- external HTTP post-check from Synology: PASS;
- current preview URL: `https://conversion-insurance-throughout-youth.trycloudflare.com`;
- published content: synthetic static UI only;
- public authentication: none.

The Quick Tunnel URL is temporary and may change after tunnel/container restart. It is a review/share URL, not a production deployment contract.

## Agent/runtime status

- Synology `sovereign-workbench` remains the dedicated non-production agent workspace managed through `son1004007/device-control`.
- Existing operational workspaces remain separate.
- AGY architecture/IA reviews have been useful through the restricted bridge.
- AGY `workspace-write` is still not accepted as an authoring path. A prior canary returned success without modifying files. The later full static-QA attempt timed out and was rolled back, so GitHub CI/runtime evidence remains the acceptance gate.
- Codex remains unavailable while account usage quota prevents execution.
- GitHub remains the durable source-of-truth authoring path; NAS is the publishing/runtime target.

## Next product work

1. review the Korean guided publishing build page by page and decide `유지 / 단순화 / 제거 / 나중`;
2. reflect those decisions in `prototype/UI_SPEC.md` before backend implementation;
3. define provenance/document/chunk/job/evaluation schemas;
4. implement coordinate-preserving text-layer PDF ingestion;
5. implement PostgreSQL/pgvector persistence and durable Postgres-backed job worker;
6. implement lexical FTS + vector retrieval + RRF + reranker;
7. implement citation/bbox response contract and automated evaluation;
8. progressively replace synthetic UI states with real backend contracts and measured evidence.

## Deferred

OCR/VLM, L40S serving, Spring/JPA/RBAC integration, LangGraph, MCP and a dedicated observability dashboard come after the first measured vertical slice. Kafka, mandatory Redis, Kubernetes and LoRA are intentionally out of current scope.
