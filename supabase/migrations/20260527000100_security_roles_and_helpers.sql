-- DuoLoot security foundation: roles and trusted helper functions.
-- Purpose: create a server-side source of truth for user roles.
-- This migration does NOT make anyone admin automatically.

begin;

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin', 'owner')),
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_roles_role_idx on public.user_roles(role);

alter table public.user_roles enable row level security;

create or replace function public.duoloot_current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select role
      from public.user_roles
      where user_id = auth.uid()
      limit 1
    ),
    'user'
  );
$$;

create or replace function public.duoloot_has_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.duoloot_current_user_role() = any(required_roles);
$$;

create or replace function public.duoloot_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.duoloot_has_role(array['admin', 'owner']);
$$;

revoke all on table public.user_roles from anon;
revoke all on table public.user_roles from authenticated;
grant select on table public.user_roles to authenticated;

revoke all on function public.duoloot_current_user_role() from public;
revoke all on function public.duoloot_has_role(text[]) from public;
revoke all on function public.duoloot_is_admin() from public;

grant execute on function public.duoloot_current_user_role() to authenticated, service_role;
grant execute on function public.duoloot_has_role(text[]) to authenticated, service_role;
grant execute on function public.duoloot_is_admin() to authenticated, service_role;

drop policy if exists user_roles_select_own_or_admin on public.user_roles;
create policy user_roles_select_own_or_admin
on public.user_roles
for select
to authenticated
using (
  user_id = auth.uid()
  or public.duoloot_is_admin()
);

comment on table public.user_roles is 'Trusted role table for DuoLoot. Never trust role/is_admin from the client payload.';
comment on function public.duoloot_is_admin() is 'Trusted admin check. Use inside RPCs and policies for admin-only actions.';

commit;
