-- DUO LOOT - MIGRATION 0003
-- Vault leaderboard RPCs

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS game_profile jsonb DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.get_vault_leaderboard(
  p_event_id uuid,
  p_limit integer DEFAULT 20
)
RETURNS TABLE (
  rank_position integer,
  participant_id uuid,
  player_id uuid,
  player_name text,
  player_nickname text,
  avatar_url text,
  trust_score integer,
  points integer,
  joined_at timestamptz,
  missions_completed integer,
  total_missions integer,
  game_profile jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id uuid;
  v_limit integer;
BEGIN
  v_limit := GREATEST(COALESCE(p_limit, 20), 1);

  IF p_event_id IS NULL THEN
    SELECT ve.id
    INTO v_event_id
    FROM public.vault_events ve
    WHERE ve.status = 'active'
    ORDER BY ve.created_at DESC
    LIMIT 1;
  ELSE
    SELECT ve.id
    INTO v_event_id
    FROM public.vault_events ve
    WHERE ve.id = p_event_id
    LIMIT 1;
  END IF;

  IF v_event_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH active_missions AS (
    SELECT COUNT(*)::integer AS total_missions
    FROM public.vault_missions vm
    WHERE vm.event_id = v_event_id
      AND vm.status = 'active'
  ),
  participant_progress AS (
    SELECT
      vp.id AS participant_id,
      vp.player_id,
      COUNT(*) FILTER (WHERE vmp.completed = true)::integer AS missions_completed
    FROM public.vault_participants vp
    LEFT JOIN public.vault_mission_progress vmp
      ON vmp.event_id = vp.event_id
     AND vmp.player_id = vp.player_id
    WHERE vp.event_id = v_event_id
    GROUP BY vp.id, vp.player_id
  ),
  ranked AS (
    SELECT
      RANK() OVER (ORDER BY vp.points DESC, vp.joined_at ASC)::integer AS rank_position,
      vp.id AS participant_id,
      vp.player_id,
      p.name AS player_name,
      p.nickname AS player_nickname,
      p.avatar_url,
      p.trust_score,
      vp.points,
      vp.joined_at,
      COALESCE(pp.missions_completed, 0)::integer AS missions_completed,
      COALESCE(am.total_missions, 0)::integer AS total_missions,
      COALESCE(p.game_profile, '{}'::jsonb) AS game_profile
    FROM public.vault_participants vp
    JOIN public.profiles p
      ON p.id = vp.player_id
    LEFT JOIN participant_progress pp
      ON pp.participant_id = vp.id
    CROSS JOIN active_missions am
    WHERE vp.event_id = v_event_id
  )
  SELECT
    r.rank_position,
    r.participant_id,
    r.player_id,
    r.player_name,
    r.player_nickname,
    r.avatar_url,
    r.trust_score,
    r.points,
    r.joined_at,
    r.missions_completed,
    r.total_missions,
    r.game_profile
  FROM ranked r
  ORDER BY r.points DESC, r.joined_at ASC
  LIMIT v_limit;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_vault_rank(
  p_event_id uuid
)
RETURNS TABLE (
  rank_position integer,
  participant_id uuid,
  player_id uuid,
  player_name text,
  player_nickname text,
  avatar_url text,
  trust_score integer,
  points integer,
  joined_at timestamptz,
  missions_completed integer,
  total_missions integer,
  game_profile jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id uuid;
  v_player_id uuid;
BEGIN
  v_player_id := auth.uid();

  IF v_player_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  IF p_event_id IS NULL THEN
    SELECT ve.id
    INTO v_event_id
    FROM public.vault_events ve
    WHERE ve.status = 'active'
    ORDER BY ve.created_at DESC
    LIMIT 1;
  ELSE
    SELECT ve.id
    INTO v_event_id
    FROM public.vault_events ve
    WHERE ve.id = p_event_id
    LIMIT 1;
  END IF;

  IF v_event_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH active_missions AS (
    SELECT COUNT(*)::integer AS total_missions
    FROM public.vault_missions vm
    WHERE vm.event_id = v_event_id
      AND vm.status = 'active'
  ),
  participant_progress AS (
    SELECT
      vp.id AS participant_id,
      vp.player_id,
      COUNT(*) FILTER (WHERE vmp.completed = true)::integer AS missions_completed
    FROM public.vault_participants vp
    LEFT JOIN public.vault_mission_progress vmp
      ON vmp.event_id = vp.event_id
     AND vmp.player_id = vp.player_id
    WHERE vp.event_id = v_event_id
    GROUP BY vp.id, vp.player_id
  ),
  ranked AS (
    SELECT
      RANK() OVER (ORDER BY vp.points DESC, vp.joined_at ASC)::integer AS rank_position,
      vp.id AS participant_id,
      vp.player_id,
      p.name AS player_name,
      p.nickname AS player_nickname,
      p.avatar_url,
      p.trust_score,
      vp.points,
      vp.joined_at,
      COALESCE(pp.missions_completed, 0)::integer AS missions_completed,
      COALESCE(am.total_missions, 0)::integer AS total_missions,
      COALESCE(p.game_profile, '{}'::jsonb) AS game_profile
    FROM public.vault_participants vp
    JOIN public.profiles p
      ON p.id = vp.player_id
    LEFT JOIN participant_progress pp
      ON pp.participant_id = vp.id
    CROSS JOIN active_missions am
    WHERE vp.event_id = v_event_id
  )
  SELECT
    r.rank_position,
    r.participant_id,
    r.player_id,
    r.player_name,
    r.player_nickname,
    r.avatar_url,
    r.trust_score,
    r.points,
    r.joined_at,
    r.missions_completed,
    r.total_missions,
    r.game_profile
  FROM ranked r
  WHERE r.player_id = v_player_id
  ORDER BY r.points DESC, r.joined_at ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_vault_leaderboard(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_vault_rank(uuid) TO authenticated;
