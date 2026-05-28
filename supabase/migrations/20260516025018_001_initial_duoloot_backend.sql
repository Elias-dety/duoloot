-- DUO LOOT - MIGRATION 001
-- Base inicial: profiles, stats, lobby e cofre

create extension if not exists "pgcrypto";

-- =========================
-- ENUMS
-- =========================

do $$ begin
  create type player_status as enum ('online', 'offline', 'in-game');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type lobby_status as enum ('open', 'full', 'in-game', 'closed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type vault_event_status as enum ('scheduled', 'active', 'ended', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type task_validation_type as enum ('manual', 'automatic');
exception when duplicate_object then null;
end $$;

-- =========================
-- PROFILES
-- =========================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  nickname text not null,
  avatar_url text,
  trust_score int not null default 50 check (trust_score between 0 and 100),
  status player_status not null default 'offline',
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- PLAYER STATS
-- =========================

create table if not exists public.player_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.profiles(id) on delete cascade,
  game text not null default 'valorant',
  rank text not null default 'unranked',
  main_role text,
  secondary_role text,
  matches_played int not null default 0 check (matches_played >= 0),
  win_rate numeric(5,2) not null default 0 check (win_rate between 0 and 100),
  average_kda numeric(6,2) not null default 0 check (average_kda >= 0),
  hours_played int not null default 0 check (hours_played >= 0),
  commendations int not null default 0 check (commendations >= 0),
  abandons int not null default 0 check (abandons >= 0),
  updated_at timestamptz not null default now(),
  unique(player_id, game)
);

-- =========================
-- PLAYER PREFERENCES
-- =========================

create table if not exists public.player_preferences (
  player_id uuid primary key references public.profiles(id) on delete cascade,
  mic_required boolean not null default false,
  play_style text,
  session_focus text,
  availability text,
  updated_at timestamptz not null default now()
);

-- =========================
-- LOBBIES
-- =========================

