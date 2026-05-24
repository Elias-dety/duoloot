-- DUO LOOT - MIGRATION 017
-- Vault progress and missions rework

-- 1. Alter vault_events
ALTER TABLE public.vault_events 
  ADD COLUMN IF NOT EXISTS prize_label text not null default 'Loot semanal',
  ADD COLUMN IF NOT EXISTS prize_value numeric default 0,
  ADD COLUMN IF NOT EXISTS goal_points integer not null default 1000,
  ADD COLUMN IF NOT EXISTS current_points integer not null default 0,
  ADD COLUMN IF NOT EXISTS metadata jsonb default '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz not null default now();

-- 2. Alter vault_participants
-- A tabela original usa primary key composta (event_id, player_id). Mantemos
-- essa chave para o ON CONFLICT existente e adicionamos id como chave unica
-- para referencias de ranking/historico.
ALTER TABLE public.vault_participants
  ADD COLUMN IF NOT EXISTS id uuid,
  ADD COLUMN IF NOT EXISTS points integer not null default 0 check (points >= 0),
  ADD COLUMN IF NOT EXISTS status text not null default 'active' check (status in ('active', 'blocked', 'winner')),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz not null default now();

UPDATE public.vault_participants
SET id = gen_random_uuid()
WHERE id IS NULL;

ALTER TABLE public.vault_participants
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'vault_participants_id_key'
  ) THEN
    ALTER TABLE public.vault_participants
      ADD CONSTRAINT vault_participants_id_key UNIQUE (id);
  END IF;
END $$;

