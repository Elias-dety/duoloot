-- DUO LOOT - MIGRATION 012
-- Habilita Realtime para convites de jogadores

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'player_invites'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.player_invites;
  END IF;
END $$;
