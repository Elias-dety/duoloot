-- DUO LOOT - MIGRATION 007
-- Habilita Realtime para o Cofre

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'vault_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.vault_events;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'vault_participants'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.vault_participants;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'vault_submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.vault_submissions;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'vault_winners'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.vault_winners;
  END IF;
END $$;
