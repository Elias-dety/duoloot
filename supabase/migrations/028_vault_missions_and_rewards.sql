-- Migration 028: Vault missions and rewards
-- Adiciona suporte a premios em dinheiro real, controle de vencedores e aprovacao de evidencias.

-- 1. Atualizar tabela vault_missions
ALTER TABLE public.vault_missions 
  ADD COLUMN IF NOT EXISTS requirements text,
  ADD COLUMN IF NOT EXISTS cash_reward_cents integer not null default 0 check (cash_reward_cents >= 0),
  ADD COLUMN IF NOT EXISTS currency text not null default 'BRL',
  ADD COLUMN IF NOT EXISTS winner_limit integer not null default 1 check (winner_limit >= 1),
  ADD COLUMN IF NOT EXISTS starts_at timestamptz,
  ADD COLUMN IF NOT EXISTS ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_by uuid references public.profiles(id);

-- Atualiza a constraint de status para permitir novos estados se possivel,
-- senao recria a constraint
DO $$
BEGIN
  ALTER TABLE public.vault_missions DROP CONSTRAINT IF EXISTS vault_missions_status_check;
  -- Atualizar inativos antigos para closed
  UPDATE public.vault_missions SET status = 'closed' WHERE status = 'inactive';
  ALTER TABLE public.vault_missions ADD CONSTRAINT vault_missions_status_check CHECK (status in ('draft', 'active', 'closed', 'archived'));
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

UPDATE public.vault_missions SET requirements = description WHERE requirements IS NULL;
ALTER TABLE public.vault_missions ALTER COLUMN requirements SET NOT NULL;

