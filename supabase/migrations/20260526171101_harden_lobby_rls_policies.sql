-- Harden and deduplicate lobby RLS policies.
-- Safe: no data deletion, no table drops.

alter table public.lobbies enable row level security;
alter table public.lobby_members enable row level security;

-- Remove old/duplicate lobby policies.
drop policy if exists lobbies_insert_own on public.lobbies;
drop policy if exists lobbies_select_all on public.lobbies;
drop policy if exists lobbies_update_owner on public.lobbies;
drop policy if exists "Authenticated users can create own lobbies" on public.lobbies;
drop policy if exists "Owners can update own lobbies" on public.lobbies;
drop policy if exists "Public can read open lobbies" on public.lobbies;

-- Remove old/duplicate lobby member policies.
drop policy if exists lobby_members_join_own on public.lobby_members;
drop policy if exists lobby_members_leave_own on public.lobby_members;
drop policy if exists lobby_members_select_all on public.lobby_members;
drop policy if exists "Users can insert themselves as lobby members" on public.lobby_members;
drop policy if exists "Users can read own lobby memberships" on public.lobby_members;

-- Non-recursive policies using optimized auth.uid() calls.
create policy "lobbies_read_open_or_owned"
  on public.lobbies
  for select
  using (
    status = 'open'::public.lobby_status
    or owner_id = (select auth.uid())
  );

create policy "lobbies_insert_owned"
  on public.lobbies
  for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "lobbies_update_owned"
  on public.lobbies
  for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "lobby_members_read_own"
  on public.lobby_members
  for select
  to authenticated
  using (
    player_id = (select auth.uid())
    or user_id = (select auth.uid())
  );

create policy "lobby_members_insert_own"
  on public.lobby_members
  for insert
  to authenticated
  with check (
    player_id = (select auth.uid())
    and (user_id is null or user_id = (select auth.uid()))
  );

create policy "lobby_members_delete_own"
  on public.lobby_members
  for delete
  to authenticated
  using (
    player_id = (select auth.uid())
    or user_id = (select auth.uid())
  );;
