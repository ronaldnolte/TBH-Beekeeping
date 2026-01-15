--
-- PostgreSQL database dump
--

\restrict mXRFCNbzHZFsrY84yBLGDDRIXXMuhfYXytt2jOVLqBBVqZiPfISEDMG1UV1kopU

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-3.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER IF EXISTS "pgrst_drop_watch";
DROP EVENT TRIGGER IF EXISTS "pgrst_ddl_watch";
DROP EVENT TRIGGER IF EXISTS "issue_pg_net_access";
DROP EVENT TRIGGER IF EXISTS "issue_pg_graphql_access";
DROP EVENT TRIGGER IF EXISTS "issue_pg_cron_access";
DROP EVENT TRIGGER IF EXISTS "issue_graphql_placeholder";
DROP PUBLICATION IF EXISTS "supabase_realtime";
DROP POLICY IF EXISTS "Viewers can see shares shared with them" ON "public"."apiary_shares";
DROP POLICY IF EXISTS "Viewers can read shared apiaries" ON "public"."apiaries";
DROP POLICY IF EXISTS "Users manage snapshots in own hives" ON "public"."hive_snapshots";
DROP POLICY IF EXISTS "Users manage own mentor profile" ON "public"."mentor_profiles";
DROP POLICY IF EXISTS "Users manage interventions in own hives" ON "public"."interventions";
DROP POLICY IF EXISTS "Users manage inspections in own hives" ON "public"."inspections";
DROP POLICY IF EXISTS "Users can view own roles" ON "public"."user_roles";
DROP POLICY IF EXISTS "Users can view own profile" ON "public"."users";
DROP POLICY IF EXISTS "Users can view forecasts for their apiaries" ON "public"."weather_forecasts";
DROP POLICY IF EXISTS "Users can update snapshots of own hives" ON "public"."hive_snapshots";
DROP POLICY IF EXISTS "Users can update own profile" ON "public"."users";
DROP POLICY IF EXISTS "Users can manage their own shares" ON "public"."apiary_shares";
DROP POLICY IF EXISTS "Users can delete snapshots of own hives" ON "public"."hive_snapshots";
DROP POLICY IF EXISTS "Public can view mentor profiles" ON "public"."mentor_profiles";
DROP POLICY IF EXISTS "Owners have full access to apiaries" ON "public"."apiaries";
DROP POLICY IF EXISTS "Mentors emails are visible" ON "public"."users";
DROP POLICY IF EXISTS "Admins can manage all roles" ON "public"."user_roles";
DROP POLICY IF EXISTS "Admins can manage all mentor profiles" ON "public"."mentor_profiles";
DROP POLICY IF EXISTS "Access tasks via apiary ownership, share, or assignment" ON "public"."tasks";
DROP POLICY IF EXISTS "Access hives via apiary ownership or share" ON "public"."hives";
ALTER TABLE IF EXISTS ONLY "storage"."vector_indexes" DROP CONSTRAINT IF EXISTS "vector_indexes_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_upload_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."prefixes" DROP CONSTRAINT IF EXISTS "prefixes_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."objects" DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."weather_forecasts" DROP CONSTRAINT IF EXISTS "weather_forecasts_apiary_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."users" DROP CONSTRAINT IF EXISTS "users_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."user_roles" DROP CONSTRAINT IF EXISTS "user_roles_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."tasks" DROP CONSTRAINT IF EXISTS "tasks_assigned_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."mentor_profiles" DROP CONSTRAINT IF EXISTS "mentor_profiles_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."interventions" DROP CONSTRAINT IF EXISTS "interventions_hive_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."inspections" DROP CONSTRAINT IF EXISTS "inspections_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."inspections" DROP CONSTRAINT IF EXISTS "inspections_hive_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."hives" DROP CONSTRAINT IF EXISTS "hives_apiary_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."hive_snapshots" DROP CONSTRAINT IF EXISTS "hive_snapshots_hive_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."apiary_shares" DROP CONSTRAINT IF EXISTS "apiary_shares_viewer_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."apiary_shares" DROP CONSTRAINT IF EXISTS "apiary_shares_owner_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."apiary_shares" DROP CONSTRAINT IF EXISTS "apiary_shares_apiary_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."apiaries" DROP CONSTRAINT IF EXISTS "apiaries_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sso_domains" DROP CONSTRAINT IF EXISTS "sso_domains_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_oauth_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_flow_state_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_session_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."one_time_tokens" DROP CONSTRAINT IF EXISTS "one_time_tokens_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_client_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_challenges" DROP CONSTRAINT IF EXISTS "mfa_challenges_auth_factor_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "mfa_amr_claims_session_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_user_id_fkey";
DROP TRIGGER IF EXISTS "update_objects_updated_at" ON "storage"."objects";
DROP TRIGGER IF EXISTS "prefixes_delete_hierarchy" ON "storage"."prefixes";
DROP TRIGGER IF EXISTS "prefixes_create_hierarchy" ON "storage"."prefixes";
DROP TRIGGER IF EXISTS "objects_update_create_prefix" ON "storage"."objects";
DROP TRIGGER IF EXISTS "objects_insert_create_prefix" ON "storage"."objects";
DROP TRIGGER IF EXISTS "objects_delete_delete_prefix" ON "storage"."objects";
DROP TRIGGER IF EXISTS "enforce_bucket_name_length_trigger" ON "storage"."buckets";
DROP TRIGGER IF EXISTS "tr_check_filters" ON "realtime"."subscription";
DROP TRIGGER IF EXISTS "update_mentor_profiles_updated_at" ON "public"."mentor_profiles";
DROP TRIGGER IF EXISTS "on_auth_user_created" ON "auth"."users";
DROP INDEX IF EXISTS "storage"."vector_indexes_name_bucket_id_idx";
DROP INDEX IF EXISTS "storage"."objects_bucket_id_level_idx";
DROP INDEX IF EXISTS "storage"."name_prefix_search";
DROP INDEX IF EXISTS "storage"."idx_prefixes_lower_name";
DROP INDEX IF EXISTS "storage"."idx_objects_lower_name";
DROP INDEX IF EXISTS "storage"."idx_objects_bucket_id_name";
DROP INDEX IF EXISTS "storage"."idx_name_bucket_level_unique";
DROP INDEX IF EXISTS "storage"."idx_multipart_uploads_list";
DROP INDEX IF EXISTS "storage"."buckets_analytics_unique_name_idx";
DROP INDEX IF EXISTS "storage"."bucketid_objname";
DROP INDEX IF EXISTS "storage"."bname";
DROP INDEX IF EXISTS "realtime"."subscription_subscription_id_entity_filters_key";
DROP INDEX IF EXISTS "realtime"."messages_inserted_at_topic_index";
DROP INDEX IF EXISTS "realtime"."ix_realtime_subscription_entity";
DROP INDEX IF EXISTS "auth"."users_is_anonymous_idx";
DROP INDEX IF EXISTS "auth"."users_instance_id_idx";
DROP INDEX IF EXISTS "auth"."users_instance_id_email_idx";
DROP INDEX IF EXISTS "auth"."users_email_partial_key";
DROP INDEX IF EXISTS "auth"."user_id_created_at_idx";
DROP INDEX IF EXISTS "auth"."unique_phone_factor_per_user";
DROP INDEX IF EXISTS "auth"."sso_providers_resource_id_pattern_idx";
DROP INDEX IF EXISTS "auth"."sso_providers_resource_id_idx";
DROP INDEX IF EXISTS "auth"."sso_domains_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."sso_domains_domain_idx";
DROP INDEX IF EXISTS "auth"."sessions_user_id_idx";
DROP INDEX IF EXISTS "auth"."sessions_oauth_client_id_idx";
DROP INDEX IF EXISTS "auth"."sessions_not_after_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_for_email_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_created_at_idx";
DROP INDEX IF EXISTS "auth"."saml_providers_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_updated_at_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_session_id_revoked_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_parent_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_instance_id_user_id_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_instance_id_idx";
DROP INDEX IF EXISTS "auth"."recovery_token_idx";
DROP INDEX IF EXISTS "auth"."reauthentication_token_idx";
DROP INDEX IF EXISTS "auth"."one_time_tokens_user_id_token_type_key";
DROP INDEX IF EXISTS "auth"."one_time_tokens_token_hash_hash_idx";
DROP INDEX IF EXISTS "auth"."one_time_tokens_relates_to_hash_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_user_order_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_active_user_client_idx";
DROP INDEX IF EXISTS "auth"."oauth_consents_active_client_idx";
DROP INDEX IF EXISTS "auth"."oauth_clients_deleted_at_idx";
DROP INDEX IF EXISTS "auth"."oauth_auth_pending_exp_idx";
DROP INDEX IF EXISTS "auth"."mfa_factors_user_id_idx";
DROP INDEX IF EXISTS "auth"."mfa_factors_user_friendly_name_unique";
DROP INDEX IF EXISTS "auth"."mfa_challenge_created_at_idx";
DROP INDEX IF EXISTS "auth"."idx_user_id_auth_method";
DROP INDEX IF EXISTS "auth"."idx_oauth_client_states_created_at";
DROP INDEX IF EXISTS "auth"."idx_auth_code";
DROP INDEX IF EXISTS "auth"."identities_user_id_idx";
DROP INDEX IF EXISTS "auth"."identities_email_idx";
DROP INDEX IF EXISTS "auth"."flow_state_created_at_idx";
DROP INDEX IF EXISTS "auth"."factor_id_created_at_idx";
DROP INDEX IF EXISTS "auth"."email_change_token_new_idx";
DROP INDEX IF EXISTS "auth"."email_change_token_current_idx";
DROP INDEX IF EXISTS "auth"."confirmation_token_idx";
DROP INDEX IF EXISTS "auth"."audit_logs_instance_id_idx";
ALTER TABLE IF EXISTS ONLY "storage"."vector_indexes" DROP CONSTRAINT IF EXISTS "vector_indexes_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."prefixes" DROP CONSTRAINT IF EXISTS "prefixes_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."objects" DROP CONSTRAINT IF EXISTS "objects_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."migrations" DROP CONSTRAINT IF EXISTS "migrations_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."migrations" DROP CONSTRAINT IF EXISTS "migrations_name_key";
ALTER TABLE IF EXISTS ONLY "storage"."buckets_vectors" DROP CONSTRAINT IF EXISTS "buckets_vectors_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."buckets" DROP CONSTRAINT IF EXISTS "buckets_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."buckets_analytics" DROP CONSTRAINT IF EXISTS "buckets_analytics_pkey";
ALTER TABLE IF EXISTS ONLY "realtime"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "realtime"."subscription" DROP CONSTRAINT IF EXISTS "pk_subscription";
ALTER TABLE IF EXISTS ONLY "realtime"."messages" DROP CONSTRAINT IF EXISTS "messages_pkey";
ALTER TABLE IF EXISTS ONLY "public"."weather_forecasts" DROP CONSTRAINT IF EXISTS "weather_forecasts_pkey";
ALTER TABLE IF EXISTS ONLY "public"."weather_forecasts" DROP CONSTRAINT IF EXISTS "weather_forecasts_apiary_id_forecast_date_key";
ALTER TABLE IF EXISTS ONLY "public"."users" DROP CONSTRAINT IF EXISTS "users_pkey";
ALTER TABLE IF EXISTS ONLY "public"."user_roles" DROP CONSTRAINT IF EXISTS "user_roles_user_id_role_key";
ALTER TABLE IF EXISTS ONLY "public"."user_roles" DROP CONSTRAINT IF EXISTS "user_roles_pkey";
ALTER TABLE IF EXISTS ONLY "public"."tasks" DROP CONSTRAINT IF EXISTS "tasks_pkey";
ALTER TABLE IF EXISTS ONLY "public"."mentor_profiles" DROP CONSTRAINT IF EXISTS "mentor_profiles_pkey";
ALTER TABLE IF EXISTS ONLY "public"."interventions" DROP CONSTRAINT IF EXISTS "interventions_pkey";
ALTER TABLE IF EXISTS ONLY "public"."inspections" DROP CONSTRAINT IF EXISTS "inspections_pkey";
ALTER TABLE IF EXISTS ONLY "public"."hives" DROP CONSTRAINT IF EXISTS "hives_pkey";
ALTER TABLE IF EXISTS ONLY "public"."hive_snapshots" DROP CONSTRAINT IF EXISTS "hive_snapshots_pkey";
ALTER TABLE IF EXISTS ONLY "public"."apiary_shares" DROP CONSTRAINT IF EXISTS "apiary_shares_pkey";
ALTER TABLE IF EXISTS ONLY "public"."apiary_shares" DROP CONSTRAINT IF EXISTS "apiary_shares_apiary_id_viewer_id_key";
ALTER TABLE IF EXISTS ONLY "public"."apiaries" DROP CONSTRAINT IF EXISTS "apiaries_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."users" DROP CONSTRAINT IF EXISTS "users_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."users" DROP CONSTRAINT IF EXISTS "users_phone_key";
ALTER TABLE IF EXISTS ONLY "auth"."sso_providers" DROP CONSTRAINT IF EXISTS "sso_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."sso_domains" DROP CONSTRAINT IF EXISTS "sso_domains_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_entity_id_key";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_token_unique";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."one_time_tokens" DROP CONSTRAINT IF EXISTS "one_time_tokens_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_user_client_unique";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_consents" DROP CONSTRAINT IF EXISTS "oauth_consents_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_clients" DROP CONSTRAINT IF EXISTS "oauth_clients_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_client_states" DROP CONSTRAINT IF EXISTS "oauth_client_states_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_authorization_id_key";
ALTER TABLE IF EXISTS ONLY "auth"."oauth_authorizations" DROP CONSTRAINT IF EXISTS "oauth_authorizations_authorization_code_key";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_last_challenged_at_key";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_challenges" DROP CONSTRAINT IF EXISTS "mfa_challenges_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "mfa_amr_claims_session_id_authentication_method_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."instances" DROP CONSTRAINT IF EXISTS "instances_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_provider_id_provider_unique";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."flow_state" DROP CONSTRAINT IF EXISTS "flow_state_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."audit_log_entries" DROP CONSTRAINT IF EXISTS "audit_log_entries_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "amr_id_pk";
ALTER TABLE IF EXISTS "auth"."refresh_tokens" ALTER COLUMN "id" DROP DEFAULT;
DROP TABLE IF EXISTS "storage"."vector_indexes";
DROP TABLE IF EXISTS "storage"."s3_multipart_uploads_parts";
DROP TABLE IF EXISTS "storage"."s3_multipart_uploads";
DROP TABLE IF EXISTS "storage"."prefixes";
DROP TABLE IF EXISTS "storage"."objects";
DROP TABLE IF EXISTS "storage"."migrations";
DROP TABLE IF EXISTS "storage"."buckets_vectors";
DROP TABLE IF EXISTS "storage"."buckets_analytics";
DROP TABLE IF EXISTS "storage"."buckets";
DROP TABLE IF EXISTS "realtime"."subscription";
DROP TABLE IF EXISTS "realtime"."schema_migrations";
DROP TABLE IF EXISTS "realtime"."messages";
DROP TABLE IF EXISTS "public"."weather_forecasts";
DROP TABLE IF EXISTS "public"."users";
DROP TABLE IF EXISTS "public"."user_roles";
DROP TABLE IF EXISTS "public"."tasks";
DROP TABLE IF EXISTS "public"."mentor_profiles";
DROP TABLE IF EXISTS "public"."interventions";
DROP TABLE IF EXISTS "public"."inspections";
DROP TABLE IF EXISTS "public"."hives";
DROP TABLE IF EXISTS "public"."hive_snapshots";
DROP TABLE IF EXISTS "public"."apiary_shares";
DROP TABLE IF EXISTS "public"."apiaries";
DROP TABLE IF EXISTS "auth"."users";
DROP TABLE IF EXISTS "auth"."sso_providers";
DROP TABLE IF EXISTS "auth"."sso_domains";
DROP TABLE IF EXISTS "auth"."sessions";
DROP TABLE IF EXISTS "auth"."schema_migrations";
DROP TABLE IF EXISTS "auth"."saml_relay_states";
DROP TABLE IF EXISTS "auth"."saml_providers";
DROP SEQUENCE IF EXISTS "auth"."refresh_tokens_id_seq";
DROP TABLE IF EXISTS "auth"."refresh_tokens";
DROP TABLE IF EXISTS "auth"."one_time_tokens";
DROP TABLE IF EXISTS "auth"."oauth_consents";
DROP TABLE IF EXISTS "auth"."oauth_clients";
DROP TABLE IF EXISTS "auth"."oauth_client_states";
DROP TABLE IF EXISTS "auth"."oauth_authorizations";
DROP TABLE IF EXISTS "auth"."mfa_factors";
DROP TABLE IF EXISTS "auth"."mfa_challenges";
DROP TABLE IF EXISTS "auth"."mfa_amr_claims";
DROP TABLE IF EXISTS "auth"."instances";
DROP TABLE IF EXISTS "auth"."identities";
DROP TABLE IF EXISTS "auth"."flow_state";
DROP TABLE IF EXISTS "auth"."audit_log_entries";
DROP FUNCTION IF EXISTS "storage"."update_updated_at_column"();
DROP FUNCTION IF EXISTS "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer, "levels" integer, "start_after" "text", "sort_order" "text", "sort_column" "text", "sort_column_after" "text");
DROP FUNCTION IF EXISTS "storage"."search_v1_optimised"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."prefixes_insert_trigger"();
DROP FUNCTION IF EXISTS "storage"."prefixes_delete_cleanup"();
DROP FUNCTION IF EXISTS "storage"."operation"();
DROP FUNCTION IF EXISTS "storage"."objects_update_prefix_trigger"();
DROP FUNCTION IF EXISTS "storage"."objects_update_level_trigger"();
DROP FUNCTION IF EXISTS "storage"."objects_update_cleanup"();
DROP FUNCTION IF EXISTS "storage"."objects_insert_prefix_trigger"();
DROP FUNCTION IF EXISTS "storage"."objects_delete_cleanup"();
DROP FUNCTION IF EXISTS "storage"."lock_top_prefixes"("bucket_ids" "text"[], "names" "text"[]);
DROP FUNCTION IF EXISTS "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "start_after" "text", "next_token" "text");
DROP FUNCTION IF EXISTS "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "next_key_token" "text", "next_upload_token" "text");
DROP FUNCTION IF EXISTS "storage"."get_size_by_bucket"();
DROP FUNCTION IF EXISTS "storage"."get_prefixes"("name" "text");
DROP FUNCTION IF EXISTS "storage"."get_prefix"("name" "text");
DROP FUNCTION IF EXISTS "storage"."get_level"("name" "text");
DROP FUNCTION IF EXISTS "storage"."foldername"("name" "text");
DROP FUNCTION IF EXISTS "storage"."filename"("name" "text");
DROP FUNCTION IF EXISTS "storage"."extension"("name" "text");
DROP FUNCTION IF EXISTS "storage"."enforce_bucket_name_length"();
DROP FUNCTION IF EXISTS "storage"."delete_prefix_hierarchy_trigger"();
DROP FUNCTION IF EXISTS "storage"."delete_prefix"("_bucket_id" "text", "_name" "text");
DROP FUNCTION IF EXISTS "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]);
DROP FUNCTION IF EXISTS "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb");
DROP FUNCTION IF EXISTS "storage"."add_prefixes"("_bucket_id" "text", "_name" "text");
DROP FUNCTION IF EXISTS "realtime"."topic"();
DROP FUNCTION IF EXISTS "realtime"."to_regrole"("role_name" "text");
DROP FUNCTION IF EXISTS "realtime"."subscription_check_filters"();
DROP FUNCTION IF EXISTS "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean);
DROP FUNCTION IF EXISTS "realtime"."quote_wal2json"("entity" "regclass");
DROP FUNCTION IF EXISTS "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer);
DROP FUNCTION IF EXISTS "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]);
DROP FUNCTION IF EXISTS "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text");
DROP FUNCTION IF EXISTS "realtime"."cast"("val" "text", "type_" "regtype");
DROP FUNCTION IF EXISTS "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]);
DROP FUNCTION IF EXISTS "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text");
DROP FUNCTION IF EXISTS "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer);
DROP FUNCTION IF EXISTS "public"."update_updated_at_column"();
DROP FUNCTION IF EXISTS "public"."is_admin"();
DROP FUNCTION IF EXISTS "public"."handle_new_user"();
DROP FUNCTION IF EXISTS "public"."get_user_by_email_for_admin"("email_input" "text");
DROP FUNCTION IF EXISTS "public"."check_hive_access"("p_hive_id" "uuid", "p_user_id" "uuid");
DROP FUNCTION IF EXISTS "public"."check_hive_access"("hive_id_input" "uuid");
DROP FUNCTION IF EXISTS "public"."check_hive_access"("hive_id" "text");
DROP FUNCTION IF EXISTS "pgbouncer"."get_auth"("p_usename" "text");
DROP FUNCTION IF EXISTS "extensions"."set_graphql_placeholder"();
DROP FUNCTION IF EXISTS "extensions"."pgrst_drop_watch"();
DROP FUNCTION IF EXISTS "extensions"."pgrst_ddl_watch"();
DROP FUNCTION IF EXISTS "extensions"."grant_pg_net_access"();
DROP FUNCTION IF EXISTS "extensions"."grant_pg_graphql_access"();
DROP FUNCTION IF EXISTS "extensions"."grant_pg_cron_access"();
DROP FUNCTION IF EXISTS "auth"."uid"();
DROP FUNCTION IF EXISTS "auth"."role"();
DROP FUNCTION IF EXISTS "auth"."jwt"();
DROP FUNCTION IF EXISTS "auth"."email"();
DROP TYPE IF EXISTS "storage"."buckettype";
DROP TYPE IF EXISTS "realtime"."wal_rls";
DROP TYPE IF EXISTS "realtime"."wal_column";
DROP TYPE IF EXISTS "realtime"."user_defined_filter";
DROP TYPE IF EXISTS "realtime"."equality_op";
DROP TYPE IF EXISTS "realtime"."action";
DROP TYPE IF EXISTS "auth"."one_time_token_type";
DROP TYPE IF EXISTS "auth"."oauth_response_type";
DROP TYPE IF EXISTS "auth"."oauth_registration_type";
DROP TYPE IF EXISTS "auth"."oauth_client_type";
DROP TYPE IF EXISTS "auth"."oauth_authorization_status";
DROP TYPE IF EXISTS "auth"."factor_type";
DROP TYPE IF EXISTS "auth"."factor_status";
DROP TYPE IF EXISTS "auth"."code_challenge_method";
DROP TYPE IF EXISTS "auth"."aal_level";
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS "supabase_vault";
DROP EXTENSION IF EXISTS "pgcrypto";
DROP EXTENSION IF EXISTS "pg_stat_statements";
DROP EXTENSION IF EXISTS "pg_graphql";
DROP SCHEMA IF EXISTS "vault";
DROP SCHEMA IF EXISTS "storage";
DROP SCHEMA IF EXISTS "realtime";
DROP SCHEMA IF EXISTS "pgbouncer";
DROP SCHEMA IF EXISTS "graphql_public";
DROP SCHEMA IF EXISTS "graphql";
DROP SCHEMA IF EXISTS "extensions";
DROP SCHEMA IF EXISTS "auth";
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "auth";


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "extensions";


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "graphql";


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "graphql_public";


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "pgbouncer";


