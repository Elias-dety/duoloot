-- DUO LOOT - MIGRATION 006
-- Habilita Realtime para as tabelas de lobby

-- Tenta adicionar a tabela lobbies à publicação supabase_realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'lobbies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lobbies;
  END IF;
END $$;

-- Tenta adicionar a tabela lobby_members à publicação supabase_realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'lobby_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lobby_members;
  END IF;
END $$;;
