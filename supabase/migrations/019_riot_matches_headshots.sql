-- Adicionar colunas headshots e rounds_played para cálculo real de headshot rate
ALTER TABLE public.riot_matches ADD COLUMN IF NOT EXISTS headshots INTEGER DEFAULT 0;
ALTER TABLE public.riot_matches ADD COLUMN IF NOT EXISTS rounds_played INTEGER DEFAULT 0;

-- Índice para buscas por riot_account_id + played_at (histórico recente)
CREATE INDEX IF NOT EXISTS idx_riot_matches_account_played
ON public.riot_matches (riot_account_id, played_at DESC);
