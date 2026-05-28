-- DUO LOOT - MIGRATION 010
-- RPC para Recomendação de Jogadores

create or replace function public.get_recommended_players(
  p_game text default 'valorant',
  p_limit int default 10
)
returns table (
  player_id uuid,
  name text,
  nickname text,
  avatar_url text,
  trust_score int,
  rank text,
  main_role text,
  secondary_role text,
  win_rate numeric,
  average_kda numeric,
  matches_played int,
  commendations int,
  abandons int,
  play_style text,
  session_focus text,
  availability text,
  compatibility_score int
)
language sql
security definer
set search_path = public
as $$
  with current_player as (
    select
      p.id,
      ps.main_role,
      pp.session_focus
    from public.profiles p
    left join public.player_stats ps
      on ps.player_id = p.id
      and ps.game = p_game
    left join public.player_preferences pp
      on pp.player_id = p.id
    where p.id = auth.uid()
    limit 1
  ),
  candidates as (
    select
      p.id as player_id,
      p.name,
      p.nickname,
      p.avatar_url,
      p.trust_score,
      ps.rank,
      ps.main_role,
      ps.secondary_role,
      ps.win_rate,
      ps.average_kda,
      ps.matches_played,
      ps.commendations,
      ps.abandons,
      pp.play_style,
      pp.session_focus,
      pp.availability,
      (
        least(35, greatest(0, round(p.trust_score * 0.35)))::int
        + least(25, greatest(0, round(ps.win_rate * 0.25)))::int
        + least(10, greatest(0, ps.commendations))::int
        + greatest(0, 15 - ps.abandons)::int
        + case when ps.main_role = cp.main_role then 10 else 0 end
        + case when pp.session_focus = cp.session_focus then 5 else 0 end
      ) as compatibility_score
    from public.profiles p
    join public.player_stats ps
      on ps.player_id = p.id
      and ps.game = p_game
    left join public.player_preferences pp
      on pp.player_id = p.id
    cross join current_player cp
    where p.id <> auth.uid()
  )
  select *
  from candidates
  order by compatibility_score desc, trust_score desc, win_rate desc
  limit greatest(1, least(p_limit, 50));
$$;;