--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "realtime";


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "storage";


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "vault";


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


--
-- Name: EXTENSION "pg_graphql"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pg_graphql" IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pg_stat_statements"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pg_stat_statements" IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pgcrypto"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pgcrypto" IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";


--
-- Name: EXTENSION "supabase_vault"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "supabase_vault" IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_authorization_status" AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_client_type" AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_registration_type" AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_response_type" AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."one_time_token_type" AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."action" AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."equality_op" AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."user_defined_filter" AS (
	"column_name" "text",
	"op" "realtime"."equality_op",
	"value" "text"
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."wal_column" AS (
	"name" "text",
	"type_name" "text",
	"type_oid" "oid",
	"value" "jsonb",
	"is_pkey" boolean,
	"is_selectable" boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."wal_rls" AS (
	"wal" "jsonb",
	"is_rls_enabled" boolean,
	"subscription_ids" "uuid"[],
	"errors" "text"[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE "storage"."buckettype" AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."email"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION "email"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."email"() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."jwt"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."role"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION "role"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION "uid"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."uid"() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_cron_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION "grant_pg_cron_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_cron_access"() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_graphql_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION "grant_pg_graphql_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_graphql_access"() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_net_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION "grant_pg_net_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_net_access"() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."pgrst_ddl_watch"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."pgrst_drop_watch"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."set_graphql_placeholder"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION "set_graphql_placeholder"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."set_graphql_placeholder"() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth("text"); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION "pgbouncer"."get_auth"("p_usename" "text") RETURNS TABLE("username" "text", "password" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


--
-- Name: check_hive_access("text"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."check_hive_access"("hive_id" "text") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  select exists (
    select 1 from public.hives h
    join public.apiaries a on h.apiary_id = a.id
    where h.id = hive_id
    and a.user_id = auth.uid()
  );
$$;


--
-- Name: FUNCTION "check_hive_access"("hive_id" "text"); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION "public"."check_hive_access"("hive_id" "text") IS 'Checks if the current authenticated user has access to a hive. Security: Fixed search_path.';


--
-- Name: check_hive_access("uuid"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."check_hive_access"("hive_id_input" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
            BEGIN
              RETURN EXISTS (
                SELECT 1 FROM hives h
                JOIN apiaries a ON a.id = h.apiary_id
                LEFT JOIN apiary_shares s ON s.apiary_id = a.id AND s.viewer_id = auth.uid()
                WHERE h.id = hive_id_input
                AND (
                    a.user_id = auth.uid()
                    OR 
                    s.id IS NOT NULL
                )
              );
            END;
            $$;


--
-- Name: check_hive_access("uuid", "uuid"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."check_hive_access"("p_hive_id" "uuid", "p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
    -- Check if the user owns an apiary that contains this hive
    RETURN EXISTS (
        SELECT 1
        FROM public.hives h
        INNER JOIN public.apiaries a ON h.apiary_id = a.id
        WHERE h.id = p_hive_id
        AND a.user_id = p_user_id
    );
END;
$$;


--
-- Name: FUNCTION "check_hive_access"("p_hive_id" "uuid", "p_user_id" "uuid"); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION "public"."check_hive_access"("p_hive_id" "uuid", "p_user_id" "uuid") IS 'Checks if a specific user has access to a hive. Security: Fixed search_path.';


--
-- Name: get_user_by_email_for_admin("text"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."get_user_by_email_for_admin"("email_input" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    found_id uuid;
    is_admin boolean;
BEGIN
    -- 1. Security Check: Is the caller an Admin?
    SELECT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    ) INTO is_admin;

    IF NOT is_admin THEN
        RAISE EXCEPTION 'Access Denied: Only admins can perform user lookups.';
    END IF;

    -- 2. Perform the Lookup
    SELECT id INTO found_id FROM auth.users WHERE email = email_input;

    RETURN found_id;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
            BEGIN
              INSERT INTO public.users (id, email, display_name)
              VALUES (
                NEW.id,
                NEW.email,
                NEW.raw_user_meta_data->>'display_name'
              )
              ON CONFLICT (id) DO NOTHING;
              RETURN NEW;
            END;
            $$;


--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
            BEGIN
              RETURN EXISTS (
                SELECT 1 FROM user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'
              );
            END;
            $$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$;


--
-- Name: apply_rls("jsonb", integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer DEFAULT (1024 * 1024)) RETURNS SETOF "realtime"."wal_rls"
    LANGUAGE "plpgsql"
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes("text", "text", "text", "text", "text", "record", "record", "text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text" DEFAULT 'ROW'::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql("text", "regclass", "realtime"."wal_column"[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) RETURNS "text"
    LANGUAGE "sql"
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast("text", "regtype"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") RETURNS "jsonb"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- Name: check_equality_op("realtime"."equality_op", "regtype", "text", "text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") RETURNS boolean
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters("realtime"."wal_column"[], "realtime"."user_defined_filter"[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) RETURNS boolean
    LANGUAGE "sql" IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes("name", "name", integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer) RETURNS SETOF "realtime"."wal_rls"
    LANGUAGE "sql"
    SET "log_min_messages" TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- Name: quote_wal2json("regclass"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."quote_wal2json"("entity" "regclass") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send("jsonb", "text", "text", boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean DEFAULT true) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."subscription_check_filters"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole("text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."to_regrole"("role_name" "text") RETURNS "regrole"
    LANGUAGE "sql" IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."topic"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: add_prefixes("text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."add_prefixes"("_bucket_id" "text", "_name" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- Name: can_insert_object("text", "text", "uuid", "jsonb"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: delete_leaf_prefixes("text"[], "text"[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


--
-- Name: delete_prefix("text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_prefix"("_bucket_id" "text", "_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_prefix_hierarchy_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."enforce_bucket_name_length"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."extension"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."filename"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."foldername"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_level("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_level"("name" "text") RETURNS integer
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- Name: get_prefix("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_prefix"("name" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- Name: get_prefixes("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_prefixes"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_size_by_bucket"() RETURNS TABLE("size" bigint, "bucket_id" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "next_key_token" "text" DEFAULT ''::"text", "next_upload_token" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "id" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "start_after" "text" DEFAULT ''::"text", "next_token" "text" DEFAULT ''::"text") RETURNS TABLE("name" "text", "id" "uuid", "metadata" "jsonb", "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: lock_top_prefixes("text"[], "text"[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."lock_top_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_delete_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_insert_prefix_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_level_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_prefix_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."operation"() RETURNS "text"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."prefixes_delete_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."prefixes_insert_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- Name: search("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- Name: search_legacy_v1("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v1_optimised("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_v1_optimised"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v2("text", "text", integer, integer, "text", "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "start_after" "text" DEFAULT ''::"text", "sort_order" "text" DEFAULT 'asc'::"text", "sort_column" "text" DEFAULT 'name'::"text", "sort_column_after" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."audit_log_entries" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "payload" json,
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE "audit_log_entries"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."flow_state" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "auth_code" "text" NOT NULL,
    "code_challenge_method" "auth"."code_challenge_method" NOT NULL,
    "code_challenge" "text" NOT NULL,
    "provider_type" "text" NOT NULL,
    "provider_access_token" "text",
    "provider_refresh_token" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" "text" NOT NULL,
    "auth_code_issued_at" timestamp with time zone
);


--
-- Name: TABLE "flow_state"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."flow_state" IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."identities" (
    "provider_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "identity_data" "jsonb" NOT NULL,
    "provider" "text" NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" "text" GENERATED ALWAYS AS ("lower"(("identity_data" ->> 'email'::"text"))) STORED,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- Name: TABLE "identities"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN "identities"."email"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."instances" (
    "id" "uuid" NOT NULL,
    "uuid" "uuid",
    "raw_base_config" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


--
-- Name: TABLE "instances"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" "text" NOT NULL,
    "id" "uuid" NOT NULL
);


--
-- Name: TABLE "mfa_amr_claims"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_challenges" (
    "id" "uuid" NOT NULL,
    "factor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" "inet" NOT NULL,
    "otp_code" "text",
    "web_authn_session_data" "jsonb"
);


--
-- Name: TABLE "mfa_challenges"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_factors" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "friendly_name" "text",
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" "text",
    "phone" "text",
    "last_challenged_at" timestamp with time zone,
    "web_authn_credential" "jsonb",
    "web_authn_aaguid" "uuid",
    "last_webauthn_challenge_data" "jsonb"
);


--
-- Name: TABLE "mfa_factors"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';


--
-- Name: COLUMN "mfa_factors"."last_webauthn_challenge_data"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."mfa_factors"."last_webauthn_challenge_data" IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_authorizations" (
    "id" "uuid" NOT NULL,
    "authorization_id" "text" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "redirect_uri" "text" NOT NULL,
    "scope" "text" NOT NULL,
    "state" "text",
    "resource" "text",
    "code_challenge" "text",
    "code_challenge_method" "auth"."code_challenge_method",
    "response_type" "auth"."oauth_response_type" DEFAULT 'code'::"auth"."oauth_response_type" NOT NULL,
    "status" "auth"."oauth_authorization_status" DEFAULT 'pending'::"auth"."oauth_authorization_status" NOT NULL,
    "authorization_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '00:03:00'::interval) NOT NULL,
    "approved_at" timestamp with time zone,
    "nonce" "text",
    CONSTRAINT "oauth_authorizations_authorization_code_length" CHECK (("char_length"("authorization_code") <= 255)),
    CONSTRAINT "oauth_authorizations_code_challenge_length" CHECK (("char_length"("code_challenge") <= 128)),
    CONSTRAINT "oauth_authorizations_expires_at_future" CHECK (("expires_at" > "created_at")),
    CONSTRAINT "oauth_authorizations_nonce_length" CHECK (("char_length"("nonce") <= 255)),
    CONSTRAINT "oauth_authorizations_redirect_uri_length" CHECK (("char_length"("redirect_uri") <= 2048)),
    CONSTRAINT "oauth_authorizations_resource_length" CHECK (("char_length"("resource") <= 2048)),
    CONSTRAINT "oauth_authorizations_scope_length" CHECK (("char_length"("scope") <= 4096)),
    CONSTRAINT "oauth_authorizations_state_length" CHECK (("char_length"("state") <= 4096))
);


--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_client_states" (
    "id" "uuid" NOT NULL,
    "provider_type" "text" NOT NULL,
    "code_verifier" "text",
    "created_at" timestamp with time zone NOT NULL
);


--
-- Name: TABLE "oauth_client_states"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."oauth_client_states" IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_clients" (
    "id" "uuid" NOT NULL,
    "client_secret_hash" "text",
    "registration_type" "auth"."oauth_registration_type" NOT NULL,
    "redirect_uris" "text" NOT NULL,
    "grant_types" "text" NOT NULL,
    "client_name" "text",
    "client_uri" "text",
    "logo_uri" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "client_type" "auth"."oauth_client_type" DEFAULT 'confidential'::"auth"."oauth_client_type" NOT NULL,
    CONSTRAINT "oauth_clients_client_name_length" CHECK (("char_length"("client_name") <= 1024)),
    CONSTRAINT "oauth_clients_client_uri_length" CHECK (("char_length"("client_uri") <= 2048)),
    CONSTRAINT "oauth_clients_logo_uri_length" CHECK (("char_length"("logo_uri") <= 2048))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_consents" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "scopes" "text" NOT NULL,
    "granted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "revoked_at" timestamp with time zone,
    CONSTRAINT "oauth_consents_revoked_after_granted" CHECK ((("revoked_at" IS NULL) OR ("revoked_at" >= "granted_at"))),
    CONSTRAINT "oauth_consents_scopes_length" CHECK (("char_length"("scopes") <= 2048)),
    CONSTRAINT "oauth_consents_scopes_not_empty" CHECK (("char_length"(TRIM(BOTH FROM "scopes")) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."one_time_tokens" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" "text" NOT NULL,
    "relates_to" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" "uuid",
    "id" bigint NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" "uuid"
);


--
-- Name: TABLE "refresh_tokens"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."saml_providers" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "entity_id" "text" NOT NULL,
    "metadata_xml" "text" NOT NULL,
    "metadata_url" "text",
    "attribute_mapping" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" "text",
    CONSTRAINT "entity_id not empty" CHECK (("char_length"("entity_id") > 0)),
    CONSTRAINT "metadata_url not empty" CHECK ((("metadata_url" = NULL::"text") OR ("char_length"("metadata_url") > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK (("char_length"("metadata_xml") > 0))
);


--
-- Name: TABLE "saml_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."saml_relay_states" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "request_id" "text" NOT NULL,
    "for_email" "text",
    "redirect_to" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" "uuid",
    CONSTRAINT "request_id not empty" CHECK (("char_length"("request_id") > 0))
);


--
-- Name: TABLE "saml_relay_states"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);


--
-- Name: TABLE "schema_migrations"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sessions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" "uuid",
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" "text",
    "ip" "inet",
    "tag" "text",
    "oauth_client_id" "uuid",
    "refresh_token_hmac_key" "text",
    "refresh_token_counter" bigint,
    "scopes" "text",
    CONSTRAINT "sessions_scopes_length" CHECK (("char_length"("scopes") <= 4096))
);


--
-- Name: TABLE "sessions"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN "sessions"."not_after"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN "sessions"."refresh_token_hmac_key"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_hmac_key" IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN "sessions"."refresh_token_counter"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_counter" IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sso_domains" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK (("char_length"("domain") > 0))
);


--
-- Name: TABLE "sso_domains"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sso_providers" (
    "id" "uuid" NOT NULL,
    "resource_id" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "disabled" boolean,
    CONSTRAINT "resource_id not empty" CHECK ((("resource_id" = NULL::"text") OR ("char_length"("resource_id") > 0)))
);


--
-- Name: TABLE "sso_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN "sso_providers"."resource_id"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."users" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" "text" DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" "text" DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2)))
);


--
-- Name: TABLE "users"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN "users"."is_sso_user"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: apiaries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."apiaries" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "zip_code" "text" NOT NULL,
    "latitude" double precision,
    "longitude" double precision,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "deleted_at" timestamp with time zone
);


--
-- Name: apiary_shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."apiary_shares" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "apiary_id" "text" NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "viewer_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: hive_snapshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."hive_snapshots" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "hive_id" "text" NOT NULL,
    "timestamp" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "bars" "text" NOT NULL,
    "notes" "text",
    "weather" "jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "deleted_at" timestamp with time zone,
    "inactive_bar_count" integer,
    "active_bar_count" integer,
    "empty_bar_count" integer,
    "brood_bar_count" integer,
    "resource_bar_count" integer,
    "follower_board_position" integer
);


--
-- Name: hives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."hives" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "apiary_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text",
    "bar_count" integer,
    "bars" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "deleted_at" timestamp with time zone,
    "last_inspection_date" timestamp with time zone,
    "notes" "text"
);


--
-- Name: inspections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."inspections" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "hive_id" "text" NOT NULL,
    "user_id" "uuid",
    "timestamp" timestamp with time zone NOT NULL,
    "queen_status" "text" NOT NULL,
    "brood_pattern" "text",
    "population_strength" "text",
    "temperament" "text",
    "honey_stores" "text",
    "pollen_stores" "text",
    "observations" "text",
    "weather" "jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "deleted_at" timestamp with time zone,
    "snapshot_id" "text"
);


--
-- Name: interventions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."interventions" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "hive_id" "text" NOT NULL,
    "type" "text" NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "description" "text",
    "notes" "text",
    "weather" "jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "deleted_at" timestamp with time zone,
    "inspection_id" "text"
);


--
-- Name: mentor_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."mentor_profiles" (
    "user_id" "uuid" NOT NULL,
    "display_name" "text" NOT NULL,
    "location" "text",
    "bio" "text",
    "is_accepting_students" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."tasks" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "assigned_user_id" "uuid",
    "apiary_id" "text",
    "hive_id" "text",
    "scope" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "due_date" timestamp with time zone,
    "priority" "text" DEFAULT 'medium'::"text",
    "status" "text" DEFAULT 'pending'::"text",
    "is_synced" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "deleted_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    CONSTRAINT "tasks_scope_check" CHECK (("scope" = ANY (ARRAY['hive'::"text", 'apiary'::"text", 'user'::"text"])))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."user_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "display_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_mentor" boolean DEFAULT false,
    "mentor_location" "text",
    "mentor_bio" "text",
    "role" "text" DEFAULT 'user'::"text",
    CONSTRAINT "users_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'mentor'::"text", 'admin'::"text"])))
);


--
-- Name: weather_forecasts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."weather_forecasts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "apiary_id" "text" NOT NULL,
    "forecast_date" "date" NOT NULL,
    "data" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
)
PARTITION BY RANGE ("inserted_at");


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."schema_migrations" (
    "version" bigint NOT NULL,
    "inserted_at" timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."subscription" (
    "id" bigint NOT NULL,
    "subscription_id" "uuid" NOT NULL,
    "entity" "regclass" NOT NULL,
    "filters" "realtime"."user_defined_filter"[] DEFAULT '{}'::"realtime"."user_defined_filter"[] NOT NULL,
    "claims" "jsonb" NOT NULL,
    "claims_role" "regrole" GENERATED ALWAYS AS ("realtime"."to_regrole"(("claims" ->> 'role'::"text"))) STORED NOT NULL,
    "created_at" timestamp without time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE "realtime"."subscription" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "realtime"."subscription_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" "text"[],
    "owner_id" "text",
    "type" "storage"."buckettype" DEFAULT 'STANDARD'::"storage"."buckettype" NOT NULL
);


--
-- Name: COLUMN "buckets"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets_analytics" (
    "name" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'ANALYTICS'::"storage"."buckettype" NOT NULL,
    "format" "text" DEFAULT 'ICEBERG'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "deleted_at" timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets_vectors" (
    "id" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'VECTOR'::"storage"."buckettype" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" "text",
    "name" "text",
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "path_tokens" "text"[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::"text")) STORED,
    "version" "text",
    "owner_id" "text",
    "user_metadata" "jsonb",
    "level" integer
);


--
-- Name: COLUMN "objects"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."prefixes" (
    "bucket_id" "text" NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "level" integer GENERATED ALWAYS AS ("storage"."get_level"("name")) STORED NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."s3_multipart_uploads" (
    "id" "text" NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" "text" NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "version" "text" NOT NULL,
    "owner_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_metadata" "jsonb"
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."s3_multipart_uploads_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "upload_id" "text" NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "etag" "text" NOT NULL,
    "owner_id" "text",
    "version" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."vector_indexes" (
    "id" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "bucket_id" "text" NOT NULL,
    "data_type" "text" NOT NULL,
    "dimension" integer NOT NULL,
    "distance_metric" "text" NOT NULL,
    "metadata_configuration" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
320a4cbf-7802-4d26-adf3-f000a8d1d4dc	a7ec24ff-3af8-4035-8685-01d9e5595c53	9ac1606d-c667-4dc5-9b28-256764a7bedf	s256	bZKZfGxAVwSNs5yN09RUAh6kDacO_vft5kfADxnLOg4	email			2025-12-21 17:15:11.817471+00	2025-12-21 17:15:11.817471+00	email/signup	\N
dc05cbb0-17cf-47ee-9a1b-3353c0f41013	3f5b23d0-8f24-4056-b53a-5f8242952b04	c75e7a18-0100-483a-8fa4-0329b9a24cb5	s256	B2WafK581NzkY3UkcUZsw1cHRJEl3fl8cah_C72Ue2g	email			2026-01-09 21:48:44.507271+00	2026-01-09 21:49:27.386713+00	email/signup	2026-01-09 21:49:27.386678+00
c266367e-009d-4921-b054-9d6771892d21	3e383c19-12f5-4654-8d2e-516e9ee9e349	2c677796-1174-4d5e-89f6-fe2a21ba0459	s256	Q-2jQWtfG8slvsPGe_7p-hM6IZgICzOmFvdKwYZQ4hg	email			2026-01-09 22:05:02.84053+00	2026-01-09 22:05:28.102878+00	email/signup	2026-01-09 22:05:28.102842+00
8ae63be4-e0a9-46d1-a920-cf87a05b819f	d741a18f-0891-4a22-98db-9f88bceae7dd	8cdab636-29fb-4245-83c1-dcc168dad453	s256	jcKI8grQ6cLqapRu_41gZYGOPw_SGTBMEnxmDGiiwno	email			2026-01-11 00:58:55.130797+00	2026-01-11 00:59:20.643724+00	email/signup	2026-01-11 00:59:20.643687+00
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
e4f5029b-49da-44cb-9b5e-74a2bb91d704	e4f5029b-49da-44cb-9b5e-74a2bb91d704	{"sub": "e4f5029b-49da-44cb-9b5e-74a2bb91d704", "email": "ron.nolte@gmail.com", "email_verified": true, "phone_verified": false}	email	2025-12-17 04:49:25.600882+00	2025-12-17 04:49:25.602194+00	2025-12-17 04:49:25.602194+00	5634da84-16f6-49d7-834f-be73530df9ea
cfea3722-f310-465a-93e5-00c1f3f10ff7	cfea3722-f310-465a-93e5-00c1f3f10ff7	{"sub": "cfea3722-f310-465a-93e5-00c1f3f10ff7", "email": "admin@thenoltefamily.com", "email_verified": true, "phone_verified": false}	email	2025-12-17 20:26:12.553864+00	2025-12-17 20:26:12.553924+00	2025-12-17 20:26:12.553924+00	1f392168-6c0c-4e32-8968-d4d2d6d056cf
ee0710e4-305b-4fad-8e2c-60a2de9b583d	ee0710e4-305b-4fad-8e2c-60a2de9b583d	{"sub": "ee0710e4-305b-4fad-8e2c-60a2de9b583d", "email": "guest@beektools.com", "email_verified": false, "phone_verified": false}	email	2025-12-24 18:23:22.050532+00	2025-12-24 18:23:22.050595+00	2025-12-24 18:23:22.050595+00	4bc75d70-d506-4e7b-83f5-8e57fccc1e3c
3f5b23d0-8f24-4056-b53a-5f8242952b04	3f5b23d0-8f24-4056-b53a-5f8242952b04	{"sub": "3f5b23d0-8f24-4056-b53a-5f8242952b04", "email": "ron.nolte+admin@gmail.com", "email_verified": true, "phone_verified": false}	email	2026-01-09 21:48:44.500919+00	2026-01-09 21:48:44.500967+00	2026-01-09 21:48:44.500967+00	492f47e9-6689-4f27-835b-e183680103fd
3e383c19-12f5-4654-8d2e-516e9ee9e349	3e383c19-12f5-4654-8d2e-516e9ee9e349	{"sub": "3e383c19-12f5-4654-8d2e-516e9ee9e349", "email": "ron.nolte+regular@gmail.com", "email_verified": true, "phone_verified": false}	email	2026-01-09 22:05:02.830984+00	2026-01-09 22:05:02.831338+00	2026-01-09 22:05:02.831338+00	595d3bcc-368e-4835-860b-d8f9122b570c
d741a18f-0891-4a22-98db-9f88bceae7dd	d741a18f-0891-4a22-98db-9f88bceae7dd	{"sub": "d741a18f-0891-4a22-98db-9f88bceae7dd", "email": "ashton.nolte@gmail.com", "email_verified": true, "phone_verified": false}	email	2026-01-11 00:58:55.122545+00	2026-01-11 00:58:55.123169+00	2026-01-11 00:58:55.123169+00	3c0821a9-f438-4019-92de-7dbfcdc74931
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
2a94ffde-ba1e-4eba-adda-0e0596d7bc0e	2025-12-21 17:18:33.575583+00	2025-12-21 17:18:33.575583+00	password	27904c19-50cc-4ee6-907c-59905ed66353
a5e9b7f9-c66f-4a13-905e-75748a60400f	2026-01-11 00:39:56.5754+00	2026-01-11 00:39:56.5754+00	password	1497067d-544d-4b05-9ee3-91e4c2d30a9e
c0ca9ba7-426b-4187-b5f1-9149c117b110	2026-01-11 00:59:56.873938+00	2026-01-11 00:59:56.873938+00	password	979d4fdf-b008-4be1-a38e-8271e34c5ae7
50cc388e-5f6f-4959-91e9-94e92fe216c5	2025-12-20 20:08:28.098654+00	2025-12-20 20:08:28.098654+00	password	f0da6df2-eb54-491f-820a-62f87296ce4d
a214bdd3-5712-4d22-90a1-35ff72097df0	2025-12-17 21:11:14.293613+00	2025-12-17 21:11:14.293613+00	password	ec22ae26-1ae3-4312-9594-ece8642696d0
1713f5a6-d0a1-4f4f-ae34-d771a7f65034	2025-12-18 01:55:11.670374+00	2025-12-18 01:55:11.670374+00	password	8adf0dad-c8a3-4582-badf-b7fb07fbd983
67ec68f1-fab7-4222-aa2f-940491792291	2025-12-18 06:21:20.848414+00	2025-12-18 06:21:20.848414+00	password	ecb8e6c4-9529-448e-8708-d955d2ff9a26
3e7f3151-ceac-4cc3-be0d-3351c2452f6c	2025-12-18 18:23:56.312764+00	2025-12-18 18:23:56.312764+00	password	8022fc8a-baef-438e-b5fc-8e320e8e07b9
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	31	gybl4alvalbt	cfea3722-f310-465a-93e5-00c1f3f10ff7	t	2025-12-17 21:11:14.291434+00	2025-12-18 19:43:04.402386+00	\N	a214bdd3-5712-4d22-90a1-35ff72097df0
00000000-0000-0000-0000-000000000000	60	w3aiflie537p	cfea3722-f310-465a-93e5-00c1f3f10ff7	f	2025-12-18 19:43:04.42223+00	2025-12-18 19:43:04.42223+00	gybl4alvalbt	a214bdd3-5712-4d22-90a1-35ff72097df0
00000000-0000-0000-0000-000000000000	258	ivu72rzrbagu	d741a18f-0891-4a22-98db-9f88bceae7dd	f	2026-01-11 00:59:56.861698+00	2026-01-11 00:59:56.861698+00	\N	c0ca9ba7-426b-4187-b5f1-9149c117b110
00000000-0000-0000-0000-000000000000	33	zsfa5dv3hkfs	cfea3722-f310-465a-93e5-00c1f3f10ff7	f	2025-12-18 01:55:11.667328+00	2025-12-18 01:55:11.667328+00	\N	1713f5a6-d0a1-4f4f-ae34-d771a7f65034
00000000-0000-0000-0000-000000000000	145	kickfoqcmb4u	cfea3722-f310-465a-93e5-00c1f3f10ff7	f	2025-12-21 17:18:33.56541+00	2025-12-21 17:18:33.56541+00	\N	2a94ffde-ba1e-4eba-adda-0e0596d7bc0e
00000000-0000-0000-0000-000000000000	43	nqzcrvx6ayyy	cfea3722-f310-465a-93e5-00c1f3f10ff7	t	2025-12-18 06:21:20.845648+00	2025-12-18 18:13:33.632493+00	\N	67ec68f1-fab7-4222-aa2f-940491792291
00000000-0000-0000-0000-000000000000	47	zmxjyc7deceh	cfea3722-f310-465a-93e5-00c1f3f10ff7	f	2025-12-18 18:13:33.644536+00	2025-12-18 18:13:33.644536+00	nqzcrvx6ayyy	67ec68f1-fab7-4222-aa2f-940491792291
00000000-0000-0000-0000-000000000000	52	cvajme57357a	cfea3722-f310-465a-93e5-00c1f3f10ff7	f	2025-12-18 18:23:56.31094+00	2025-12-18 18:23:56.31094+00	\N	3e7f3151-ceac-4cc3-be0d-3351c2452f6c
00000000-0000-0000-0000-000000000000	104	3udpn4sylngx	cfea3722-f310-465a-93e5-00c1f3f10ff7	f	2025-12-20 20:08:28.096069+00	2025-12-20 20:08:28.096069+00	\N	50cc388e-5f6f-4959-91e9-94e92fe216c5
00000000-0000-0000-0000-000000000000	257	m4txqpfo5fg6	ee0710e4-305b-4fad-8e2c-60a2de9b583d	f	2026-01-11 00:39:56.572012+00	2026-01-11 00:39:56.572012+00	\N	a5e9b7f9-c66f-4a13-905e-75748a60400f
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."schema_migrations" ("version") FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
2a94ffde-ba1e-4eba-adda-0e0596d7bc0e	cfea3722-f310-465a-93e5-00c1f3f10ff7	2025-12-21 17:18:33.55771+00	2025-12-21 17:18:33.55771+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	174.50.67.105	\N	\N	\N	\N	\N
a5e9b7f9-c66f-4a13-905e-75748a60400f	ee0710e4-305b-4fad-8e2c-60a2de9b583d	2026-01-11 00:39:56.569923+00	2026-01-11 00:39:56.569923+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	85.237.194.224	\N	\N	\N	\N	\N
c0ca9ba7-426b-4187-b5f1-9149c117b110	d741a18f-0891-4a22-98db-9f88bceae7dd	2026-01-11 00:59:56.848521+00	2026-01-11 00:59:56.848521+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0	76.34.29.21	\N	\N	\N	\N	\N
50cc388e-5f6f-4959-91e9-94e92fe216c5	cfea3722-f310-465a-93e5-00c1f3f10ff7	2025-12-20 20:08:28.094087+00	2025-12-20 20:08:28.094087+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	174.50.67.105	\N	\N	\N	\N	\N
1713f5a6-d0a1-4f4f-ae34-d771a7f65034	cfea3722-f310-465a-93e5-00c1f3f10ff7	2025-12-18 01:55:11.665081+00	2025-12-18 01:55:11.665081+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	174.50.67.105	\N	\N	\N	\N	\N
67ec68f1-fab7-4222-aa2f-940491792291	cfea3722-f310-465a-93e5-00c1f3f10ff7	2025-12-18 06:21:20.832628+00	2025-12-18 18:13:33.657273+00	\N	aal1	\N	2025-12-18 18:13:33.656549	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36 EdgA/143.0.0.0	174.50.67.105	\N	\N	\N	\N	\N
3e7f3151-ceac-4cc3-be0d-3351c2452f6c	cfea3722-f310-465a-93e5-00c1f3f10ff7	2025-12-18 18:23:56.309649+00	2025-12-18 18:23:56.309649+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36 EdgA/143.0.0.0	174.50.67.105	\N	\N	\N	\N	\N
a214bdd3-5712-4d22-90a1-35ff72097df0	cfea3722-f310-465a-93e5-00c1f3f10ff7	2025-12-17 21:11:14.289748+00	2025-12-18 19:43:04.455501+00	\N	aal1	\N	2025-12-18 19:43:04.454101	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	174.50.67.105	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	ee0710e4-305b-4fad-8e2c-60a2de9b583d	authenticated	authenticated	guest@beektools.com	$2a$10$bMbOOKBatl.a83yRiIS3peRrrOhczojEQ5aogsUsjDBF9kV/xAJF2	2025-12-24 18:23:22.058905+00	\N		\N		\N			\N	2026-01-11 00:39:56.569816+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-12-24 18:23:22.027747+00	2026-01-11 00:39:56.574786+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	cfea3722-f310-465a-93e5-00c1f3f10ff7	authenticated	authenticated	admin@thenoltefamily.com	$2a$10$wSghFxPxVgfTU9lJaKfchOaq5f41S8J2pztTpDOMZx6k7QrZw4XS2	2025-12-17 20:26:32.962423+00	\N		2025-12-17 20:26:12.566892+00		\N			\N	2025-12-21 17:18:33.557606+00	{"provider": "email", "providers": ["email"]}	{"sub": "cfea3722-f310-465a-93e5-00c1f3f10ff7", "email": "admin@thenoltefamily.com", "email_verified": true, "phone_verified": false}	\N	2025-12-17 20:26:12.53016+00	2025-12-21 17:18:33.574977+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d741a18f-0891-4a22-98db-9f88bceae7dd	authenticated	authenticated	ashton.nolte@gmail.com	$2a$10$gRYFLzdENQOMPQmystIMgOAUSwDwUxirnvJKFz//5aSDBvqspbcda	2026-01-11 00:59:20.634846+00	\N		2026-01-11 00:58:55.143128+00		\N			\N	2026-01-11 00:59:56.847861+00	{"provider": "email", "providers": ["email"]}	{"sub": "d741a18f-0891-4a22-98db-9f88bceae7dd", "email": "ashton.nolte@gmail.com", "email_verified": true, "phone_verified": false}	\N	2026-01-11 00:58:55.097432+00	2026-01-11 00:59:56.873341+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	e4f5029b-49da-44cb-9b5e-74a2bb91d704	authenticated	authenticated	ron.nolte@gmail.com	$2a$10$LYWf6NhjoiGS7WvJOOalf.K25vR64HVb64N9dEUGVUwnxdo9bHoMi	2025-12-17 04:51:00.060788+00	\N		2025-12-17 04:49:25.61813+00		\N			\N	2026-01-15 02:11:32.858697+00	{"provider": "email", "providers": ["email"]}	{"sub": "e4f5029b-49da-44cb-9b5e-74a2bb91d704", "email": "ron.nolte@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-12-17 04:49:25.561609+00	2026-01-15 02:11:32.907849+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	3f5b23d0-8f24-4056-b53a-5f8242952b04	authenticated	authenticated	ron.nolte+admin@gmail.com	$2a$10$/ChslVokH1pt0IRtsNICv.ho.vKSrkfC53qtJ4o3q4CYBqx8DuHg.	2026-01-09 21:49:27.376634+00	\N		2026-01-09 21:48:44.519679+00		\N			\N	2026-01-12 22:19:52.469189+00	{"provider": "email", "providers": ["email"]}	{"sub": "3f5b23d0-8f24-4056-b53a-5f8242952b04", "email": "ron.nolte+admin@gmail.com", "email_verified": true, "phone_verified": false}	\N	2026-01-09 21:48:44.485122+00	2026-01-12 22:19:52.515349+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	3e383c19-12f5-4654-8d2e-516e9ee9e349	authenticated	authenticated	ron.nolte+regular@gmail.com	$2a$10$tEuNuPlNysImHrD8/6XjaeNp1jmmiIwvenHUKVvRrEtA/6IVvd/UO	2026-01-09 22:05:28.093236+00	\N		2026-01-09 22:05:02.854718+00		\N			\N	2026-01-09 22:33:13.042362+00	{"provider": "email", "providers": ["email"]}	{"sub": "3e383c19-12f5-4654-8d2e-516e9ee9e349", "email": "ron.nolte+regular@gmail.com", "email_verified": true, "phone_verified": false}	\N	2026-01-09 22:05:02.80047+00	2026-01-11 02:13:12.841873+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: apiaries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."apiaries" ("id", "user_id", "name", "zip_code", "latitude", "longitude", "notes", "created_at", "updated_at", "deleted_at") FROM stdin;
kWNHykq08wQYOIRk	e4f5029b-49da-44cb-9b5e-74a2bb91d704	Unassigned	00000	\N	\N	\N	2025-12-17 04:13:06.477+00	2025-12-17 04:13:06.477+00	\N
9p9dTHcS3R1YT0C3	e4f5029b-49da-44cb-9b5e-74a2bb91d704	South Valley	87121	35.0512	-106.7269	South Valley, Albuquerque NM	2025-12-17 19:08:38.768+00	2025-12-17 19:53:31.556+00	\N
49964af5-becb-4136-973a-ec3de4dad3ec	e4f5029b-49da-44cb-9b5e-74a2bb91d704	Tijeras 	87059	35.0446	-106.3062	Amy Owens	2025-12-21 05:28:35.684267+00	2025-12-21 05:28:35.684267+00	\N
04251b35-0958-44b3-a3cc-3b94c63eba8f	e4f5029b-49da-44cb-9b5e-74a2bb91d704	Murfreesboro, TN	37127	35.763	-86.3722	Heidi and Matt's house	2025-12-23 13:43:37.910071+00	2025-12-23 13:43:37.910071+00	\N
lhPAMDoy0I6Q6wKR	3f5b23d0-8f24-4056-b53a-5f8242952b04	Admin Apiary	37127	35.763	-86.3722	Murfreesboro TN	2025-12-17 20:33:03.146+00	2025-12-17 20:33:03.467+00	\N
5173459f-5813-46db-9c21-81f2649c50ac	3e383c19-12f5-4654-8d2e-516e9ee9e349	Regular Apiary	77868	30.3576	-96.0594	Test at Beeweaver	2026-01-09 22:07:15.36623+00	2026-01-09 22:07:15.36623+00	\N
d08c5c31-81e6-430d-ad69-6bed091a9380	ee0710e4-305b-4fad-8e2c-60a2de9b583d	Demo Apiary	00000	\N	\N	This is a demo apiary for testing. Feel free to explore!	2026-01-11 00:39:52.382853+00	2026-01-11 00:39:52.382853+00	\N
\.


--
-- Data for Name: apiary_shares; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."apiary_shares" ("id", "apiary_id", "owner_id", "viewer_id", "created_at") FROM stdin;
69ab3e6e-e64f-4560-bee1-527573061a87	5173459f-5813-46db-9c21-81f2649c50ac	3e383c19-12f5-4654-8d2e-516e9ee9e349	e4f5029b-49da-44cb-9b5e-74a2bb91d704	2026-01-09 22:36:01.571846+00
\.


--
-- Data for Name: hive_snapshots; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."hive_snapshots" ("id", "hive_id", "timestamp", "bars", "notes", "weather", "created_at", "updated_at", "deleted_at", "inactive_bar_count", "active_bar_count", "empty_bar_count", "brood_bar_count", "resource_bar_count", "follower_board_position") FROM stdin;
KYtYCG4MR6e8cx9m	vaIyIukE6sXbhgOF	2025-12-17 20:34:54.257+00	[{"position":1,"status":"inactive"},{"position":2,"status":"inactive"},{"position":3,"status":"active"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"brood"},{"position":7,"status":"brood"},{"position":8,"status":"brood"},{"position":9,"status":"resource"},{"position":10,"status":"resource"},{"position":11,"status":"resource"},{"position":12,"status":"resource"},{"position":13,"status":"empty"},{"position":14,"status":"empty"},{"position":15,"status":"empty"},{"position":16,"status":"follower_board"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	\N	\N	2025-12-17 20:34:54.257+00	2025-12-17 20:34:54.257+00	\N	17	1	3	5	4	\N
9be20612-a93d-499f-9d76-1288d0d7d94d	eUJ9tNwAvRrCe1tF	2025-12-21 02:17:02.436+00	[{"position":1,"status":"empty"},{"position":2,"status":"empty"},{"position":3,"status":"brood"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"brood"},{"position":7,"status":"brood"},{"position":8,"status":"resource"},{"position":9,"status":"resource"},{"position":10,"status":"resource"},{"position":11,"status":"resource"},{"position":12,"status":"resource"},{"position":13,"status":"empty"},{"position":14,"status":"empty"},{"position":15,"status":"follower_board"},{"position":16,"status":"inactive"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	\N	\N	2025-12-21 02:17:02.52926+00	2025-12-21 02:17:02.52926+00	\N	15	0	4	5	5	15
842c30ce-8c0a-487c-9458-49a2f185c8a2	eUJ9tNwAvRrCe1tF	2025-12-21 03:45:04.55+00	[{"position":1,"status":"empty"},{"position":2,"status":"empty"},{"position":3,"status":"brood"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"brood"},{"position":7,"status":"brood"},{"position":8,"status":"resource"},{"position":9,"status":"resource"},{"position":10,"status":"resource"},{"position":11,"status":"resource"},{"position":12,"status":"empty"},{"position":13,"status":"empty"},{"position":14,"status":"follower_board"},{"position":15,"status":"inactive"},{"position":16,"status":"inactive"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	\N	\N	2025-12-21 03:45:04.698489+00	2025-12-21 03:45:04.698489+00	\N	16	0	4	5	4	14
bf9ce1a1-1bb0-43c3-adf1-8d25b3e8e5c0	b7246a19-5570-48ff-93d0-f090e64f96a2	2025-12-21 19:03:39.214+00	[{"position":1,"status":"inactive"},{"position":2,"status":"inactive"},{"position":3,"status":"active"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"brood"},{"position":7,"status":"brood"},{"position":8,"status":"brood"},{"position":9,"status":"resource"},{"position":10,"status":"resource"},{"position":11,"status":"resource"},{"position":12,"status":"resource"},{"position":13,"status":"empty"},{"position":14,"status":"empty"},{"position":15,"status":"empty"}]	\N	\N	2025-12-21 19:03:39.163463+00	2025-12-21 19:03:39.163463+00	\N	2	1	3	5	4	\N
6ed1409f-f8ee-4a26-84a5-c2623f4c6bdc	eUJ9tNwAvRrCe1tF	2025-12-23 01:36:42.425+00	[{"position":1,"status":"empty"},{"position":2,"status":"empty"},{"position":3,"status":"brood"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"brood"},{"position":7,"status":"brood"},{"position":8,"status":"resource"},{"position":9,"status":"resource"},{"position":10,"status":"resource"},{"position":11,"status":"resource"},{"position":12,"status":"resource"},{"position":13,"status":"resource"},{"position":14,"status":"empty"},{"position":15,"status":"empty"},{"position":16,"status":"follower_board"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	\N	\N	2025-12-23 01:36:39.686984+00	2025-12-23 01:36:39.686984+00	\N	14	0	4	5	6	16
ac1f6b31-9e1b-4300-86e5-d1b6889fb260	137b869a-d4b5-43b2-8d66-defb2caca8f3	2025-12-23 13:45:53.537+00	[{"position":1,"status":"empty"},{"position":2,"status":"empty"},{"position":3,"status":"empty"},{"position":4,"status":"empty"},{"position":5,"status":"empty"},{"position":6,"status":"empty"},{"position":7,"status":"empty"},{"position":8,"status":"empty"},{"position":9,"status":"follower_board"},{"position":10,"status":"inactive"},{"position":11,"status":"inactive"},{"position":12,"status":"inactive"},{"position":13,"status":"inactive"},{"position":14,"status":"inactive"},{"position":15,"status":"inactive"},{"position":16,"status":"inactive"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	\N	\N	2025-12-23 13:45:53.566915+00	2025-12-23 13:45:53.566915+00	\N	21	0	8	0	0	9
3943f163-d708-43d2-b8ca-79a1f5211b12	eUJ9tNwAvRrCe1tF	2025-12-23 18:11:24.804+00	[{"position":1,"status":"empty"},{"position":2,"status":"empty"},{"position":3,"status":"brood"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"brood"},{"position":7,"status":"brood"},{"position":8,"status":"resource"},{"position":9,"status":"resource"},{"position":10,"status":"resource"},{"position":11,"status":"resource"},{"position":12,"status":"resource"},{"position":13,"status":"resource"},{"position":14,"status":"empty"},{"position":15,"status":"empty"},{"position":16,"status":"follower_board"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	\N	\N	2025-12-23 18:11:25.067546+00	2025-12-23 18:11:25.067546+00	\N	14	0	4	5	6	16
2a067b32-0324-4e50-9eca-e3d2f4ae5c9a	0ca6ccf5-fe02-45b8-b2fe-b5916f205fd1	2026-01-09 22:07:48+00	[{"position":1,"status":"empty"},{"position":2,"status":"empty"},{"position":3,"status":"brood"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"resource"},{"position":7,"status":"resource"},{"position":8,"status":"empty"},{"position":9,"status":"empty"},{"position":10,"status":"follower_board"},{"position":11,"status":"inactive"},{"position":12,"status":"inactive"},{"position":13,"status":"inactive"},{"position":14,"status":"inactive"},{"position":15,"status":"inactive"},{"position":16,"status":"inactive"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	\N	\N	2026-01-09 22:07:41.187644+00	2026-01-09 22:07:41.187644+00	\N	20	0	4	3	2	\N
\.


--
-- Data for Name: hives; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."hives" ("id", "apiary_id", "name", "type", "bar_count", "bars", "is_active", "created_at", "updated_at", "deleted_at", "last_inspection_date", "notes") FROM stdin;
vaIyIukE6sXbhgOF	lhPAMDoy0I6Q6wKR	TBH-HM	\N	30	[{"position":1,"status":"inactive"},{"position":2,"status":"inactive"},{"position":3,"status":"active"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"brood"},{"position":7,"status":"brood"},{"position":8,"status":"brood"},{"position":9,"status":"resource"},{"position":10,"status":"resource"},{"position":11,"status":"resource"},{"position":12,"status":"resource"},{"position":13,"status":"empty"},{"position":14,"status":"empty"},{"position":15,"status":"empty"},{"position":16,"status":"follower_board"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	t	2025-12-17 20:34:54.254+00	2025-12-17 20:34:54.254+00	\N	\N	\N
b7246a19-5570-48ff-93d0-f090e64f96a2	49964af5-becb-4136-973a-ec3de4dad3ec	test 1	\N	15	[{"position":1,"status":"empty"},{"position":2,"status":"inactive"},{"position":3,"status":"active"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"brood"},{"position":7,"status":"brood"},{"position":8,"status":"brood"},{"position":9,"status":"resource"},{"position":10,"status":"resource"},{"position":11,"status":"resource"},{"position":12,"status":"resource"},{"position":13,"status":"empty"},{"position":14,"status":"empty"},{"position":15,"status":"empty"}]	t	2025-12-21 19:03:38.851907+00	2025-12-21 19:03:38.851907+00	\N	\N	\N
eUJ9tNwAvRrCe1tF	9p9dTHcS3R1YT0C3	TBH-1	\N	30	[{"position":1,"status":"empty"},{"position":2,"status":"empty"},{"position":3,"status":"brood"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"brood"},{"position":7,"status":"resource"},{"position":8,"status":"resource"},{"position":9,"status":"resource"},{"position":10,"status":"resource"},{"position":11,"status":"resource"},{"position":12,"status":"resource"},{"position":13,"status":"empty"},{"position":14,"status":"empty"},{"position":15,"status":"empty"},{"position":16,"status":"follower_board"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	t	2025-12-17 19:09:20.213+00	2025-12-17 19:10:21.819+00	\N	\N	\N
137b869a-d4b5-43b2-8d66-defb2caca8f3	04251b35-0958-44b3-a3cc-3b94c63eba8f	TBH-1	\N	30	[{"position":1,"status":"empty"},{"position":2,"status":"empty"},{"position":3,"status":"empty"},{"position":4,"status":"empty"},{"position":5,"status":"empty"},{"position":6,"status":"empty"},{"position":7,"status":"empty"},{"position":8,"status":"empty"},{"position":9,"status":"follower_board"},{"position":10,"status":"inactive"},{"position":11,"status":"inactive"},{"position":12,"status":"inactive"},{"position":13,"status":"inactive"},{"position":14,"status":"inactive"},{"position":15,"status":"inactive"},{"position":16,"status":"inactive"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	t	2025-12-23 13:44:20.55848+00	2025-12-23 13:44:20.55848+00	\N	\N	\N
0ca6ccf5-fe02-45b8-b2fe-b5916f205fd1	5173459f-5813-46db-9c21-81f2649c50ac	Regular TBH-1	\N	30	[{"position":1,"status":"empty"},{"position":2,"status":"empty"},{"position":3,"status":"brood"},{"position":4,"status":"brood"},{"position":5,"status":"brood"},{"position":6,"status":"resource"},{"position":7,"status":"resource"},{"position":8,"status":"empty"},{"position":9,"status":"empty"},{"position":10,"status":"follower_board"},{"position":11,"status":"inactive"},{"position":12,"status":"inactive"},{"position":13,"status":"inactive"},{"position":14,"status":"inactive"},{"position":15,"status":"inactive"},{"position":16,"status":"inactive"},{"position":17,"status":"inactive"},{"position":18,"status":"inactive"},{"position":19,"status":"inactive"},{"position":20,"status":"inactive"},{"position":21,"status":"inactive"},{"position":22,"status":"inactive"},{"position":23,"status":"inactive"},{"position":24,"status":"inactive"},{"position":25,"status":"inactive"},{"position":26,"status":"inactive"},{"position":27,"status":"inactive"},{"position":28,"status":"inactive"},{"position":29,"status":"inactive"},{"position":30,"status":"inactive"}]	t	2026-01-09 22:07:41.030765+00	2026-01-09 22:07:41.030765+00	\N	\N	\N
cd052749-a4fe-4592-8772-6f040bd06de7	d08c5c31-81e6-430d-ad69-6bed091a9380	Demo Hive #1	\N	24	\N	t	2026-01-11 00:39:52.481636+00	2026-01-11 00:39:52.481636+00	\N	\N	Example hive for demonstration purposes
\.


--
-- Data for Name: inspections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."inspections" ("id", "hive_id", "user_id", "timestamp", "queen_status", "brood_pattern", "population_strength", "temperament", "honey_stores", "pollen_stores", "observations", "weather", "created_at", "updated_at", "deleted_at", "snapshot_id") FROM stdin;
RyoZFc6Zaac38Sff	eUJ9tNwAvRrCe1tF	\N	2025-12-17 00:00:00+00	seen	excellent	\N	calm	abundant	abundant	Inspection +1	\N	2025-12-17 19:11:03.065+00	2025-12-17 19:11:03.065+00	\N	\N
7e235bbd-5bf8-4452-b9c5-53b0df1ddd4b	eUJ9tNwAvRrCe1tF	\N	2025-12-19 00:00:00+00	capped_brood	good	\N	aggressive	abundant	adequate		\N	2025-12-19 18:20:45.921505+00	2025-12-19 18:20:45.921505+00	\N	\N
3ffa9699-c5e1-4990-a9dd-869a574351f9	eUJ9tNwAvRrCe1tF	\N	2025-12-19 00:00:00+00	seen	poor	\N	calm	none	abundant		\N	2025-12-19 18:20:56.9062+00	2025-12-19 18:20:56.9062+00	\N	\N
654981dc-33ef-4fbc-94f7-5fcfc4a570a3	eUJ9tNwAvRrCe1tF	\N	2025-12-10 00:00:00+00	seen	good	\N	moderate	adequate	adequate		\N	2025-12-21 17:21:57.046366+00	2025-12-21 17:21:57.046366+00	\N	\N
b1b875f2-5a08-4bf6-97c8-a0a2570d5faf	b7246a19-5570-48ff-93d0-f090e64f96a2	\N	2025-12-10 19:00:00+00	no_queen	good	\N	moderate	adequate	adequate		\N	2025-12-21 19:05:22.79489+00	2025-12-21 19:05:22.79489+00	\N	\N
pIxwOvVsrQPdHrYV	eUJ9tNwAvRrCe1tF	\N	2025-12-10 19:00:00+00	no_queen	poor	\N	aggressive	low	low	Inspection #2	\N	2025-12-17 19:11:20.681+00	2025-12-17 19:11:20.681+00	\N	\N
f48362f8-ae6a-4198-8397-6c9faa5b0be6	137b869a-d4b5-43b2-8d66-defb2caca8f3	\N	2025-12-23 19:00:00+00	seen	poor	\N	calm	low	low	New package installed	\N	2025-12-23 13:47:51.943934+00	2025-12-23 13:47:51.943934+00	\N	\N
\.


--
-- Data for Name: interventions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."interventions" ("id", "hive_id", "type", "timestamp", "description", "notes", "weather", "created_at", "updated_at", "deleted_at", "inspection_id") FROM stdin;
3VHMMmf0jtfogEfc	eUJ9tNwAvRrCe1tF	cross_comb_fix	2025-12-17 00:00:00+00	Aligned comb on bar 8	\N	\N	2025-12-17 19:12:05.777+00	2025-12-17 19:12:05.777+00	\N	\N
Utf4kd0Hlm4aXNHb	eUJ9tNwAvRrCe1tF	feeding	2025-12-17 00:00:00+00	New swarm	\N	\N	2025-12-17 19:11:41.324+00	2025-12-17 19:11:41.324+00	\N	\N
1b03fd41-d13e-4954-aab5-19b7423246cb	eUJ9tNwAvRrCe1tF	other	2025-12-02 00:00:00+00	Took frame of honey	\N	\N	2025-12-21 03:45:56.300391+00	2025-12-21 03:45:56.300391+00	\N	\N
d9be0792-3460-4bc0-a5a9-02d6700b8ae1	eUJ9tNwAvRrCe1tF	treatment	2025-12-10 00:00:00+00	Oxalic Acid	\N	\N	2025-12-21 02:15:03.935793+00	2025-12-21 02:15:03.935793+00	\N	\N
2c8eb715-0481-4e2b-82e2-dd091f1dee13	b7246a19-5570-48ff-93d0-f090e64f96a2	feeding	2025-12-10 19:00:00+00		\N	\N	2025-12-21 19:05:46.889017+00	2025-12-21 19:05:46.889017+00	\N	\N
9a03bcb9-0021-4254-85c9-4c236babcb00	137b869a-d4b5-43b2-8d66-defb2caca8f3	other	2025-04-23 18:00:00+00	Installed package	\N	\N	2025-12-23 13:46:54.479965+00	2025-12-23 13:46:54.479965+00	\N	\N
7fd391c4-1b49-4a04-8be2-0640d5b77d42	137b869a-d4b5-43b2-8d66-defb2caca8f3	feeding	2025-04-23 18:00:00+00	New package	\N	\N	2025-12-23 13:48:58.15443+00	2025-12-23 13:48:58.15443+00	\N	\N
217b551a-12b7-4041-8972-5fd96d022490	eUJ9tNwAvRrCe1tF	feeding	2025-12-21 19:00:00+00	Swarm install	\N	\N	2025-12-21 17:22:29.689803+00	2025-12-21 17:22:29.689803+00	\N	\N
09ff5e69-316a-42e4-a44b-2a58c5398afd	eUJ9tNwAvRrCe1tF	other	2025-12-21 19:00:00+00	Split hive	\N	\N	2025-12-21 17:23:04.808368+00	2025-12-21 17:23:04.808368+00	\N	\N
57aacba9-a4e7-45a9-b49e-ce384b03cc80	eUJ9tNwAvRrCe1tF	cross_comb_fix	2025-12-19 19:00:00+00	Bees doing their own thing	\N	\N	2025-12-21 02:17:49.810405+00	2025-12-21 02:17:49.810405+00	\N	\N
\.


--
-- Data for Name: mentor_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."mentor_profiles" ("user_id", "display_name", "location", "bio", "is_accepting_students", "created_at", "updated_at") FROM stdin;
e4f5029b-49da-44cb-9b5e-74a2bb91d704	Ron Nolte	Tijeras, NM	Experienced Beekeeper	t	2026-01-09 22:21:20.131849+00	2026-01-09 22:32:40.063229+00
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."tasks" ("id", "assigned_user_id", "apiary_id", "hive_id", "scope", "title", "description", "due_date", "priority", "status", "is_synced", "created_at", "updated_at", "deleted_at", "completed_at") FROM stdin;
KAWfgoJdAKi40NwR	e4f5029b-49da-44cb-9b5e-74a2bb91d704		\N	user	Order Sugar	Need 10lbs for winter feeding	\N	medium	pending	f	2025-12-17 04:13:06.478+00	2025-12-17 04:13:06.478+00	\N	\N
3d592f59-c84a-47d5-ab5e-bb157f02ecd7	e4f5029b-49da-44cb-9b5e-74a2bb91d704	\N	\N	user	Test 72	Getting close	2025-12-19 00:00:00+00	medium	pending	f	2025-12-19 18:12:39.98016+00	2025-12-19 18:12:39.98016+00	\N	\N
284c48e9-d5a0-48b7-9a0a-b54acf68d459	e4f5029b-49da-44cb-9b5e-74a2bb91d704	\N	137b869a-d4b5-43b2-8d66-defb2caca8f3	hive	Check queen acceptance		2025-04-26 18:00:00+00	high	pending	f	2025-12-23 13:49:45.947143+00	2025-12-23 13:49:45.947143+00	\N	\N
PLBOp0TQzl1MkUAt	e4f5029b-49da-44cb-9b5e-74a2bb91d704		eUJ9tNwAvRrCe1tF	hive	Remember to check queen cage	New package queen release	2025-12-26 19:00:00+00	high	pending	f	2025-12-17 19:13:13.848+00	2025-12-17 19:13:13.848+00	\N	\N
96c01072-14a2-4830-a5f3-45d824c47d6e	e4f5029b-49da-44cb-9b5e-74a2bb91d704	\N	\N	user	Test 1		2025-12-30 19:00:00+00	medium	pending	f	2025-12-30 21:05:22.374373+00	2025-12-30 21:05:22.374373+00	\N	\N
73f3d80b-43e6-4486-af9e-6163d4802e71	e4f5029b-49da-44cb-9b5e-74a2bb91d704	9p9dTHcS3R1YT0C3	eUJ9tNwAvRrCe1tF	hive	Inspection scheduled for 1/15	Check weight of hives and fondant levels	2026-01-15 19:00:00+00	medium	pending	f	2025-12-31 00:18:31.086757+00	2025-12-31 00:18:31.086757+00	\N	\N
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."user_roles" ("id", "user_id", "role", "created_at") FROM stdin;
a6a0997e-024c-4a13-bdfb-12cc3496d53a	3f5b23d0-8f24-4056-b53a-5f8242952b04	admin	2026-01-09 22:17:34.030401+00
132f2168-6240-433f-919f-0a92bc388fa2	e4f5029b-49da-44cb-9b5e-74a2bb91d704	mentor	2026-01-09 22:21:20.190377+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users" ("id", "email", "display_name", "created_at", "updated_at", "is_mentor", "mentor_location", "mentor_bio", "role") FROM stdin;
cfea3722-f310-465a-93e5-00c1f3f10ff7	admin@thenoltefamily.com	\N	2026-01-09 21:40:42.689752+00	2026-01-09 21:40:42.689752+00	f	\N	\N	user
ee0710e4-305b-4fad-8e2c-60a2de9b583d	guest@beektools.com	\N	2026-01-09 21:40:42.689752+00	2026-01-09 21:40:42.689752+00	f	\N	\N	user
e4f5029b-49da-44cb-9b5e-74a2bb91d704	ron.nolte@gmail.com	\N	2026-01-09 21:40:42.689752+00	2026-01-09 21:40:42.689752+00	f	\N	\N	user
3e383c19-12f5-4654-8d2e-516e9ee9e349	ron.nolte+regular@gmail.com	\N	2026-01-09 22:05:02.799687+00	2026-01-09 22:05:02.799687+00	f	\N	\N	user
3f5b23d0-8f24-4056-b53a-5f8242952b04	ron.nolte+admin@gmail.com	\N	2026-01-09 21:48:44.484752+00	2026-01-09 21:48:44.484752+00	f	\N	\N	admin
d741a18f-0891-4a22-98db-9f88bceae7dd	ashton.nolte@gmail.com	\N	2026-01-11 00:58:55.097065+00	2026-01-11 00:58:55.097065+00	f	\N	\N	user
\.


--
-- Data for Name: weather_forecasts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."weather_forecasts" ("id", "apiary_id", "forecast_date", "data", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."schema_migrations" ("version", "inserted_at") FROM stdin;
20211116024918	2025-12-16 23:18:46
20211116045059	2025-12-16 23:18:49
20211116050929	2025-12-16 23:18:52
20211116051442	2025-12-16 23:18:54
20211116212300	2025-12-16 23:18:56
20211116213355	2025-12-16 23:18:59
20211116213934	2025-12-16 23:19:01
20211116214523	2025-12-16 23:19:04
20211122062447	2025-12-16 23:19:06
20211124070109	2025-12-16 23:19:08
20211202204204	2025-12-16 23:19:10
20211202204605	2025-12-16 23:19:12
20211210212804	2025-12-16 23:19:19
20211228014915	2025-12-16 23:19:21
20220107221237	2025-12-16 23:19:23
20220228202821	2025-12-16 23:19:26
20220312004840	2025-12-16 23:19:28
20220603231003	2025-12-16 23:19:31
20220603232444	2025-12-16 23:19:33
20220615214548	2025-12-16 23:19:36
20220712093339	2025-12-16 23:19:38
20220908172859	2025-12-16 23:19:40
20220916233421	2025-12-16 23:19:42
20230119133233	2025-12-16 23:19:44
20230128025114	2025-12-16 23:19:47
20230128025212	2025-12-16 23:19:49
20230227211149	2025-12-16 23:19:51
20230228184745	2025-12-16 23:19:54
20230308225145	2025-12-16 23:19:56
20230328144023	2025-12-16 23:19:58
20231018144023	2025-12-16 23:20:00
20231204144023	2025-12-16 23:20:04
20231204144024	2025-12-16 23:20:06
20231204144025	2025-12-16 23:20:08
20240108234812	2025-12-16 23:20:10
20240109165339	2025-12-16 23:20:12
20240227174441	2025-12-16 23:20:16
20240311171622	2025-12-16 23:20:19
20240321100241	2025-12-16 23:20:24
20240401105812	2025-12-16 23:20:30
20240418121054	2025-12-16 23:20:33
20240523004032	2025-12-16 23:20:40
20240618124746	2025-12-16 23:20:42
20240801235015	2025-12-16 23:20:44
20240805133720	2025-12-16 23:20:47
20240827160934	2025-12-16 23:20:49
20240919163303	2025-12-16 23:20:52
20240919163305	2025-12-16 23:20:54
20241019105805	2025-12-16 23:20:56
20241030150047	2025-12-16 23:21:04
20241108114728	2025-12-16 23:21:07
20241121104152	2025-12-16 23:21:09
20241130184212	2025-12-16 23:21:12
20241220035512	2025-12-16 23:21:14
20241220123912	2025-12-16 23:21:16
20241224161212	2025-12-16 23:21:18
20250107150512	2025-12-16 23:21:20
20250110162412	2025-12-16 23:21:22
20250123174212	2025-12-16 23:21:24
20250128220012	2025-12-16 23:21:26
20250506224012	2025-12-16 23:21:28
20250523164012	2025-12-16 23:21:30
20250714121412	2025-12-16 23:21:32
20250905041441	2025-12-16 23:21:34
20251103001201	2025-12-16 23:21:37
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."subscription" ("id", "subscription_id", "entity", "filters", "claims", "created_at") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."migrations" ("id", "name", "hash", "executed_at") FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-12-16 23:18:43.217212
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-12-16 23:18:43.233166
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-12-16 23:18:43.237891
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-12-16 23:18:43.282162
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-12-16 23:18:43.346013
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-12-16 23:18:43.34884
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-12-16 23:18:43.352177
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-12-16 23:18:43.355171
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-12-16 23:18:43.357756
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-12-16 23:18:43.361648
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-12-16 23:18:43.364973
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-12-16 23:18:43.368821
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-12-16 23:18:43.372088
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-12-16 23:18:43.374764
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-12-16 23:18:43.377765
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-12-16 23:18:43.399968
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-12-16 23:18:43.404077
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-12-16 23:18:43.406969
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-12-16 23:18:43.40985
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-12-16 23:18:43.414379
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-12-16 23:18:43.417322
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-12-16 23:18:43.422636
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-12-16 23:18:43.43723
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-12-16 23:18:43.448202
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-12-16 23:18:43.452256
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-12-16 23:18:43.457554
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-12-16 23:18:43.460597
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-12-16 23:18:43.474344
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-12-16 23:18:43.740931
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-12-16 23:18:43.747127
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-12-16 23:18:43.755857
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-12-16 23:18:43.797644
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-12-16 23:18:43.803593
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-12-16 23:18:43.80982
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-12-16 23:18:43.811335
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-12-16 23:18:43.815791
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-12-16 23:18:43.818395
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-12-16 23:18:43.824327
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-12-16 23:18:43.827503
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-12-16 23:18:43.842286
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-12-16 23:18:43.847075
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-12-16 23:18:43.854444
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-12-16 23:18:43.858189
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-12-16 23:18:43.862305
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2025-12-16 23:18:43.865294
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2025-12-16 23:18:43.868436
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2025-12-16 23:18:43.878031
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2025-12-16 23:18:43.880732
48	iceberg-catalog-ids	2666dff93346e5d04e0a878416be1d5fec345d6f	2025-12-16 23:18:43.883155
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2025-12-20 17:21:24.242883
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 280, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('"realtime"."subscription_id_seq"', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "amr_id_pk" PRIMARY KEY ("id");


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."audit_log_entries"
    ADD CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id");


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."flow_state"
    ADD CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id");


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_pkey" PRIMARY KEY ("id");


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider");


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method");


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at");


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_code_key" UNIQUE ("authorization_code");


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_id_key" UNIQUE ("authorization_id");


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_client_states"
    ADD CONSTRAINT "oauth_client_states_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_clients"
    ADD CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_pkey" PRIMARY KEY ("id");


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_client_unique" UNIQUE ("user_id", "client_id");


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token");


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id");


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id");


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id");


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_providers"
    ADD CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id");


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- Name: apiaries apiaries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."apiaries"
    ADD CONSTRAINT "apiaries_pkey" PRIMARY KEY ("id");


--
-- Name: apiary_shares apiary_shares_apiary_id_viewer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."apiary_shares"
    ADD CONSTRAINT "apiary_shares_apiary_id_viewer_id_key" UNIQUE ("apiary_id", "viewer_id");


--
-- Name: apiary_shares apiary_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."apiary_shares"
    ADD CONSTRAINT "apiary_shares_pkey" PRIMARY KEY ("id");


--
-- Name: hive_snapshots hive_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."hive_snapshots"
    ADD CONSTRAINT "hive_snapshots_pkey" PRIMARY KEY ("id");


--
-- Name: hives hives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."hives"
    ADD CONSTRAINT "hives_pkey" PRIMARY KEY ("id");


--
-- Name: inspections inspections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."inspections"
    ADD CONSTRAINT "inspections_pkey" PRIMARY KEY ("id");


--
-- Name: interventions interventions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."interventions"
    ADD CONSTRAINT "interventions_pkey" PRIMARY KEY ("id");


--
-- Name: mentor_profiles mentor_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."mentor_profiles"
    ADD CONSTRAINT "mentor_profiles_pkey" PRIMARY KEY ("user_id");


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_role_key" UNIQUE ("user_id", "role");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- Name: weather_forecasts weather_forecasts_apiary_id_forecast_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."weather_forecasts"
    ADD CONSTRAINT "weather_forecasts_apiary_id_forecast_date_key" UNIQUE ("apiary_id", "forecast_date");


--
-- Name: weather_forecasts weather_forecasts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."weather_forecasts"
    ADD CONSTRAINT "weather_forecasts_pkey" PRIMARY KEY ("id");


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."subscription"
    ADD CONSTRAINT "pk_subscription" PRIMARY KEY ("id");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets_analytics"
    ADD CONSTRAINT "buckets_analytics_pkey" PRIMARY KEY ("id");


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets"
    ADD CONSTRAINT "buckets_pkey" PRIMARY KEY ("id");


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets_vectors"
    ADD CONSTRAINT "buckets_vectors_pkey" PRIMARY KEY ("id");


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_name_key" UNIQUE ("name");


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_pkey" PRIMARY KEY ("id");


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_pkey" PRIMARY KEY ("bucket_id", "level", "name");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_pkey" PRIMARY KEY ("id");


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_pkey" PRIMARY KEY ("id");


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_pkey" PRIMARY KEY ("id");


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING "btree" ("instance_id");


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING "btree" ("confirmation_token") WHERE (("confirmation_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING "btree" ("email_change_token_current") WHERE (("email_change_token_current")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING "btree" ("email_change_token_new") WHERE (("email_change_token_new")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING "btree" ("user_id", "created_at");


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING "btree" ("created_at" DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_email_idx" ON "auth"."identities" USING "btree" ("email" "text_pattern_ops");


--
-- Name: INDEX "identities_email_idx"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."identities_email_idx" IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING "btree" ("user_id");


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING "btree" ("auth_code");


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_oauth_client_states_created_at" ON "auth"."oauth_client_states" USING "btree" ("created_at");


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING "btree" ("user_id", "authentication_method");


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING "btree" ("created_at" DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING "btree" ("friendly_name", "user_id") WHERE (TRIM(BOTH FROM "friendly_name") <> ''::"text");


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING "btree" ("user_id");


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_auth_pending_exp_idx" ON "auth"."oauth_authorizations" USING "btree" ("expires_at") WHERE ("status" = 'pending'::"auth"."oauth_authorization_status");


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_clients_deleted_at_idx" ON "auth"."oauth_clients" USING "btree" ("deleted_at");


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_active_client_idx" ON "auth"."oauth_consents" USING "btree" ("client_id") WHERE ("revoked_at" IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_active_user_client_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "client_id") WHERE ("revoked_at" IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_user_order_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "granted_at" DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("relates_to");


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("token_hash");


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING "btree" ("user_id", "token_type");


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING "btree" ("reauthentication_token") WHERE (("reauthentication_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING "btree" ("recovery_token") WHERE (("recovery_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id");


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id", "user_id");


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING "btree" ("parent");


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING "btree" ("session_id", "revoked");


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING "btree" ("updated_at" DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING "btree" ("sso_provider_id");


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING "btree" ("created_at" DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING "btree" ("for_email");


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING "btree" ("sso_provider_id");


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING "btree" ("not_after" DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_oauth_client_id_idx" ON "auth"."sessions" USING "btree" ("oauth_client_id");


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING "btree" ("user_id");


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING "btree" ("lower"("domain"));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING "btree" ("sso_provider_id");


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING "btree" ("lower"("resource_id"));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_providers_resource_id_pattern_idx" ON "auth"."sso_providers" USING "btree" ("resource_id" "text_pattern_ops");


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING "btree" ("user_id", "phone");


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING "btree" ("user_id", "created_at");


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING "btree" ("email") WHERE ("is_sso_user" = false);


--
-- Name: INDEX "users_email_partial_key"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."users_email_partial_key" IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "lower"(("email")::"text"));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING "btree" ("is_anonymous");


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "ix_realtime_subscription_entity" ON "realtime"."subscription" USING "btree" ("entity");


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_inserted_at_topic_index" ON ONLY "realtime"."messages" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX "subscription_subscription_id_entity_filters_key" ON "realtime"."subscription" USING "btree" ("subscription_id", "entity", "filters");


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING "btree" ("name");


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING "btree" ("bucket_id", "name");


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "buckets_analytics_unique_name_idx" ON "storage"."buckets_analytics" USING "btree" ("name") WHERE ("deleted_at" IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING "btree" ("bucket_id", "key", "created_at");


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "idx_name_bucket_level_unique" ON "storage"."objects" USING "btree" ("name" COLLATE "C", "bucket_id", "level");


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING "btree" ("bucket_id", "name" COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_lower_name" ON "storage"."objects" USING "btree" (("path_tokens"["level"]), "lower"("name") "text_pattern_ops", "bucket_id", "level");


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_prefixes_lower_name" ON "storage"."prefixes" USING "btree" ("bucket_id", "level", (("string_to_array"("name", '/'::"text"))["level"]), "lower"("name") "text_pattern_ops");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "name_prefix_search" ON "storage"."objects" USING "btree" ("name" "text_pattern_ops");


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "objects_bucket_id_level_idx" ON "storage"."objects" USING "btree" ("bucket_id", "level", "name" COLLATE "C");


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "vector_indexes_name_bucket_id_idx" ON "storage"."vector_indexes" USING "btree" ("name", "bucket_id");


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();


--
-- Name: mentor_profiles update_mentor_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "update_mentor_profiles_updated_at" BEFORE UPDATE ON "public"."mentor_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER "tr_check_filters" BEFORE INSERT OR UPDATE ON "realtime"."subscription" FOR EACH ROW EXECUTE FUNCTION "realtime"."subscription_check_filters"();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "enforce_bucket_name_length_trigger" BEFORE INSERT OR UPDATE OF "name" ON "storage"."buckets" FOR EACH ROW EXECUTE FUNCTION "storage"."enforce_bucket_name_length"();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_delete_delete_prefix" AFTER DELETE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_insert_create_prefix" BEFORE INSERT ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."objects_insert_prefix_trigger"();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_update_create_prefix" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW WHEN ((("new"."name" <> "old"."name") OR ("new"."bucket_id" <> "old"."bucket_id"))) EXECUTE FUNCTION "storage"."objects_update_prefix_trigger"();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "prefixes_create_hierarchy" BEFORE INSERT ON "storage"."prefixes" FOR EACH ROW WHEN (("pg_trigger_depth"() < 1)) EXECUTE FUNCTION "storage"."prefixes_insert_trigger"();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "prefixes_delete_hierarchy" AFTER DELETE ON "storage"."prefixes" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: apiaries apiaries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."apiaries"
    ADD CONSTRAINT "apiaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");


--
-- Name: apiary_shares apiary_shares_apiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."apiary_shares"
    ADD CONSTRAINT "apiary_shares_apiary_id_fkey" FOREIGN KEY ("apiary_id") REFERENCES "public"."apiaries"("id") ON DELETE CASCADE;


--
-- Name: apiary_shares apiary_shares_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."apiary_shares"
    ADD CONSTRAINT "apiary_shares_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


--
-- Name: apiary_shares apiary_shares_viewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."apiary_shares"
    ADD CONSTRAINT "apiary_shares_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


--
-- Name: hive_snapshots hive_snapshots_hive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."hive_snapshots"
    ADD CONSTRAINT "hive_snapshots_hive_id_fkey" FOREIGN KEY ("hive_id") REFERENCES "public"."hives"("id");


--
-- Name: hives hives_apiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."hives"
    ADD CONSTRAINT "hives_apiary_id_fkey" FOREIGN KEY ("apiary_id") REFERENCES "public"."apiaries"("id");


--
-- Name: inspections inspections_hive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."inspections"
    ADD CONSTRAINT "inspections_hive_id_fkey" FOREIGN KEY ("hive_id") REFERENCES "public"."hives"("id");


--
-- Name: inspections inspections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."inspections"
    ADD CONSTRAINT "inspections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");


--
-- Name: interventions interventions_hive_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."interventions"
    ADD CONSTRAINT "interventions_hive_id_fkey" FOREIGN KEY ("hive_id") REFERENCES "public"."hives"("id");


--
-- Name: mentor_profiles mentor_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."mentor_profiles"
    ADD CONSTRAINT "mentor_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


--
-- Name: tasks tasks_assigned_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_assigned_user_id_fkey" FOREIGN KEY ("assigned_user_id") REFERENCES "auth"."users"("id");


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


--
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: weather_forecasts weather_forecasts_apiary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."weather_forecasts"
    ADD CONSTRAINT "weather_forecasts_apiary_id_fkey" FOREIGN KEY ("apiary_id") REFERENCES "public"."apiaries"("id") ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets_vectors"("id");


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;

--
-- Name: hives Access hives via apiary ownership or share; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Access hives via apiary ownership or share" ON "public"."hives" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."apiaries" "a"
     LEFT JOIN "public"."apiary_shares" "s" ON ((("s"."apiary_id" = "a"."id") AND ("s"."viewer_id" = "auth"."uid"()))))
  WHERE (("a"."id" = "hives"."apiary_id") AND (("a"."user_id" = "auth"."uid"()) OR ("s"."id" IS NOT NULL))))));


--
-- Name: tasks Access tasks via apiary ownership, share, or assignment; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Access tasks via apiary ownership, share, or assignment" ON "public"."tasks" TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM "public"."apiaries" "a"
  WHERE (("a"."id" = "tasks"."apiary_id") AND ("a"."user_id" = "auth"."uid"())))) OR (EXISTS ( SELECT 1
   FROM "public"."apiary_shares" "s"
  WHERE (("s"."apiary_id" = "tasks"."apiary_id") AND ("s"."viewer_id" = "auth"."uid"())))) OR ("assigned_user_id" = "auth"."uid"())));


--
-- Name: mentor_profiles Admins can manage all mentor profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all mentor profiles" ON "public"."mentor_profiles" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"text")))));


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON "public"."user_roles" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());


--
-- Name: users Mentors emails are visible; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Mentors emails are visible" ON "public"."users" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."mentor_profiles"
  WHERE ("mentor_profiles"."user_id" = "users"."id"))));


--
-- Name: apiaries Owners have full access to apiaries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owners have full access to apiaries" ON "public"."apiaries" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));


--
-- Name: mentor_profiles Public can view mentor profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view mentor profiles" ON "public"."mentor_profiles" FOR SELECT TO "authenticated" USING (true);


--
-- Name: hive_snapshots Users can delete snapshots of own hives; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete snapshots of own hives" ON "public"."hive_snapshots" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM ("public"."hives" "h"
     JOIN "public"."apiaries" "a" ON (("a"."id" = "h"."apiary_id")))
  WHERE (("h"."id" = "hive_snapshots"."hive_id") AND ("a"."user_id" = "auth"."uid"())))));


--
-- Name: apiary_shares Users can manage their own shares; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own shares" ON "public"."apiary_shares" USING (("auth"."uid"() = "owner_id"));


--
-- Name: users Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON "public"."users" FOR UPDATE USING (("id" = "auth"."uid"()));


--
-- Name: hive_snapshots Users can update snapshots of own hives; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update snapshots of own hives" ON "public"."hive_snapshots" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM ("public"."hives" "h"
     JOIN "public"."apiaries" "a" ON (("a"."id" = "h"."apiary_id")))
  WHERE (("h"."id" = "hive_snapshots"."hive_id") AND ("a"."user_id" = "auth"."uid"())))));


--
-- Name: weather_forecasts Users can view forecasts for their apiaries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view forecasts for their apiaries" ON "public"."weather_forecasts" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."apiaries" "a"
  WHERE (("a"."id" = "weather_forecasts"."apiary_id") AND ("a"."user_id" = "auth"."uid"())))));


--
-- Name: users Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON "public"."users" FOR SELECT USING (("id" = "auth"."uid"()));


--
-- Name: user_roles Users can view own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own roles" ON "public"."user_roles" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));


--
-- Name: inspections Users manage inspections in own hives; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users manage inspections in own hives" ON "public"."inspections" USING ("public"."check_hive_access"("hive_id"));


--
-- Name: interventions Users manage interventions in own hives; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users manage interventions in own hives" ON "public"."interventions" USING ("public"."check_hive_access"("hive_id"));


--
-- Name: mentor_profiles Users manage own mentor profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users manage own mentor profile" ON "public"."mentor_profiles" USING (("auth"."uid"() = "user_id"));


--
-- Name: hive_snapshots Users manage snapshots in own hives; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users manage snapshots in own hives" ON "public"."hive_snapshots" USING ("public"."check_hive_access"("hive_id"));


--
-- Name: apiaries Viewers can read shared apiaries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Viewers can read shared apiaries" ON "public"."apiaries" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."apiary_shares"
  WHERE (("apiary_shares"."apiary_id" = "apiaries"."id") AND ("apiary_shares"."viewer_id" = "auth"."uid"())))));


--
-- Name: apiary_shares Viewers can see shares shared with them; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Viewers can see shares shared with them" ON "public"."apiary_shares" FOR SELECT USING (("auth"."uid"() = "viewer_id"));


--
-- Name: apiaries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."apiaries" ENABLE ROW LEVEL SECURITY;

--
-- Name: apiary_shares; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."apiary_shares" ENABLE ROW LEVEL SECURITY;

--
-- Name: hive_snapshots; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."hive_snapshots" ENABLE ROW LEVEL SECURITY;

--
-- Name: hives; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."hives" ENABLE ROW LEVEL SECURITY;

--
-- Name: inspections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."inspections" ENABLE ROW LEVEL SECURITY;

--
-- Name: interventions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."interventions" ENABLE ROW LEVEL SECURITY;

--
-- Name: mentor_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."mentor_profiles" ENABLE ROW LEVEL SECURITY;

--
-- Name: tasks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

--
-- Name: weather_forecasts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."weather_forecasts" ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE "realtime"."messages" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets_analytics" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets_vectors" ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."prefixes" ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."vector_indexes" ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION "supabase_realtime" WITH (publish = 'insert, update, delete, truncate');


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_graphql_placeholder" ON "sql_drop"
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION "extensions"."set_graphql_placeholder"();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_cron_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_cron_access"();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_graphql_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION "extensions"."grant_pg_graphql_access"();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_net_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_net_access"();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "pgrst_ddl_watch" ON "ddl_command_end"
   EXECUTE FUNCTION "extensions"."pgrst_ddl_watch"();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "pgrst_drop_watch" ON "sql_drop"
   EXECUTE FUNCTION "extensions"."pgrst_drop_watch"();


--
-- PostgreSQL database dump complete
--

\unrestrict mXRFCNbzHZFsrY84yBLGDDRIXXMuhfYXytt2jOVLqBBVqZiPfISEDMG1UV1kopU