-- 2. Tabela vault_mission_submissions
CREATE TABLE IF NOT EXISTS public.vault_mission_submissions (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.vault_missions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  evidence_text text,
  evidence_url text,
  status text not null default 'submitted' check (status in ('submitted', 'approved', 'rejected', 'cancelled')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_vault_mission_submissions_mission_id ON public.vault_mission_submissions(mission_id);
CREATE INDEX IF NOT EXISTS idx_vault_mission_submissions_user_id ON public.vault_mission_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_mission_submissions_status ON public.vault_mission_submissions(status);

ALTER TABLE public.vault_mission_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vault_mission_submissions_select_own" ON public.vault_mission_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id);
-- Permitir admin ver tudo, usaremos RPCs para interacoes entao o resto é fechado.

-- 3. Tabela vault_mission_rewards
CREATE TABLE IF NOT EXISTS public.vault_mission_rewards (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.vault_missions(id) on delete cascade,
  submission_id uuid not null references public.vault_mission_submissions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  points_awarded integer not null check (points_awarded >= 0),
  cash_reward_cents integer not null check (cash_reward_cents >= 0),
  currency text not null default 'BRL',
  reward_status text not null default 'reserved' check (reward_status in ('reserved', 'paid', 'cancelled')),
  idempotency_key text not null unique,
  awarded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_vault_mission_rewards_mission_id ON public.vault_mission_rewards(mission_id);
CREATE INDEX IF NOT EXISTS idx_vault_mission_rewards_user_id ON public.vault_mission_rewards(user_id);

ALTER TABLE public.vault_mission_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vault_mission_rewards_select_own" ON public.vault_mission_rewards FOR SELECT TO authenticated USING (auth.uid() = user_id);


-- 4. RPC: get_vault_missions
-- Retorna as missoes ativas. O ideal é que o front possa ver o status (se ele ja mandou, e quantas vagas sobraram)
CREATE OR REPLACE FUNCTION public.get_vault_missions()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', m.id,
      'event_id', m.event_id,
      'title', m.title,
      'description', m.description,
      'requirements', m.requirements,
      'points_reward', m.points_reward,
      'cash_reward_cents', m.cash_reward_cents,
      'currency', m.currency,
      'winner_limit', m.winner_limit,
      'status', m.status,
      'starts_at', m.starts_at,
      'ends_at', m.ends_at,
      'winners_count', COALESCE((SELECT count(*) FROM public.vault_mission_rewards r WHERE r.mission_id = m.id AND r.reward_status IN ('reserved', 'paid')), 0),
      'my_submission', (
        SELECT jsonb_build_object(
          'id', s.id,
          'status', s.status,
          'submitted_at', s.submitted_at
        )
        FROM public.vault_mission_submissions s
        WHERE s.mission_id = m.id AND s.user_id = v_user_id
        ORDER BY s.created_at DESC
        LIMIT 1
      )
    )
  ) INTO v_result
  FROM public.vault_missions m
  WHERE m.status IN ('active', 'closed');

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;


-- 5. RPC: submit_vault_mission
CREATE OR REPLACE FUNCTION public.submit_vault_mission(p_mission_id uuid, p_evidence_text text, p_evidence_url text)
RETURNS table(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_mission public.vault_missions;
  v_winners_count integer;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Usuário não autenticado'; RETURN;
  END IF;

  SELECT * INTO v_mission FROM public.vault_missions WHERE id = p_mission_id;
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Missão não encontrada'; RETURN;
  END IF;

  IF v_mission.status != 'active' THEN
    RETURN QUERY SELECT false, 'Missão não está ativa'; RETURN;
  END IF;

  IF p_evidence_text IS NULL AND p_evidence_url IS NULL THEN
    RETURN QUERY SELECT false, 'É necessário fornecer uma evidência (texto ou link)'; RETURN;
  END IF;

  -- Checar se ja tem submissão em andamento ou aprovada
  IF EXISTS (
    SELECT 1 FROM public.vault_mission_submissions 
    WHERE mission_id = p_mission_id AND user_id = v_user_id AND status IN ('submitted', 'approved')
  ) THEN
    RETURN QUERY SELECT false, 'Você já possui uma submissão para esta missão.'; RETURN;
  END IF;

  -- Checar se ja excedeu vencedores
  SELECT count(*) INTO v_winners_count FROM public.vault_mission_rewards WHERE mission_id = p_mission_id AND reward_status IN ('reserved', 'paid');
  IF v_winners_count >= v_mission.winner_limit THEN
    RETURN QUERY SELECT false, 'Esta missão já atingiu o limite de vencedores.'; RETURN;
  END IF;

  INSERT INTO public.vault_mission_submissions (mission_id, user_id, evidence_text, evidence_url, status)
  VALUES (p_mission_id, v_user_id, p_evidence_text, p_evidence_url, 'submitted');

  RETURN QUERY SELECT true, 'Conclusão enviada para análise!';
END;
$$;


-- 6. RPC: approve_vault_submission
CREATE OR REPLACE FUNCTION public.approve_vault_submission(p_submission_id uuid, p_review_note text)
RETURNS table(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid := auth.uid();
  v_submission public.vault_mission_submissions;
  v_mission public.vault_missions;
  v_winners_count integer;
  v_idempotency_key text;
BEGIN
  IF v_admin_id IS NULL OR NOT public.duoloot_is_admin(v_admin_id) THEN
    RETURN QUERY SELECT false, 'Acesso negado'; RETURN;
  END IF;

  -- Block execution to prevent concurrency issues (FOR UPDATE)
  SELECT * INTO v_submission FROM public.vault_mission_submissions WHERE id = p_submission_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Submissão não encontrada'; RETURN;
  END IF;

  IF v_submission.status != 'submitted' THEN
    RETURN QUERY SELECT false, 'Submissão não está com status pendente'; RETURN;
  END IF;

  SELECT * INTO v_mission FROM public.vault_missions WHERE id = v_submission.mission_id FOR UPDATE;
  
  -- Checar limite de vencedores
  SELECT count(*) INTO v_winners_count FROM public.vault_mission_rewards WHERE mission_id = v_mission.id AND reward_status IN ('reserved', 'paid');
  IF v_winners_count >= v_mission.winner_limit THEN
    -- Pode rejeitar automaticamente ou apenas avisar
    UPDATE public.vault_mission_submissions 
    SET status = 'rejected', reviewed_at = now(), reviewed_by = v_admin_id, review_note = 'Missão já alcançou o limite de vencedores.'
    WHERE id = p_submission_id;
    RETURN QUERY SELECT false, 'Limite de vencedores já alcançado. Submissão rejeitada automaticamente.'; RETURN;
  END IF;

  -- Aprova a submissão
  UPDATE public.vault_mission_submissions 
  SET status = 'approved', reviewed_at = now(), reviewed_by = v_admin_id, review_note = p_review_note
  WHERE id = p_submission_id;

  -- Se o participante não estava na tabela vault_participants, insere
  INSERT INTO public.vault_participants (event_id, player_id)
  VALUES (v_mission.event_id, v_submission.user_id)
  ON CONFLICT ON CONSTRAINT vault_participants_pkey DO NOTHING;

  -- Dar pontos de ranking no Cofre
  UPDATE public.vault_participants
  SET points = points + v_mission.points_reward, updated_at = now()
  WHERE event_id = v_mission.event_id AND player_id = v_submission.user_id;

  UPDATE public.vault_events
  SET current_points = current_points + v_mission.points_reward, updated_at = now()
  WHERE id = v_mission.event_id;

  v_idempotency_key := 'vault_mission_reward:' || v_mission.id || ':' || v_submission.user_id;

  -- Registrar recompensa reservada
  INSERT INTO public.vault_mission_rewards (
    mission_id, submission_id, user_id, points_awarded, cash_reward_cents, currency, reward_status, idempotency_key
  ) VALUES (
    v_mission.id, p_submission_id, v_submission.user_id, v_mission.points_reward, v_mission.cash_reward_cents, v_mission.currency, 'reserved', v_idempotency_key
  ) ON CONFLICT (idempotency_key) DO NOTHING;

  -- Tambem dar as DuoCoins, usando a integracao recem feita
  IF v_mission.points_reward > 0 THEN
    PERFORM public.grant_wallet_credit(
      v_submission.user_id,
      v_mission.points_reward,
      'mission_reward',
      'vault_mission',
      v_mission.id,
      v_idempotency_key || ':wallet',
      jsonb_build_object(
        'event_id', v_mission.event_id,
        'mission_id', v_mission.id,
        'submission_id', p_submission_id,
        'mission_title', v_mission.title,
        'source', 'cofre_submission_approved'
      )
    );
  END IF;

  RETURN QUERY SELECT true, 'Submissão aprovada e recompensas concedidas.';
END;
$$;


-- 7. RPC: reject_vault_submission
CREATE OR REPLACE FUNCTION public.reject_vault_submission(p_submission_id uuid, p_review_note text)
RETURNS table(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id uuid := auth.uid();
  v_submission public.vault_mission_submissions;
BEGIN
  IF v_admin_id IS NULL OR NOT public.duoloot_is_admin(v_admin_id) THEN
    RETURN QUERY SELECT false, 'Acesso negado'; RETURN;
  END IF;

  SELECT * INTO v_submission FROM public.vault_mission_submissions WHERE id = p_submission_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Submissão não encontrada'; RETURN;
  END IF;

  IF v_submission.status != 'submitted' THEN
    RETURN QUERY SELECT false, 'Submissão não está com status pendente'; RETURN;
  END IF;

  UPDATE public.vault_mission_submissions 
  SET status = 'rejected', reviewed_at = now(), reviewed_by = v_admin_id, review_note = p_review_note
  WHERE id = p_submission_id;

  RETURN QUERY SELECT true, 'Submissão rejeitada.';
END;
$$;