create table if not exists public.lobbies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slots_total int not null check (slots_total >= 2 and slots_total <= 5),
  slots_filled int not null default 1 check (slots_filled >= 1),
  mode text not null,
  queue text not null,
  min_rank text,
  max_rank text,
  status lobby_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lobby_members (
  lobby_id uuid not null references public.lobbies(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (lobby_id, player_id)
);

-- =========================
-- COFRE / VAULT EVENTS
-- =========================

create table if not exists public.vault_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  prize_pool numeric(12,2) not null default 0 check (prize_pool >= 0),
  prize_currency text not null default 'BRL',
  status vault_event_status not null default 'scheduled',
  total_participants int not null default 0 check (total_participants >= 0),
  online_participants int not null default 0 check (online_participants >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.vault_events(id) on delete cascade,
  title text not null,
  description text not null,
  rules text[] not null default '{}',
  validation_type task_validation_type not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists public.vault_participants (
  event_id uuid not null references public.vault_events(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (event_id, player_id)
);

create table if not exists public.vault_submissions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.vault_events(id) on delete cascade,
  task_id uuid not null references public.vault_tasks(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  payload jsonb not null default '{}',
  is_valid boolean,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_winners (
  event_id uuid primary key references public.vault_events(id) on delete cascade,
  task_id uuid not null references public.vault_tasks(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid not null references public.vault_submissions(id) on delete cascade,
  won_at timestamptz not null default now()
);

-- =========================
-- FUNÇÃO CRÍTICA DO COFRE
-- Garante primeiro vencedor por evento
-- =========================

create or replace function public.claim_vault_winner(
  p_event_id uuid,
  p_task_id uuid,
  p_payload jsonb default '{}'
)
returns table (
  success boolean,
  message text,
  winner_player_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player_id uuid;
  v_submission_id uuid;
  v_existing_winner uuid;
begin
  v_player_id := auth.uid();

  if v_player_id is null then
    return query select false, 'Usuário não autenticado', null::uuid;
    return;
  end if;

  if not exists (
    select 1
    from public.vault_events
    where id = p_event_id
      and status = 'active'
  ) then
    return query select false, 'Evento não está ativo', null::uuid;
    return;
  end if;

  if not exists (
    select 1
    from public.vault_participants
    where event_id = p_event_id
      and player_id = v_player_id
  ) then
    return query select false, 'Jogador não inscrito no evento', null::uuid;
    return;
  end if;

  insert into public.vault_submissions (
    event_id,
    task_id,
    player_id,
    payload,
    is_valid
  )
  values (
    p_event_id,
    p_task_id,
    v_player_id,
    p_payload,
    true
  )
  returning id into v_submission_id;

  select player_id
  into v_existing_winner
  from public.vault_winners
  where event_id = p_event_id
  for update;

  if v_existing_winner is not null then
    return query select false, 'Este cofre já tem vencedor', v_existing_winner;
    return;
  end if;

  insert into public.vault_winners (
    event_id,
    task_id,
    player_id,
    submission_id
  )
  values (
    p_event_id,
    p_task_id,
    v_player_id,
    v_submission_id
  );

  return query select true, 'Vitória registrada', v_player_id;
end;
$$;

-- =========================
-- ÍNDICES
-- =========================

create index if not exists idx_profiles_trust_score on public.profiles(trust_score desc);
create index if not exists idx_player_stats_player_id on public.player_stats(player_id);
create index if not exists idx_lobbies_status on public.lobbies(status);
create index if not exists idx_lobby_members_player_id on public.lobby_members(player_id);
create index if not exists idx_vault_events_status on public.vault_events(status);
create index if not exists idx_vault_submissions_event_created on public.vault_submissions(event_id, created_at);
create index if not exists idx_vault_participants_player_id on public.vault_participants(player_id);

-- =========================
-- RLS
-- =========================

alter table public.profiles enable row level security;
alter table public.player_stats enable row level security;
alter table public.player_preferences enable row level security;
alter table public.lobbies enable row level security;
alter table public.lobby_members enable row level security;
alter table public.vault_events enable row level security;
alter table public.vault_tasks enable row level security;
alter table public.vault_participants enable row level security;
alter table public.vault_submissions enable row level security;
alter table public.vault_winners enable row level security;

-- Profiles
create policy "profiles_select_all"
on public.profiles for select
to authenticated
using (true);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Player stats
create policy "player_stats_select_all"
on public.player_stats for select
to authenticated
using (true);

create policy "player_stats_manage_own"
on public.player_stats for all
to authenticated
using (auth.uid() = player_id)
with check (auth.uid() = player_id);

-- Preferences
create policy "preferences_select_own"
on public.player_preferences for select
to authenticated
using (auth.uid() = player_id);

create policy "preferences_manage_own"
on public.player_preferences for all
to authenticated
using (auth.uid() = player_id)
with check (auth.uid() = player_id);

-- Lobbies
create policy "lobbies_select_all"
on public.lobbies for select
to authenticated
using (true);

create policy "lobbies_insert_own"
on public.lobbies for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "lobbies_update_owner"
on public.lobbies for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

-- Lobby members
create policy "lobby_members_select_all"
on public.lobby_members for select
to authenticated
using (true);

create policy "lobby_members_join_own"
on public.lobby_members for insert
to authenticated
with check (auth.uid() = player_id);

create policy "lobby_members_leave_own"
on public.lobby_members for delete
to authenticated
using (auth.uid() = player_id);

-- Vault public read
create policy "vault_events_select_all"
on public.vault_events for select
to authenticated
using (true);

create policy "vault_tasks_select_all"
on public.vault_tasks for select
to authenticated
using (true);

create policy "vault_winners_select_all"
on public.vault_winners for select
to authenticated
using (true);

-- Vault participants
create policy "vault_participants_select_all"
on public.vault_participants for select
to authenticated
using (true);

create policy "vault_participants_join_own"
on public.vault_participants for insert
to authenticated
with check (auth.uid() = player_id);

-- Vault submissions
create policy "vault_submissions_select_own"
on public.vault_submissions for select
to authenticated
using (auth.uid() = player_id);

create policy "vault_submissions_insert_own"
on public.vault_submissions for insert
to authenticated
with check (auth.uid() = player_id);
;
