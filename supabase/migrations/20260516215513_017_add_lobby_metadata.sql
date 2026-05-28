ALTER TABLE public.lobbies ADD COLUMN IF NOT EXISTS metadata jsonb default '{}'::jsonb;;