-- 3. Create vault_missions
CREATE TABLE IF NOT EXISTS public.vault_missions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.vault_events(id) on delete cascade,
  title text not null,
  description text,
  mission_type text not null,
  target_value integer not null default 1 check (target_value > 0),
  points_reward integer not null default 10 check (points_reward >= 0),
  status text not null default 'active' check (status in ('active', 'inactive')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Create vault_mission_progress
CREATE TABLE IF NOT EXISTS public.vault_mission_progress (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.vault_missions(id) on delete cascade,
  event_id uuid not null references public.vault_events(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  current_value integer not null default 0 check (current_value >= 0),
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(mission_id, player_id)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_vault_missions_event_id ON public.vault_missions(event_id, status);
CREATE INDEX IF NOT EXISTS idx_vault_mission_progress_player_id ON public.vault_mission_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_vault_mission_progress_event_id ON public.vault_mission_progress(event_id);
CREATE INDEX IF NOT EXISTS idx_vault_mission_progress_mission_id ON public.vault_mission_progress(mission_id);

-- RLS vault_missions
ALTER TABLE public.vault_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vault_missions_select_all" ON public.vault_missions FOR SELECT TO authenticated USING (true);

-- RLS vault_mission_progress
ALTER TABLE public.vault_mission_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vault_mission_progress_select_own" ON public.vault_mission_progress FOR SELECT TO authenticated USING (auth.uid() = player_id);
-- Insert/Update should ideally happen via RPCs, but for MVP we might need manual claim or let RPC do it bypassing RLS (security definer)
CREATE POLICY "vault_mission_progress_update_own" ON public.vault_mission_progress FOR UPDATE TO authenticated USING (auth.uid() = player_id) WITH CHECK (auth.uid() = player_id);

-- RPC: join_vault_event
CREATE OR REPLACE FUNCTION public.join_vault_event(p_event_id uuid)
RETURNS table(success boolean, message text, event_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_player_id uuid;
  v_participant_id uuid;
BEGIN
  v_player_id := auth.uid();
  IF v_player_id IS NULL THEN
    RETURN QUERY SELECT false, 'Usuário não autenticado', null::uuid;
    RETURN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.vault_events WHERE id = p_event_id AND status = 'active') THEN
    RETURN QUERY SELECT false, 'Evento inativo ou inexistente', null::uuid;
    RETURN;
  END IF;

  -- Insert participant if not exists
  INSERT INTO public.vault_participants (event_id, player_id)
  VALUES (p_event_id, v_player_id)
  ON CONFLICT ON CONSTRAINT vault_participants_pkey DO NOTHING;

  -- Insert progress for all active missions
  INSERT INTO public.vault_mission_progress (mission_id, event_id, player_id)
  SELECT id, p_event_id, v_player_id
  FROM public.vault_missions
  WHERE event_id = p_event_id AND status = 'active'
  ON CONFLICT (mission_id, player_id) DO NOTHING;

  RETURN QUERY SELECT true, 'Participação confirmada', p_event_id;
END;
$$;

-- RPC: claim_vault_mission_progress
CREATE OR REPLACE FUNCTION public.claim_vault_mission_progress(p_mission_id uuid, p_increment integer default 1)
RETURNS table(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_player_id uuid;
  v_event_id uuid;
  v_target_value integer;
  v_points_reward integer;
  v_current_value integer;
  v_completed boolean;
BEGIN
  v_player_id := auth.uid();
  IF v_player_id IS NULL THEN
    RETURN QUERY SELECT false, 'Usuário não autenticado';
    RETURN;
  END IF;

  -- Get mission details
  SELECT event_id, target_value, points_reward INTO v_event_id, v_target_value, v_points_reward
  FROM public.vault_missions
  WHERE id = p_mission_id AND status = 'active';

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Missão inativa ou não encontrada';
    RETURN;
  END IF;

  -- Check if participant
  IF NOT EXISTS (SELECT 1 FROM public.vault_participants WHERE event_id = v_event_id AND player_id = v_player_id AND status = 'active') THEN
    RETURN QUERY SELECT false, 'Usuário não está participando do evento';
    RETURN;
  END IF;

  -- Get current progress
  SELECT current_value, completed INTO v_current_value, v_completed
  FROM public.vault_mission_progress
  WHERE mission_id = p_mission_id AND player_id = v_player_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Progresso não encontrado para o usuário';
    RETURN;
  END IF;

  IF v_completed THEN
    RETURN QUERY SELECT false, 'Missão já completada';
    RETURN;
  END IF;

  -- Increment progress
  v_current_value := v_current_value + p_increment;
  
  IF v_current_value >= v_target_value THEN
    v_current_value := v_target_value;
    
    -- Mark completed
    UPDATE public.vault_mission_progress
    SET current_value = v_current_value, completed = true, completed_at = now(), updated_at = now()
    WHERE mission_id = p_mission_id AND player_id = v_player_id;

    -- Add points to participant
    UPDATE public.vault_participants
    SET points = points + v_points_reward, updated_at = now()
    WHERE event_id = v_event_id AND player_id = v_player_id;

    -- Add points to event
    UPDATE public.vault_events
    SET current_points = current_points + v_points_reward, updated_at = now()
    WHERE id = v_event_id;

    RETURN QUERY SELECT true, 'Missão completada!';
  ELSE
    -- Just update progress
    UPDATE public.vault_mission_progress
    SET current_value = v_current_value, updated_at = now()
    WHERE mission_id = p_mission_id AND player_id = v_player_id;

    RETURN QUERY SELECT true, 'Progresso registrado';
  END IF;
END;
$$;

-- Seed Beta Vault Event if none active
DO $$
DECLARE
  v_event_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.vault_events WHERE status = 'active') THEN
    INSERT INTO public.vault_events (
      title, description, prize_label, prize_value, prize_pool, status, goal_points, ends_at
    ) VALUES (
      'Operação Cofre Beta',
      'Complete contratos, participe de lobbies e acumule pontos para desbloquear recompensas.',
      'Loot Beta Duo Loot',
      100,
      100,
      'active',
      1000,
      now() + interval '7 days'
    ) RETURNING id INTO v_event_id;

    -- Seed Missions
    INSERT INTO public.vault_missions (event_id, title, description, mission_type, target_value, points_reward)
    VALUES 
      (v_event_id, 'Completar perfil gamer', 'Configure seu perfil competitivo completo para o matchmaking.', 'complete_profile', 1, 100),
      (v_event_id, 'Entrar em um lobby', 'Entre ou crie um lobby real na área de Lobbies.', 'join_lobby', 1, 80),
      (v_event_id, 'Enviar convite para duo', 'Convide alguém para jogar na sua rede de conexões.', 'send_invite', 1, 60),
      (v_event_id, 'Check-in diário', 'Entre na plataforma diariamente para acumular pontos.', 'daily_checkin', 1, 30);
  END IF;
END;
$$;
