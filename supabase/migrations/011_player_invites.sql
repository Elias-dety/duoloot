-- DUO LOOT - MIGRATION 011
-- Sistema de Convites entre Jogadores

-- 1. Enum de Status
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'player_invite_status') THEN
        CREATE TYPE player_invite_status AS ENUM ('pending', 'accepted', 'declined', 'cancelled');
    END IF;
END $$;

-- 2. Tabela de Convites
CREATE TABLE IF NOT EXISTS public.player_invites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status player_invite_status DEFAULT 'pending' NOT NULL,
    message text,
    created_at timestamptz DEFAULT now() NOT NULL,
    responded_at timestamptz,
    CONSTRAINT sender_not_receiver CHECK (sender_id <> receiver_id)
);

-- 3. Índice Único Parcial (Evitar convites pendentes duplicados entre os mesmos dois usuários)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_invite 
ON public.player_invites (sender_id, receiver_id) 
WHERE status = 'pending';

-- 4. RLS
ALTER TABLE public.player_invites ENABLE ROW LEVEL SECURITY;

-- Ver convites: onde sou remetente ou destinatário
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own invites') THEN
        CREATE POLICY "Users can view their own invites" 
        ON public.player_invites FOR SELECT 
        USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
    END IF;
END $$;

-- Inserir convites: apenas como remetente
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can send invites') THEN
        CREATE POLICY "Users can send invites" 
        ON public.player_invites FOR INSERT 
        WITH CHECK (auth.uid() = sender_id);
    END IF;
END $$;

-- Atualizar convites: apenas como destinatário (para aceitar/recusar) ou remetente (para cancelar)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their invites') THEN
        CREATE POLICY "Users can update their invites" 
        ON public.player_invites FOR UPDATE 
        USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
    END IF;
END $$;

-- 5. RPC: Enviar Convite
CREATE OR REPLACE FUNCTION public.send_player_invite(
    p_receiver_id uuid,
    p_message text DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_sender_id uuid;
    v_invite_id uuid;
BEGIN
    v_sender_id := auth.uid();
    
    -- Validar autenticação
    IF v_sender_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Usuário não autenticado.');
    END IF;

    -- Validar não convidar a si mesmo
    IF v_sender_id = p_receiver_id THEN
        RETURN json_build_object('success', false, 'message', 'Você não pode convidar a si mesmo.');
    END IF;

    -- Validar se destinatário existe
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_receiver_id) THEN
        RETURN json_build_object('success', false, 'message', 'Jogador não encontrado.');
    END IF;

    -- Tentar inserir (o índice único tratará duplicatas se necessário, mas podemos checar antes para retorno amigável)
    IF EXISTS (SELECT 1 FROM public.player_invites WHERE sender_id = v_sender_id AND receiver_id = p_receiver_id AND status = 'pending') THEN
        RETURN json_build_object('success', false, 'message', 'Já existe um convite pendente para este jogador.');
    END IF;

    INSERT INTO public.player_invites (sender_id, receiver_id, message)
    VALUES (v_sender_id, p_receiver_id, p_message)
    RETURNING id INTO v_invite_id;

    RETURN json_build_object(
        'success', true, 
        'message', 'Convite enviado com sucesso.', 
        'invite_id', v_invite_id
    );
EXCEPTION WHEN others THEN
    RETURN json_build_object('success', false, 'message', 'Erro ao enviar convite: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC: Responder Convite
CREATE OR REPLACE FUNCTION public.respond_player_invite(
    p_invite_id uuid,
    p_status player_invite_status
)
RETURNS JSON AS $$
DECLARE
    v_user_id uuid;
    v_current_status player_invite_status;
    v_receiver_id uuid;
BEGIN
    v_user_id := auth.uid();
    
    -- Validar status permitido (apenas accepted ou declined via RPC)
    IF p_status NOT IN ('accepted', 'declined') THEN
        RETURN json_build_object('success', false, 'message', 'Status inválido.');
    END IF;

    -- Buscar convite
    SELECT status, receiver_id INTO v_current_status, v_receiver_id
    FROM public.player_invites
    WHERE id = p_invite_id;

    IF v_current_status IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Convite não encontrado.');
    END IF;

    -- Validar se é o destinatário
    IF v_receiver_id <> v_user_id THEN
        RETURN json_build_object('success', false, 'message', 'Apenas o destinatário pode responder.');
    END IF;

    -- Validar se está pendente
    IF v_current_status <> 'pending' THEN
        RETURN json_build_object('success', false, 'message', 'Este convite já foi processado.');
    END IF;

    UPDATE public.player_invites
    SET status = p_status, responded_at = now()
    WHERE id = p_invite_id;

    RETURN json_build_object(
        'success', true, 
        'message', 'Resposta registrada.', 
        'invite_id', p_invite_id,
        'status', p_status
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
