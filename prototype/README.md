# Publishing Prototype

This directory is a durable UI/interaction reference for the future product, not a disposable mockup.

## Purpose

Use the browser build to review the product information architecture before backend implementation. It intentionally exposes the workflow concepts that should remain stable as APIs and data models are added.

## Included in this publishing build

- multi-project analyst Control Center;
- G1-G6 analysis lifecycle;
- one-time and recurring analysis tasks;
- statistical, ML and generative-AI analysis types;
- recurring run history, comparison, drift and retraining review;
- experiments and model registry;
- database/file/document data-source views and profiling;
- task-level requirements, data, plan, runs, experiments, models, QA, reports and history;
- personal AI provider/credential profile selection UX without exposing credential values;
- restricted/connected deployment-mode concepts;
- provenance, citation lineage, retrieval-score inspector and PDF bbox evidence interaction;
- synthetic mini-evaluation interaction.

## Important boundary

All projects, measurements, run counts, model scores and documents displayed here are synthetic examples for UI review. They are not measured product performance and are not company/customer data.

No external JavaScript, CSS, font or image dependency is required. The prototype is intentionally runnable as static files so it remains compatible with later restricted-network/air-gapped deployment design.

## Local run

```bash
cd prototype
python3 -m http.server 8080
```

Then open `http://127.0.0.1:8080/`.

## Interaction review checklist

1. Navigate between Control Center, Projects, Analysis Tasks, Recurring, Experiments & Models, Data Sources, Evidence & Eval, and AI Accounts.
2. Open an analysis task from the dashboard or task table and inspect its lifecycle tabs.
3. Change the task filter/search.
4. Inspect a recurring analysis run and model candidate review.
5. Open add/create modals for projects, tasks, schedules, data sources and AI profiles.
6. Change the global AI profile; this represents new-execution routing only.
7. In Evidence & Eval, click citation badges and confirm the source bbox highlight changes.
8. Run the synthetic mini-eval and confirm evaluation cards update.
9. Check desktop information density and mobile responsive behavior.

## Not implemented yet

This build does not contain a real API, authentication, credential storage, scheduler, database connector, PDF parser, RAG implementation, ML training, model inference or measured evaluation. Those capabilities should be implemented against the product contracts after this publishing structure is reviewed.
