-- Grant the roles that actually touch the RAG schema (service_role, used by
-- both the embedding script and the ai edge function) the privileges they
-- need. Creating a schema/table doesn't implicitly grant access to it.

grant usage on schema "RAG" to service_role;
grant all on all tables in schema "RAG" to service_role;
alter default privileges in schema "RAG" grant all on tables to service_role;
