# Agent Instructions

Global control: `son1004007/ai-agent-workflow-playbook/CONTROL.md`

Before medium-or-larger work:

1. Read the global control above.
2. Read `PROJECT_BRIEF.md`.
3. Read `DECISIONS.md`.
4. Read `CURRENT_STATE.md` when present.
5. Prefer the narrowed first vertical slice in `DECISIONS.md` over adding broad platform features.

Safety boundary:

- public/synthetic data only in this public repository;
- never add company/internal data, credentials, private topology, secrets, or copied production configuration;
- do not claim sovereign/air-gapped/zero-egress behavior without runtime evidence;
- NAS runtime/device access is owned by `son1004007/device-control`; do not invent direct deployment credentials or bypass its allow-listed workspace policy.
