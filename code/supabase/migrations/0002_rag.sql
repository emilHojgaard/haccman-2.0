-- RAG schema for the "Dr. Chatbot" hospital bot.
-- Powers full-text + semantic (pgvector) retrieval over guidelines/journals.

create extension if not exists vector with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create schema "RAG";

create table "RAG".documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  doc_type text not null,
  full_text text not null,
  url text,
  confidential boolean not null default false,
  created_at timestamptz not null default now()
);

create table "RAG".chunks (
  id uuid primary key default gen_random_uuid(),
  doc_id uuid not null references "RAG".documents(id) on delete cascade,
  chunk_index int not null,
  text_chunk text not null,
  doc_title text not null,
  doc_type text not null,
  patient_name text,
  cpr_number text,
  semantic_vector vector(1536),
  keyword_vector tsvector generated always as (to_tsvector('english', text_chunk)) stored
);

create index chunks_semantic_vector_idx on "RAG".chunks
  using hnsw (semantic_vector vector_cosine_ops);
create index chunks_keyword_vector_idx on "RAG".chunks using gin (keyword_vector);
create index chunks_doc_id_idx on "RAG".chunks (doc_id);

-- Patient journals are confidential and must never be readable by the
-- anon/authenticated client directly -- only via the service-role edge function.
alter table "RAG".documents enable row level security;
alter table "RAG".chunks enable row level security;

--------------------------------------------------------------------------
-- full_text_search: used for "full document" / "summary" intents
--------------------------------------------------------------------------
create function public.full_text_search(query_text text)
returns table(id uuid, title text, full_text text, confidential boolean, doc_type text)
language sql stable security definer
set search_path to 'RAG', 'public', 'extensions'
as $$
with tok as (
  select regexp_split_to_table(lower(query_text), '\s+') as t
),
ts as (
  select to_tsquery('english', string_agg(quote_ident(t), ' | ')) as tsq
  from tok
  where length(t) > 2
),
fts as (
  select
    c.doc_id,
    max(
      ts_rank_cd(
        setweight(to_tsvector('english', c.doc_title), 'A') ||
        setweight(c.keyword_vector, 'D'),
        ts.tsq
      )
    ) as max_doc_score
  from "RAG".chunks as c
  cross join ts
  group by c.doc_id
)
select d.id, d.title, d.full_text, d.confidential, d.doc_type
from "RAG".documents as d
join fts on d.id = fts.doc_id
where fts.max_doc_score > 0
order by fts.max_doc_score desc;
$$;

--------------------------------------------------------------------------
-- hybrid_search_chunks_rrf: semantic + keyword search fused via RRF,
-- used for the default "hybrid" intent
--------------------------------------------------------------------------
create function public.hybrid_search_chunks_rrf(
  query_text text,
  query_embedding double precision[],
  match_count integer,
  full_text_weight double precision default 1,
  semantic_weight double precision default 1,
  rrf_k integer default 60,
  vec_limit integer default 120,
  fts_limit integer default 80,
  min_rrf double precision default 0.001
)
returns table(
  chunk_id uuid, doc_id uuid, doc_title text, doc_type text,
  chunk_index integer, text_chunk text,
  embedding_score double precision, keyword_score double precision, rrf_score double precision
)
language sql stable security definer
set search_path to 'RAG', 'public', 'extensions'
as $$
with q as (
  select case
           when array_length(query_embedding, 1) = 1536
             then (query_embedding)::extensions.vector(1536)
           else null
         end as v
),
vec as (
  select
    c.id as chunk_id,
    c.doc_id,
    1 - (c.semantic_vector <=> q.v) as embedding_score,
    row_number() over (order by c.semantic_vector <=> q.v asc) as rank_vec
  from "RAG".chunks c
  cross join q
  where q.v is not null
  order by c.semantic_vector <=> q.v asc
  limit vec_limit
),
tok as (
  select regexp_split_to_table(lower(query_text), '\s+') as t
),
ts as (
  select to_tsquery('english', string_agg(quote_ident(t), ' | ')) as tsq
  from tok
  where length(t) > 2
),
fts_base as (
  select
    c.id as chunk_id,
    c.doc_id,
    ts_rank_cd(
      setweight(to_tsvector('english', c.doc_title), 'A') ||
      setweight(to_tsvector('simple', coalesce(c.patient_name, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(c.cpr_number, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(c.doc_type, '')), 'D') ||
      setweight(c.keyword_vector, 'D'),
      ts.tsq
    ) as keyword_score,
    similarity(lower(c.doc_title), lower(query_text)) as sim_title,
    similarity(lower(c.patient_name), lower(query_text)) as sim_name,
    similarity(lower(c.cpr_number), lower(query_text)) as sim_cpr
  from "RAG".chunks as c
  cross join ts
),
fts as (
  select *,
    row_number() over (
      order by keyword_score desc, sim_title desc, sim_name desc, sim_cpr desc
    ) as rank_fts
  from fts_base
  order by keyword_score desc, sim_title desc
  limit fts_limit
),
fused as (
  select
    coalesce(vec.chunk_id, fts.chunk_id) as chunk_id,
    coalesce(vec.doc_id, fts.doc_id) as doc_id,
    vec.embedding_score,
    fts.keyword_score,
    coalesce(full_text_weight * (1.0 / (rrf_k + fts.rank_fts)), 0.0) +
    coalesce(semantic_weight * (1.0 / (rrf_k + vec.rank_vec)), 0.0) as rrf_score
  from vec
  full outer join fts on vec.chunk_id = fts.chunk_id
)
select
  fused.chunk_id, fused.doc_id, c.doc_title, c.doc_type, c.chunk_index, c.text_chunk,
  coalesce(fused.embedding_score, 0.0) as embedding_score,
  coalesce(fused.keyword_score, 0.0) as keyword_score,
  fused.rrf_score
from fused
join "RAG".chunks c on c.id = fused.chunk_id
where fused.rrf_score >= min_rrf
order by rrf_score desc
limit greatest(1, match_count);
$$;
