-- DUO LOOT - MIGRATION 014
-- Gerenciamento de conexões entre jogadores (Amizades/Duo)

-- 1. Enum de status da conexão
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'player_connection_status') THEN
    CREATE TYPE player_connection_status AS ENUM ('active', 'blocked', 'removed');
  END IF;
END $$;

-- 2. Tabela de conexões
CREATE TABLE IF NOT EXISTS public.player_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_a_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  player_b_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_invite_id uuid REFERENCES public.player_invites(id) ON DELETE SET NULL,
  status player_connection_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Garantir que player_a_id < player_b_id para evitar duplicidade invertida
  CONSTRAINT stable_ordering CHECK (player_a_id < player_b_id),
  -- Garantir que não se conecte consigo mesmo (implícito pelo < mas bom reforçar)
  CONSTRAINT no_self_connection CHECK (player_a_id <> player_b_id)
);

-- 3. Índice único para conexões ativas
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_connection 
ON public.player_connections (player_a_id, player_b_id) 
WHERE status = 'active';

-- 4. RLS e Políticas
ALTER TABLE public.player_connections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'player_connections' AND policyname = 'Players can view their own connections'
  ) THEN
    CREATE POLICY "Players can view their own connections"
    ON public.player_connections
    FOR SELECT
    USING (auth.uid() = player_a_id OR auth.uid() = player_b_id);
  END IF;
END $$;

-- 5. Atualizar RPC respond_player_invite para criar conexão ao aceitar
CREATE OR REPLACE FUNCTION public.respond_player_invite(
  p_invite_id uuid,
  p_status player_invite_status
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_current_status player_invite_status;
  v_receiver_id uuid;
  v_sender_id uuid;
  v_player_a uuid;
  v_player_b uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Usuário não autenticado.');
  END IF;

  IF p_status NOT IN ('accepted', 'declined') THEN
    RETURN json_build_object('success', false, 'message', 'Status inválido.');
  END IF;

  SELECT status, receiver_id, sender_id
  INTO v_current_status, v_receiver_id, v_sender_id
  FROM public.player_invites
  WHERE id = p_invite_id;

  IF v_current_status IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Convite não encontrado.');
  END IF;

  IF v_receiver_id <> v_user_id THEN
    RETURN json_build_object('success', false, 'message', 'Apenas o destinatário pode responder.');
  END IF;

  IF v_current_status <> 'pending' THEN
    RETURN json_build_object('success', false, 'message', 'Este convite já foi processado.');
  END IF;

  -- 1. Atualizar o convite
  UPDATE public.player_invites
  SET status = p_status,
      responded_at = now()
  WHERE id = p_invite_id;

  -- 2. Se aceito, criar conexão
  IF p_status = 'accepted' THEN
    -- Ordem estável para cumprir a constraint player_a_id < player_b_id
    IF v_sender_id < v_receiver_id THEN
      v_player_a := v_sender_id;
      v_player_b := v_receiver_id;
    ELSE
      v_player_a := v_receiver_id;
      v_player_b := v_sender_id;
    END IF;

    INSERT INTO public.player_connections (
      player_a_id,
      player_b_id,
      source_invite_id,
      status
    )
    VALUES (
      v_player_a,
      v_player_b,
      p_invite_id,
      'active'
    )
    ON CONFLICT (player_a_id, player_b_id) WHERE status = 'active'
    DO NOTHING;
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', CASE WHEN p_status = 'accepted' THEN 'Convite aceito e conexão estabelecida.' ELSE 'Convite recusado.' END,
    'invite_id', p_invite_id,
    'status', p_status
  );
END;
$$;

-- 6. RPC para buscar conexões do usuário
CREATE OR REPLACE FUNCTION public.get_my_connections()
RETURNS TABLE (
  connection_id uuid,
  player_id uuid,
  name text,
  nickname text,
  avatar_url text,
  trust_score int,
  status player_connection_status,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pc.id AS connection_id,
    CASE
      WHEN pc.player_a_id = auth.uid() THEN p_b.id
      ELSE p_a.id
    END AS player_id,
    CASE
      WHEN pc.player_a_id = auth.uid() THEN p_b.name
      ELSE p_a.name
    END AS name,
    CASE
      WHEN pc.player_a_id = auth.uid() THEN p_b.nickname
      ELSE p_a.nickname
    END AS nickname,
    CASE
      WHEN pc.player_a_id = auth.uid() THEN p_b.avatar_url
      ELSE p_a.avatar_url
    END AS avatar_url,
    CASE
      WHEN pc.player_a_id = auth.uid() THEN p_b.trust_score
      ELSE p_a.trust_score
    END AS trust_score,
    pc.status,
    pc.created_at
  FROM public.player_connections pc
  JOIN public.profiles p_a ON p_a.id = pc.player_a_id
  JOIN public.profiles p_b ON p_b.id = pc.player_b_id
  WHERE pc.status = 'active'
    AND (pc.player_a_id = auth.uid() OR pc.player_b_id = auth.uid());
$$;
