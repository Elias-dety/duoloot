-- DUO LOOT - MIGRATION 024
-- Garante a coluna usada pelo formulario de perfil gamer.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS game_profile jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.profiles.game_profile IS
  'Dados do perfil gamer preenchidos no onboarding/configuracoes de perfil.';

NOTIFY pgrst, 'reload schema';
