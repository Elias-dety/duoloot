-- DUO LOOT - MIGRATION 015
-- Infraestrutura de chat entre conexões de jogadores

-- 1. Tabela de mensagens
CREATE TABLE IF NOT EXISTS public.connection_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid NOT NULL REFERENCES public.player_connections(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz,
  
  CONSTRAINT body_not_empty CHECK (length(trim(body)) > 0),
  CONSTRAINT body_length CHECK (length(body) <= 1000)
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_messages_connection_created ON public.connection_messages (connection_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.connection_messages (sender_id);

-- 3. RLS e Políticas
ALTER TABLE public.connection_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'connection_messages' AND policyname = 'Users can view messages from their connections'
  ) THEN
    CREATE POLICY "Users can view messages from their connections"
    ON public.connection_messages
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.player_connections pc
        WHERE pc.id = connection_id
        AND (pc.player_a_id = auth.uid() OR pc.player_b_id = auth.uid())
      )
    );
  END IF;
END $$;

-- 4. RPC para enviar mensagens
CREATE OR REPLACE FUNCTION public.send_connection_message(
  p_connection_id uuid,
  p_body text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_message_id uuid;
  v_is_participant boolean;
  v_body text;
BEGIN
  v_user_id := auth.uid();
  v_body := trim(p_body);

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Usuário não autenticado.');
  END IF;

  IF length(v_body) < 1 OR length(v_body) > 1000 THEN
    RETURN json_build_object('success', false, 'message', 'A mensagem deve ter entre 1 e 1000 caracteres.');
  END IF;

  -- Validar participação e status da conexão
  SELECT EXISTS (
    SELECT 1 FROM public.player_connections
    WHERE id = p_connection_id
    AND status = 'active'
    AND (player_a_id = v_user_id OR player_b_id = v_user_id)
  ) INTO v_is_participant;

  IF NOT v_is_participant THEN
    RETURN json_build_object('success', false, 'message', 'Você não tem permissão para enviar mensagens nesta conexão.');
  END IF;

  INSERT INTO public.connection_messages (
    connection_id,
    sender_id,
    body
  )
  VALUES (
    p_connection_id,
    v_user_id,
    v_body
  )
  RETURNING id INTO v_message_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Mensagem enviada.',
    'message_id', v_message_id
  );
END;
$$;

-- 5. RPC para buscar mensagens da conexão
CREATE OR REPLACE FUNCTION public.get_connection_messages(
  p_connection_id uuid,
  p_limit int DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  connection_id uuid,
  sender_id uuid,
  sender_nickname text,
  sender_avatar_url text,
  body text,
  created_at timestamptz,
  read_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Validar participação antes de retornar
  SELECT 
    m.id,
    m.connection_id,
    m.sender_id,
    p.nickname as sender_nickname,
    p.avatar_url as sender_avatar_url,
    m.body,
    m.created_at,
    m.read_at
  FROM public.connection_messages m
  JOIN public.profiles p ON p.id = m.sender_id
  WHERE m.connection_id = p_connection_id
    AND EXISTS (
      SELECT 1 FROM public.player_connections pc
      WHERE pc.id = p_connection_id
      AND (pc.player_a_id = auth.uid() OR pc.player_b_id = auth.uid())
    )
  ORDER BY m.created_at ASC
  LIMIT LEAST(p_limit, 100);
$$;

-- 6. Habilitar Realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'connection_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.connection_messages;
  END IF;
END $$;
;
