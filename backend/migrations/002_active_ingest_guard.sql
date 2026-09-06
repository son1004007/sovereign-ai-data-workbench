BEGIN;

-- Database-level idempotency guard: one active ingestion job per document/job type.
-- Application-level row locking should prevent the race in normal operation; this
-- partial unique index protects the invariant if another code path queues work.
CREATE UNIQUE INDEX IF NOT EXISTS uq_jobs_active_document_ingest
    ON jobs (document_id, job_type)
    WHERE status IN ('QUEUED', 'RUNNING');

COMMIT;
