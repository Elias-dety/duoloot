-- Migration: 021_add_missing_database_tables_and_columns
-- Objetivo: Garantir tabelas e colunas sugeridas na Parte 7 com RLS ativado e segurança reforçada.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ==========================================
-- 1. PROFILES
-- ==========================================

-- Adiciona novas colunas caso não existam
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS game_profile jsonb DEFAULT '{}'::jsonb;

-- Atualiza dados legados se houver registros
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;
UPDATE public.profiles SET display_name = name WHERE display_name IS NULL;

-- Trigger para garantir que novos inserts ou updates sincronizem id/user_id e name/display_name
CREATE OR REPLACE FUNCTION public.sync_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := NEW.id;
  END IF;
  IF NEW.display_name IS NULL THEN
    NEW.display_name := NEW.name;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_profile_columns ON public.profiles;
CREATE TRIGGER trg_sync_profile_columns
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_columns();


-- ==========================================
-- 2. LOBBIES
-- ==========================================

-- Adiciona a coluna metadata se não existir
ALTER TABLE public.lobbies ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Política de RLS para exclusão de lobbies pelo próprio dono
DROP POLICY IF EXISTS "lobbies_delete_owner" ON public.lobbies;
CREATE POLICY "lobbies_delete_owner"
ON public.lobbies
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);


-- ==========================================
-- 3. LOBBY_MEMBERS
-- ==========================================

-- Adiciona colunas se não existirem
ALTER TABLE public.lobby_members ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE public.lobby_members ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.lobby_members ADD COLUMN IF NOT EXISTS role text DEFAULT 'member';

-- Sincroniza dados antigos
UPDATE public.lobby_members SET user_id = player_id WHERE user_id IS NULL;

-- Trigger para preencher user_id a partir do player_id se vier nulo
CREATE OR REPLACE FUNCTION public.sync_lobby_members_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := NEW.player_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_lobby_members_columns ON public.lobby_members;
CREATE TRIGGER trg_sync_lobby_members_columns
BEFORE INSERT OR UPDATE ON public.lobby_members
FOR EACH ROW EXECUTE FUNCTION public.sync_lobby_members_columns();

-- Política RLS permitindo que o owner do lobby remova (kick) membros
DROP POLICY IF EXISTS "lobby_members_delete_owner" ON public.lobby_members;
CREATE POLICY "lobby_members_delete_owner"
ON public.lobby_members
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.lobbies
    WHERE lobbies.id = lobby_members.lobby_id
      AND lobbies.owner_id = auth.uid()
  )
);


-- ==========================================
-- 4. USER_SUBSCRIPTIONS (NOVA TABELA)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  plan text NOT NULL,
  status text NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política: Usuário pode consultar sua própria assinatura
DROP POLICY IF EXISTS "user_subscriptions_select_own" ON public.user_subscriptions;
CREATE POLICY "user_subscriptions_select_own"
ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para fins de desenvolvimento/testes locais (permitindo manipulação)
DROP POLICY IF EXISTS "user_subscriptions_manage_own" ON public.user_subscriptions;
CREATE POLICY "user_subscriptions_manage_own"
ON public.user_subscriptions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger de updated_at para user_subscriptions
DROP TRIGGER IF EXISTS handle_updated_at_user_subscriptions ON public.user_subscriptions;
CREATE TRIGGER handle_updated_at_user_subscriptions
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();


-- ==========================================
-- 5. RIOT_CONNECTIONS
-- ==========================================

-- Adiciona novas colunas caso não existam
ALTER TABLE public.riot_connections ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.riot_connections ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE public.riot_connections ADD COLUMN IF NOT EXISTS platform text;
ALTER TABLE public.riot_connections ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- Sincroniza dados antigos
UPDATE public.riot_connections SET user_id = profile_id WHERE user_id IS NULL;

-- Trigger para garantir consistência entre profile_id e user_id
CREATE OR REPLACE FUNCTION public.sync_riot_connections_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := NEW.profile_id;
  END IF;
  IF NEW.profile_id IS NULL THEN
    NEW.profile_id := NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_riot_connections_columns ON public.riot_connections;
CREATE TRIGGER trg_sync_riot_connections_columns
BEFORE INSERT OR UPDATE ON public.riot_connections
FOR EACH ROW EXECUTE FUNCTION public.sync_riot_connections_columns();
