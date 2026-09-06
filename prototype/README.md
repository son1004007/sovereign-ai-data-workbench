# Publishing Prototype

This directory is the executable DLV-02 screen-design deliverable for `sovereign-ai-data-workbench`.

It is not a disposable mockup. It is used to review information architecture, screen states, interaction contracts, synthetic/real boundaries, and the first document-intelligence vertical slice before/while APIs are connected.

## Runtime entry

```text
index.html
-> styles-v2.css
-> publishing-complete.css
-> mobile-nav-fix.css
-> app-v2.js
-> mobile-nav-fix.js
```

Legacy files such as `app.js`, `styles.css`, `enhancements.js`, and `korean-guide.js` are not the primary runtime and must not be treated as current screen-completion evidence.

## Current screen coverage

### Core

1. 통합 관제
2. 프로젝트
3. 분석 과제
4. 데이터 연결·검증
5. 분석 실행·결과
6. 결과·이력
7. 문서·수집 파이프라인
8. 근거·평가

### Conditional / recommended

9. 정기 분석
10. ML 실험·모델
11. 분석 레시피
12. AI 계정·모델 연결

The task-detail view includes:

- Summary
- Requirements
- Data
- Analysis Plan
- Runs
- Experiments
- Models
- QA
- Reports
- History

## First vertical-slice publishing contract

The highest-priority UI path is:

```text
public/synthetic PDF
-> document registration contract
-> durable job state
-> parser + page/bbox extraction state
-> provenance
-> retrieval inspector contract
-> grounded citation
-> PDF evidence highlight
-> evaluation / unanswerable handling
```

`문서·수집 파이프라인` exposes reviewable states for:

- mixed
- processing / queued
- ready
- failed
- empty
- permission denied

`근거·평가` exposes:

- source SHA-256
- parser/index/model/run identity contract
- runtime egress `NOT VERIFIED` state
- lexical / vector / RRF / reranker ranking contract
- stage latency contract
- clickable citation -> source evidence highlight
- unanswerable/refusal behavior
- synthetic mini-evaluation

## Important boundary

All projects, metrics, model scores, retrieval scores, documents and run counts shown in this static build are **synthetic examples for UI review**.

The publishing artifact does **not** claim that the following are currently live merely because their screens exist:

- real authentication / RBAC
- DB connectors
- scheduler
- real SQL/Python analysis execution
- PDF upload to backend
- retrieval / embedding / RRF / reranking
- LLM/model inference
- measured evaluation
- zero-egress / air-gap operation

Actual backend/runtime state must come from code, CI and runtime evidence, not the publishing screen.

## Local run

```bash
cd prototype
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080/`.

## Review checklist

1. Navigate through all 12 menu screens.
2. Confirm `프로젝트` is a separate project-level context screen.
3. Open an analysis task and inspect all 10 task tabs.
4. Search tasks and confirm the empty-result state is visible.
5. Open `문서·수집 파이프라인` and switch through processing/ready/failed/empty/permission states.
6. Confirm PDF registration clearly remains backend-disabled in the static artifact.
7. Open `근거·평가`, switch citations and confirm the source evidence highlight changes.
8. Run the synthetic mini-eval and confirm evaluation cards change without implying measured product performance.
9. Confirm egress is shown as `NOT VERIFIED`, not as proven zero-egress/air-gap.
10. Review recurring cadence/timezone/data-window/drift/retraining separation.
11. Review model baseline/candidate/activation separation.
12. Review provider profile connection/quota/policy-denied states and secret non-redisplay language.
13. Resize to tablet/mobile and confirm drawer navigation, stacked panels and horizontally scrollable tables remain usable.

## Source of truth

- screen contract: `UI_SPEC.md`
- product scope: `../DECISIONS.md`
- requirements/traceability: `../docs/01-requirements-and-traceability.md`
- current implementation state: `../CURRENT_STATE.md`
