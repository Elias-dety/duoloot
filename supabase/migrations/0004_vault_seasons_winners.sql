-- DUO LOOT - MIGRATION 0004
-- Vault seasons and winners history

ALTER TABLE public.vault_winners
  ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS participant_id uuid REFERENCES public.vault_participants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rank_position integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS points integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS prize_label text,
  ADD COLUMN IF NOT EXISTS prize_value numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reward_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS snapshot jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

UPDATE public.vault_winners
SET
  id = COALESCE(id, gen_random_uuid()),
  rank_position = COALESCE(rank_position, 1),
  points = COALESCE(points, 0),
  reward_status = COALESCE(reward_status, 'pending'),
  snapshot = COALESCE(snapshot, '{}'::jsonb),
  created_at = COALESCE(created_at, won_at, now())
WHERE
  id IS NULL
  OR rank_position IS NULL
  OR points IS NULL
  OR reward_status IS NULL
  OR snapshot IS NULL
  OR created_at IS NULL;

ALTER TABLE public.vault_winners
  ALTER COLUMN id SET NOT NULL,
  ALTER COLUMN rank_position SET NOT NULL,
  ALTER COLUMN points SET NOT NULL,
  ALTER COLUMN reward_status SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN task_id DROP NOT NULL,
  ALTER COLUMN submission_id DROP NOT NULL;

ALTER TABLE public.vault_winners
  DROP CONSTRAINT IF EXISTS vault_winners_pkey;

