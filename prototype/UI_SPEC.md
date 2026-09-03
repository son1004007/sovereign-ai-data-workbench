# UI Publishing Specification

Status: working product UI contract

This specification sits between product design and implementation. The HTML publishing build should evolve against this information architecture rather than becoming a disposable mockup.

## Primary user

A data analyst supervising multiple customer/project analysis tasks with AI and automation handling repeatable work.

The default mental model is **analyst as supervisor**, not analyst as chat user.

## Global navigation

Current publishing pages:

1. Control Center
2. Projects
3. Analysis Tasks
4. Recurring Analysis
5. Experiments & Models
6. Data Sources
7. Evidence & Evaluation
8. AI Accounts & Providers

A dedicated Analysis Recipe catalog is a near-term UI addition once the current screen grouping is reviewed. Until then, recipe usage is visible in task plans and dashboard metrics.

## Control Center contract

The first page must answer four questions without opening a chat:

1. What analysis work is active?
2. What is blocked or waiting for my decision?
3. Which recurring jobs/models need attention?
4. Which project should I inspect next?

Required regions:

- KPI strip: active tasks, approvals/reviews, recurring health, reusable recipes;
- active task table with project/stage/type/mode/status;
- human action queue;
- project progress/blocker summary;
- recent automated activity;
- workload/automation trend visualization.

## Analysis task workspace

Stable task context:

- project/task name;
- analysis type;
- one-time or recurring mode;
- G1-G6 / recurring state;
- owner;
- last change;
- review/blocker status.

Current task tabs:

- Overview
- Requirements
- Data
- Analysis Plan
- Runs
- Experiments
- Models
- QA
- Reports
- History

Implementation expansion should add an explicit Code & Execution / Results experience once real SQL/Python execution exists. Do not fake an IDE in the static publishing build before the execution contract exists.

## Recurring analysis contract

Show:

- cadence and timezone;
- data window;
- pipeline/recipe version;
- recent run sequence;
- latest vs previous-run comparison;
- data/feature/model drift;
- next run;
- review policy;
- retraining candidate separated from ordinary scoring.

## ML contract

Always compare candidates to a baseline. A model becoming numerically better must not automatically make it active.

Visible lifecycle concepts:

- experiment ID;
- problem type;
- baseline metric;
- candidate metric;
- dataset/feature versions;
- CANDIDATE / ACTIVE / RETIRED states;
- explicit activation review;
- drift/retraining trigger.

## AI account contract

A user can have multiple personal credential profiles and organization/local profiles.

UI shows:

- provider/agent;
- profile label;
- scope (personal/organization/local);
- connection/quota/policy state;
- default selection for new runs.

UI never redisplays secret values after registration.

Final provider routing is determined by:

```text
task requirement
+ network mode
+ data classification
+ provider capability
+ selected user profile
+ organization policy
```

Policy rejection must be visible; silent provider substitution is not allowed for auditable runs.

## Evidence & evaluation contract

The workbench must demonstrate engineering evidence, not only answer text.

Required concepts:

- source document SHA-256;
- parser/index/model versions;
- egress mode/state;
- answer citation to chunk/page;
- original PDF bbox highlight;
- lexical rank;
- dense-vector rank/similarity;
- RRF rank;
- reranker score;
- evaluation result;
- negative/unanswerable behavior.

Synthetic metrics must always be labeled as synthetic until replaced by measured evaluation artifacts.

## Responsive behavior

Desktop 1440px is the primary productivity target. Mobile is for monitoring, review and lightweight actions rather than reproducing every dense desktop panel.

On narrow screens:

- sidebar becomes a drawer;
- tables remain horizontally scrollable rather than hiding business-critical columns unpredictably;
- KPI grids stack;
- modals become single-column;
- AI profile selection may collapse from the top bar;
- evidence viewer stacks below the answer/inspector.

## Visual design rules

- enterprise SaaS/data-platform density;
- compact 8-14px internal spacing scale;
- small radii, restrained shadows;
- status color always paired with text;
- dense tables preferred over oversized marketing cards;
- no glassmorphism, animated AI gradients, chat bubbles or decorative robot imagery;
- synthetic prototype data explicitly marked;
- system/local fonts only in restricted-network publishing builds.
