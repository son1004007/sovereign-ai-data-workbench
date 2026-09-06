# Database / Data Specification

Baseline: 2026-09-06
Database: PostgreSQL + pgvector

This is the phase-1 logical/physical contract. `backend/migrations/001_initial.sql` is the executable schema source once added; this document explains intent and constraints.

## `documents` — source document identity/provenance

| Column | Type | Null | Constraint | Meaning |
| --- | --- | --- | --- | --- |
| id | uuid | no | PK | document identity |
| sha256 | char(64) | no | UNIQUE | SHA-256 of exact source bytes |
| original_name | text | no | | user-facing source name |
| artifact_ref | text | no | | project-relative artifact identifier, not host absolute path |
| media_type | text | no | | expected `application/pdf` initially |
| byte_size | bigint | yes | check >=0 | source size when known |
| parser_name | text | yes | | parser used for completed extraction |
| parser_version | text | yes | | parser/library version evidence |
| status | text | no | check | `REGISTERED/PROCESSING/READY/FAILED` |
| created_at | timestamptz | no | default now | |
| updated_at | timestamptz | no | default now | |

Indexes: unique `sha256`; status index where operationally useful.

## `document_spans` — coordinate-preserving extracted text

| Column | Type | Null | Constraint | Meaning |
| --- | --- | --- | --- | --- |
| id | uuid | no | PK | span identity |
| document_id | uuid | no | FK documents | source document |
| page_number | integer | no | check >=1 | 1-based PDF page |
| span_order | integer | no | check >=0 | deterministic order within page |
| x0 | real | no | | bbox left |
| y0 | real | no | | bbox top |
| x1 | real | no | | bbox right |
| y1 | real | no | | bbox bottom |
| text | text | no | | extracted text |
| created_at | timestamptz | no | default now | |

Constraints:
- unique `(document_id, page_number, span_order)`
- bbox ordering checks `x1 >= x0`, `y1 >= y0`

Indexes: `(document_id, page_number)`.

## `chunks` — retrieval unit

Created in initial schema even if chunking/retrieval implementation follows the parser foundation.

| Column | Type | Null | Constraint | Meaning |
| --- | --- | --- | --- | --- |
| id | uuid | no | PK | stable chunk identity |
| document_id | uuid | no | FK documents | source |
| chunk_order | integer | no | | order in document |
| page_start | integer | no | | first page |
| page_end | integer | no | | last page |
| text | text | no | | chunk text |
| text_search | tsvector | no | generated/stored or maintained | PostgreSQL lexical FTS |
| metadata | jsonb | no | default `{}` | parser/chunk lineage metadata |
| created_at | timestamptz | no | default now | |

Indexes:
- unique `(document_id, chunk_order)`
- GIN on `text_search`

## `chunk_embeddings` — dense retrieval vectors

| Column | Type | Null | Constraint | Meaning |
| --- | --- | --- | --- | --- |
| chunk_id | uuid | no | PK/FK chunks | |
| model_name | text | no | | model identity |
| model_version | text | yes | | version/revision |
| dimension | integer | no | | expected vector dimension |
| embedding | vector | no | | pgvector value; concrete dimension may be enforced when model is selected |
| created_at | timestamptz | no | default now | |

The migration avoids inventing a fixed vector dimension before model selection is confirmed. Retrieval implementation may introduce a model-specific dimension constraint/migration.

## `jobs` — durable PostgreSQL-backed work queue

| Column | Type | Null | Constraint | Meaning |
| --- | --- | --- | --- | --- |
| id | uuid | no | PK | job ID |
| job_type | text | no | | initial `DOCUMENT_INGEST` |
| document_id | uuid | yes | FK documents | target |
| status | text | no | check | `QUEUED/RUNNING/SUCCEEDED/FAILED` |
| attempts | integer | no | default 0 | claim attempts |
| available_at | timestamptz | no | default now | scheduling eligibility |
| started_at | timestamptz | yes | | |
| heartbeat_at | timestamptz | yes | | future stale-job recovery evidence |
| finished_at | timestamptz | yes | | |
| worker_id | text | yes | | claimant identity |
| error_code | text | yes | | bounded machine-readable failure |
| error_message | text | yes | | bounded diagnostic, no secrets |
| payload | jsonb | no | default `{}` | job parameters |
| created_at | timestamptz | no | default now | |
| updated_at | timestamptz | no | default now | |

Claim index: `(status, available_at, created_at)`.

Claim semantics:

```sql
SELECT id
FROM jobs
WHERE status = 'QUEUED' AND available_at <= now()
ORDER BY created_at
FOR UPDATE SKIP LOCKED
LIMIT 1;
```

State transition to `RUNNING` occurs in the same transaction as claim.

## `run_traces` — reproducibility/observability envelope

| Column | Type | Null | Meaning |
| --- | --- | --- | --- |
| id | uuid | no | PK run/trace identity |
| request_id | text | yes | external/request correlation |
| job_id | uuid | yes | job correlation |
| document_id | uuid | yes | document correlation |
| stage | text | no | stage name |
| component_version | text | yes | parser/index/model/service version |
| started_at | timestamptz | no | |
| finished_at | timestamptz | yes | |
| attributes | jsonb | no | non-secret structured evidence |

Later retrieval/evaluation increments may add dedicated evaluation tables once their contracts stabilize.

## Data Classification

Repository/demo data: public or synthetic only.
Credentials/secrets: never persisted in these tables as plain values.
Company/customer data: outside current public project scope.

## Migration / Compatibility

- additive migrations preferred after baseline.
- destructive schema changes require explicit migration/rollback/forward-fix plan.
- pgvector extension must be installed before `chunk_embeddings` creation.
- exact PostgreSQL/pgvector versions are installation-guide/runtime concerns and must be measured/verified rather than invented here.
