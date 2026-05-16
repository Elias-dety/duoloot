-- DUO LOOT - MIGRATION 016
-- Controle de mensagens não lidas por conexão

-- 1. RPC para marcar mensagens como lidas
CREATE OR REPLACE FUNCTION public.mark_connection_messages_as_read(
  p_connection_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_updated_count int;
  v_is_participant boolean;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Usuário não autenticado.');
  END IF;

  -- Validar participação
  SELECT EXISTS (
    SELECT 1 FROM public.player_connections
    WHERE id = p_connection_id
    AND (player_a_id = v_user_id OR player_b_id = v_user_id)
  ) INTO v_is_participant;

  IF NOT v_is_participant THEN
    RETURN json_build_object('success', false, 'message', 'Permissão negada.');
  END IF;

  UPDATE public.connection_messages
  SET read_at = now()
  WHERE connection_id = p_connection_id
    AND sender_id <> v_user_id
    AND read_at IS NULL;
    
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;

  RETURN json_build_object(
    'success', true,
    'message', 'Mensagens marcadas como lidas.',
    'updated_count', v_updated_count
  );
END;
$$;

-- 2. RPC para listar conexões com contagem de não lidas
CREATE OR REPLACE FUNCTION public.get_my_connections_with_unread()
RETURNS TABLE (
  connection_id uuid,
  player_id uuid,
  name text,
  nickname text,
  avatar_url text,
  trust_score int,
  status player_connection_status,
  created_at timestamptz,
  unread_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH my_connections AS (
    SELECT 
      pc.id as conn_id,
      pc.created_at as conn_created_at,
      pc.status as conn_status,
      CASE 
        WHEN pc.player_a_id = auth.uid() THEN pc.player_b_id
        ELSE pc.player_a_id
      END as other_player_id
    FROM public.player_connections pc
    WHERE (pc.player_a_id = auth.uid() OR pc.player_b_id = auth.uid())
      AND pc.status = 'active'
  )
  SELECT 
    mc.conn_id as connection_id,
    p.id as player_id,
    p.name,
    p.nickname,
    p.avatar_url,
    p.trust_score,
    mc.conn_status as status,
    mc.conn_created_at as created_at,
    (
      SELECT count(*)
      FROM public.connection_messages cm
      WHERE cm.connection_id = mc.conn_id
        AND cm.sender_id = mc.other_player_id
        AND cm.read_at IS NULL
    ) as unread_count
  FROM my_connections mc
  JOIN public.profiles p ON p.id = mc.other_player_id
  ORDER BY unread_count DESC, mc.conn_created_at DESC;
$$;
