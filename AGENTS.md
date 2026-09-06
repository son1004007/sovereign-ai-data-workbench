# Agent Instructions

Global control: `son1004007/ai-agent-workflow-playbook/CONTROL.md`

Engineering handbook: `son1004007/personal-engineering-handbook`

Before medium-or-larger work:

1. Read the global control above.
2. Read `son1004007/personal-engineering-handbook/REVIEW_POLICY.md` (approved v1.4.1).
3. Read the handbook deliverable/lifecycle rules relevant to the change.
4. Read `PROJECT_BRIEF.md`.
5. Read `DECISIONS.md`.
6. Read `CURRENT_STATE.md`.
7. Read `docs/01-requirements-and-traceability.md` and relevant project deliverables.
8. Prefer the narrowed first vertical slice in `DECISIONS.md` over adding broad platform features.

## Mandatory review

This is a personal/public project, so substantive final logical changes require AGY/Gemini independent review under the handbook. MEDIUM/HIGH architecture/security/data/operation decisions require pre-implementation independent review.

Raw AI findings are provisional; use the handbook severity calibration and reconciliation rules. Test PASS alone is not Done.

## Deliverables

Maintain changed truth across:

- DLV-01: `docs/01-requirements-and-traceability.md`
- DLV-02: `prototype/`, `prototype/UI_SPEC.md`, `prototype/README.md`
- DLV-03: `docs/02-system-design.md`, `DECISIONS.md`
- DLV-04: `docs/03-database-spec.md`, `backend/migrations/`
- DLV-05: `backend/`, `prototype/`, `.github/workflows/`
- DLV-06: `docs/04-install-deployment-guide.md`
- DLV-07: `docs/05-operation-acceptance-guide.md`

Do not update every document mechanically; update documents whose truth changed.

## Safety boundary

- public/synthetic data only in this public repository;
- never add company/internal data, credentials, private topology, secrets, or copied production configuration;
- do not claim sovereign/air-gapped/zero-egress behavior without runtime evidence;
- NAS runtime/device access is owned by `son1004007/device-control`; do not invent direct deployment credentials or bypass its allow-listed workspace policy.