ALTER TABLE public.vault_winners
  ADD CONSTRAINT vault_winners_pkey PRIMARY KEY (id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'vault_winners_rank_position_check'
  ) THEN
    ALTER TABLE public.vault_winners
      ADD CONSTRAINT vault_winners_rank_position_check CHECK (rank_position > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'vault_winners_points_check'
  ) THEN
    ALTER TABLE public.vault_winners
      ADD CONSTRAINT vault_winners_points_check CHECK (points >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'vault_winners_reward_status_check'
  ) THEN
    ALTER TABLE public.vault_winners
      ADD CONSTRAINT vault_winners_reward_status_check
      CHECK (reward_status IN ('pending', 'approved', 'paid', 'cancelled'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'vault_winners_event_player_key'
  ) THEN
    ALTER TABLE public.vault_winners
      ADD CONSTRAINT vault_winners_event_player_key UNIQUE (event_id, player_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_vault_winners_event_id ON public.vault_winners(event_id);
CREATE INDEX IF NOT EXISTS idx_vault_winners_player_id ON public.vault_winners(player_id);
CREATE INDEX IF NOT EXISTS idx_vault_winners_rank_position ON public.vault_winners(rank_position);
CREATE INDEX IF NOT EXISTS idx_vault_winners_created_at_desc ON public.vault_winners(created_at DESC);

CREATE OR REPLACE FUNCTION public.finalize_vault_event(
  p_event_id uuid,
  p_winner_limit integer DEFAULT 3
)
RETURNS TABLE (
  success boolean,
  message text,
  event_id uuid,
  winners_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid;
  v_event public.vault_events%rowtype;
  v_limit integer;
  v_winners_count integer := 0;
BEGIN
  v_actor_id := auth.uid();

  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  v_limit := GREATEST(COALESCE(p_winner_limit, 3), 1);

  SELECT *
  INTO v_event
  FROM public.vault_events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Evento do Cofre não encontrado.', p_event_id, 0;
    RETURN;
  END IF;

  IF v_event.status IN ('ended', 'cancelled') THEN
    RETURN QUERY SELECT false, 'O evento do Cofre já foi encerrado ou cancelado.', v_event.id, 0;
    RETURN;
  END IF;

  WITH ranked_participants AS (
    SELECT
      vp.id AS participant_id,
      vp.player_id,
      ROW_NUMBER() OVER (ORDER BY vp.points DESC, vp.joined_at ASC) AS rank_position,
      vp.points,
      p.name AS player_name,
      p.nickname AS player_nickname,
      p.avatar_url,
      p.trust_score,
      COALESCE(p.game_profile, '{}'::jsonb) AS game_profile
    FROM public.vault_participants vp
    JOIN public.profiles p
      ON p.id = vp.player_id
    WHERE vp.event_id = v_event.id
    ORDER BY vp.points DESC, vp.joined_at ASC
    LIMIT v_limit
  ),
  inserted_winners AS (
    INSERT INTO public.vault_winners (
      event_id,
      player_id,
      participant_id,
      rank_position,
      points,
      prize_label,
      prize_value,
      reward_status,
      snapshot,
      created_at
    )
    SELECT
      v_event.id,
      rp.player_id,
      rp.participant_id,
      rp.rank_position,
      rp.points,
      v_event.prize_label,
      CASE rp.rank_position
        WHEN 1 THEN ROUND(COALESCE(v_event.prize_value, 0) * 0.60, 2)
        WHEN 2 THEN ROUND(COALESCE(v_event.prize_value, 0) * 0.30, 2)
        WHEN 3 THEN ROUND(COALESCE(v_event.prize_value, 0) * 0.10, 2)
        ELSE 0
      END,
      'pending',
      jsonb_build_object(
        'player_name', rp.player_name,
        'player_nickname', rp.player_nickname,
        'avatar_url', rp.avatar_url,
        'trust_score', rp.trust_score,
        'game_profile', rp.game_profile,
        'event_title', v_event.title,
        'event_prize_label', v_event.prize_label
      ),
      now()
    FROM ranked_participants rp
    ON CONFLICT (event_id, player_id) DO NOTHING
    RETURNING 1
  )
  SELECT COUNT(*)
  INTO v_winners_count
  FROM inserted_winners;

  UPDATE public.vault_events
  SET
    status = 'ended',
    ends_at = now(),
    updated_at = now()
  WHERE id = v_event.id;

  UPDATE public.vault_participants
  SET
    status = CASE
      WHEN id IN (
        SELECT participant_id
        FROM public.vault_winners
        WHERE event_id = v_event.id
      ) THEN 'winner'
      ELSE status
    END,
    updated_at = now()
  WHERE event_id = v_event.id
    AND id IN (
      SELECT participant_id
      FROM public.vault_winners
      WHERE event_id = v_event.id
    );

  RETURN QUERY SELECT true, 'Cofre finalizado com sucesso.', v_event.id, v_winners_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_vault_winners(
  p_event_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 12
)
RETURNS TABLE (
  winner_id uuid,
  event_id uuid,
  event_title text,
  player_id uuid,
  player_name text,
  player_nickname text,
  avatar_url text,
  trust_score integer,
  rank_position integer,
  points integer,
  prize_label text,
  prize_value numeric,
  reward_status text,
  snapshot jsonb,
  created_at timestamptz,
  ended_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    vw.id AS winner_id,
    vw.event_id,
    ve.title AS event_title,
    vw.player_id,
    COALESCE((vw.snapshot->>'player_name'), p.name) AS player_name,
    COALESCE((vw.snapshot->>'player_nickname'), p.nickname) AS player_nickname,
    COALESCE((vw.snapshot->>'avatar_url'), p.avatar_url) AS avatar_url,
    COALESCE(NULLIF(vw.snapshot->>'trust_score', '')::integer, p.trust_score) AS trust_score,
    vw.rank_position,
    vw.points,
    vw.prize_label,
    COALESCE(vw.prize_value, 0) AS prize_value,
    vw.reward_status,
    COALESCE(vw.snapshot, '{}'::jsonb) AS snapshot,
    vw.created_at,
    ve.ends_at AS ended_at
  FROM public.vault_winners vw
  JOIN public.vault_events ve
    ON ve.id = vw.event_id
  LEFT JOIN public.profiles p
    ON p.id = vw.player_id
  WHERE p_event_id IS NULL OR vw.event_id = p_event_id
  ORDER BY vw.created_at DESC, vw.rank_position ASC
  LIMIT GREATEST(COALESCE(p_limit, 12), 1);
$$;

CREATE OR REPLACE FUNCTION public.get_vault_seasons(
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  event_id uuid,
  title text,
  description text,
  prize_label text,
  prize_value numeric,
  status text,
  starts_at timestamptz,
  ends_at timestamptz,
  current_points integer,
  goal_points integer,
  participant_count integer,
  winners_count integer,
  top_winner_nickname text,
  top_winner_avatar_url text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ve.id AS event_id,
    ve.title,
    ve.description,
    ve.prize_label,
    COALESCE(ve.prize_value, 0) AS prize_value,
    ve.status::text AS status,
    ve.starts_at,
    ve.ends_at,
    COALESCE(ve.current_points, 0) AS current_points,
    COALESCE(ve.goal_points, 0) AS goal_points,
    COALESCE(pc.participant_count, 0) AS participant_count,
    COALESCE(wc.winners_count, 0) AS winners_count,
    tw.player_nickname AS top_winner_nickname,
    tw.avatar_url AS top_winner_avatar_url
  FROM public.vault_events ve
  LEFT JOIN LATERAL (
    SELECT COUNT(*)::integer AS participant_count
    FROM public.vault_participants vp
    WHERE vp.event_id = ve.id
  ) pc ON true
  LEFT JOIN LATERAL (
    SELECT COUNT(*)::integer AS winners_count
    FROM public.vault_winners vw
    WHERE vw.event_id = ve.id
  ) wc ON true
  LEFT JOIN LATERAL (
    SELECT
      COALESCE((vw.snapshot->>'player_nickname'), p.nickname) AS player_nickname,
      COALESCE((vw.snapshot->>'avatar_url'), p.avatar_url) AS avatar_url
    FROM public.vault_winners vw
    LEFT JOIN public.profiles p
      ON p.id = vw.player_id
    WHERE vw.event_id = ve.id
    ORDER BY vw.rank_position ASC, vw.created_at DESC
    LIMIT 1
  ) tw ON true
  ORDER BY ve.created_at DESC
  LIMIT GREATEST(COALESCE(p_limit, 10), 1);
$$;

GRANT EXECUTE ON FUNCTION public.finalize_vault_event(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_vault_winners(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_vault_seasons(integer) TO authenticated;
