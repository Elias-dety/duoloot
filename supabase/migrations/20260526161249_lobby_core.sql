-- Duo Loot lobby core
-- Creates/repairs the database pieces needed for creating and joining lobbies.

create extension if not exists pgcrypto;

create table if not exists public.lobbies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slots_total integer not null default 5 check (slots_total between 2 and 10),
  slots_filled integer not null default 1 check (slots_filled >= 0),
  mode text not null default 'competitivo',
  queue text not null default 'ranked',
  min_rank text default 'livre',
  max_rank text default 'livre',
  status text not null default 'open' check (status in ('open', 'full', 'in-game', 'closed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lobbies add column if not exists owner_id uuid;
alter table public.lobbies add column if not exists slots_total integer not null default 5;
alter table public.lobbies add column if not exists slots_filled integer not null default 1;
alter table public.lobbies add column if not exists mode text not null default 'competitivo';
alter table public.lobbies add column if not exists queue text not null default 'ranked';
alter table public.lobbies add column if not exists min_rank text default 'livre';
alter table public.lobbies add column if not exists max_rank text default 'livre';
alter table public.lobbies add column if not exists status text not null default 'open';
alter table public.lobbies add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.lobbies add column if not exists created_at timestamptz not null default now();
alter table public.lobbies add column if not exists updated_at timestamptz not null default now();

create table if not exists public.lobby_members (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid not null references public.lobbies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (lobby_id, user_id)
);

alter table public.lobby_members add column if not exists lobby_id uuid;
alter table public.lobby_members add column if not exists user_id uuid;
alter table public.lobby_members add column if not exists role text not null default 'member';
alter table public.lobby_members add column if not exists created_at timestamptz not null default now();

create index if not exists idx_lobbies_status_created_at on public.lobbies(status, created_at desc);
create index if not exists idx_lobbies_owner_id on public.lobbies(owner_id);
create index if not exists idx_lobby_members_lobby_id on public.lobby_members(lobby_id);
create index if not exists idx_lobby_members_user_id on public.lobby_members(user_id);

alter table public.lobbies enable row level security;
alter table public.lobby_members enable row level security;

drop policy if exists "Public can read open lobbies" on public.lobbies;
create policy "Public can read open lobbies"
  on public.lobbies
  for select
  using (
    status = 'open'
    or owner_id = auth.uid()
    or exists (
      select 1
      from public.lobby_members lm
      where lm.lobby_id = lobbies.id
        and lm.user_id = auth.uid()
    )
  );

drop policy if exists "Authenticated users can create own lobbies" on public.lobbies;
create policy "Authenticated users can create own lobbies"
  on public.lobbies
  for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "Owners can update own lobbies" on public.lobbies;
create policy "Owners can update own lobbies"
  on public.lobbies
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Members can read lobby members" on public.lobby_members;
create policy "Members can read lobby members"
  on public.lobby_members
  for select
  using (
    user_id = auth.uid()
    or exists (
      select 1
      from public.lobbies l
      where l.id = lobby_members.lobby_id
        and (l.status = 'open' or l.owner_id = auth.uid())
    )
  );

drop policy if exists "Users can insert themselves as lobby members" on public.lobby_members;
create policy "Users can insert themselves as lobby members"
  on public.lobby_members
  for insert
  to authenticated
  with check (user_id = auth.uid());

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_lobbies_touch_updated_at on public.lobbies;
create trigger trg_lobbies_touch_updated_at
before update on public.lobbies
for each row execute function public.touch_updated_at();

create or replace function public.create_lobby(
  p_slots_total integer default 5,
  p_mode text default 'competitivo',
  p_queue text default 'ranked',
  p_min_rank text default 'livre',
  p_max_rank text default 'livre',
  p_metadata jsonb default '{}'::jsonb
)
returns table(success boolean, message text, lobby_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_lobby_id uuid;
  v_slots_total integer;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return query select false, 'Entre na sua conta para criar um lobby.'::text, null::uuid;
    return;
  end if;

  if not exists (select 1 from public.profiles p where p.id = v_user_id) then
    return query select false, 'Perfil do usuário não encontrado.'::text, null::uuid;
    return;
  end if;

  v_slots_total := greatest(2, least(coalesce(p_slots_total, 5), 10));

  update public.lobbies
    set status = 'closed'
  where owner_id = v_user_id
    and status = 'open';

  insert into public.lobbies (
    owner_id,
    slots_total,
    slots_filled,
    mode,
    queue,
    min_rank,
    max_rank,
    status,
    metadata
  ) values (
    v_user_id,
    v_slots_total,
    1,
    coalesce(nullif(trim(p_mode), ''), 'competitivo'),
    coalesce(nullif(trim(p_queue), ''), 'ranked'),
    coalesce(nullif(trim(p_min_rank), ''), 'livre'),
    coalesce(nullif(trim(p_max_rank), ''), 'livre'),
    'open',
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_lobby_id;

  insert into public.lobby_members (lobby_id, user_id, role)
  values (v_lobby_id, v_user_id, 'owner')
  on conflict (lobby_id, user_id) do nothing;

  return query select true, 'Lobby criado com sucesso.'::text, v_lobby_id;
end;
$$;

create or replace function public.join_lobby(p_lobby_id uuid)
returns table(success boolean, message text, lobby_id uuid, slots_filled integer, slots_total integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_lobby public.lobbies%rowtype;
  v_member_count integer;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return query select false, 'Entre na sua conta para entrar em um lobby.'::text, p_lobby_id, null::integer, null::integer;
    return;
  end if;

  if not exists (select 1 from public.profiles p where p.id = v_user_id) then
    return query select false, 'Perfil do usuário não encontrado.'::text, p_lobby_id, null::integer, null::integer;
    return;
  end if;

  select * into v_lobby
  from public.lobbies l
  where l.id = p_lobby_id
  for update;

  if not found then
    return query select false, 'Lobby não encontrado.'::text, p_lobby_id, null::integer, null::integer;
    return;
  end if;

  if v_lobby.owner_id = v_user_id then
    return query select false, 'Você já é o dono deste lobby.'::text, p_lobby_id, v_lobby.slots_filled, v_lobby.slots_total;
    return;
  end if;

  if v_lobby.status <> 'open' then
    return query select false, 'Este lobby não está mais aberto.'::text, p_lobby_id, v_lobby.slots_filled, v_lobby.slots_total;
    return;
  end if;

  if exists (
    select 1 from public.lobby_members lm
    where lm.lobby_id = p_lobby_id
      and lm.user_id = v_user_id
  ) then
    return query select true, 'Você já está neste lobby.'::text, p_lobby_id, v_lobby.slots_filled, v_lobby.slots_total;
    return;
  end if;

  select count(*)::integer into v_member_count
  from public.lobby_members lm
  where lm.lobby_id = p_lobby_id;

  if v_member_count >= v_lobby.slots_total then
    update public.lobbies set status = 'full', slots_filled = v_member_count where id = p_lobby_id;
    return query select false, 'Lobby cheio.'::text, p_lobby_id, v_member_count, v_lobby.slots_total;
    return;
  end if;

  insert into public.lobby_members (lobby_id, user_id, role)
  values (p_lobby_id, v_user_id, 'member')
  on conflict (lobby_id, user_id) do nothing;

  select count(*)::integer into v_member_count
  from public.lobby_members lm
  where lm.lobby_id = p_lobby_id;

  update public.lobbies
  set
    slots_filled = v_member_count,
    status = case when v_member_count >= slots_total then 'full' else 'open' end
  where id = p_lobby_id;

  return query select true, 'Você entrou no lobby.'::text, p_lobby_id, v_member_count, v_lobby.slots_total;
end;
$$;

grant execute on function public.create_lobby(integer, text, text, text, text, jsonb) to authenticated;
grant execute on function public.join_lobby(uuid) to authenticated;;
