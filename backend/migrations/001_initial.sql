BEGIN;

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
    id uuid PRIMARY KEY,
    sha256 char(64) NOT NULL UNIQUE,
    original_name text NOT NULL,
    artifact_ref text NOT NULL,
    media_type text NOT NULL,
    byte_size bigint CHECK (byte_size IS NULL OR byte_size >= 0),
    parser_name text,
    parser_version text,
    status text NOT NULL CHECK (status IN ('REGISTERED', 'PROCESSING', 'READY', 'FAILED')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

CREATE TABLE IF NOT EXISTS document_spans (
    id uuid PRIMARY KEY,
    document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number integer NOT NULL CHECK (page_number >= 1),
    span_order integer NOT NULL CHECK (span_order >= 0),
    x0 real NOT NULL,
    y0 real NOT NULL,
    x1 real NOT NULL,
    y1 real NOT NULL,
    text text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT document_spans_bbox_x CHECK (x1 >= x0),
    CONSTRAINT document_spans_bbox_y CHECK (y1 >= y0),
    UNIQUE (document_id, page_number, span_order)
);

CREATE INDEX IF NOT EXISTS idx_document_spans_document_page
    ON document_spans(document_id, page_number);

CREATE TABLE IF NOT EXISTS chunks (
    id uuid PRIMARY KEY,
    document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_order integer NOT NULL CHECK (chunk_order >= 0),
    page_start integer NOT NULL CHECK (page_start >= 1),
    page_end integer NOT NULL CHECK (page_end >= page_start),
    text text NOT NULL,
    text_search tsvector GENERATED ALWAYS AS (to_tsvector('simple', coalesce(text, ''))) STORED,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (document_id, chunk_order)
);

CREATE INDEX IF NOT EXISTS idx_chunks_document ON chunks(document_id, chunk_order);
CREATE INDEX IF NOT EXISTS idx_chunks_text_search ON chunks USING gin(text_search);

CREATE TABLE IF NOT EXISTS chunk_embeddings (
    chunk_id uuid PRIMARY KEY REFERENCES chunks(id) ON DELETE CASCADE,
    model_name text NOT NULL,
    model_version text,
    dimension integer NOT NULL CHECK (dimension > 0),
    embedding vector NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
    id uuid PRIMARY KEY,
    job_type text NOT NULL,
    document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
    status text NOT NULL CHECK (status IN ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED')),
    attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    available_at timestamptz NOT NULL DEFAULT now(),
    started_at timestamptz,
    heartbeat_at timestamptz,
    finished_at timestamptz,
    worker_id text,
    error_code text,
    error_message text,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_claim
    ON jobs(status, available_at, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_document
    ON jobs(document_id, created_at DESC);

CREATE TABLE IF NOT EXISTS run_traces (
    id uuid PRIMARY KEY,
    request_id text,
    job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
    document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
    stage text NOT NULL,
    component_version text,
    started_at timestamptz NOT NULL,
    finished_at timestamptz,
    attributes jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_run_traces_job ON run_traces(job_id, started_at);
CREATE INDEX IF NOT EXISTS idx_run_traces_document ON run_traces(document_id, started_at);

COMMIT;
