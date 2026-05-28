-- Remove temporary debug RPC from production schema.
-- Safe: no table drops and no user data deletion.

drop function if exists public.debug_dump_public_data();
