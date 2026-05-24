CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create riot_accounts table
CREATE TABLE IF NOT EXISTS public.riot_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    puuid TEXT NOT NULL UNIQUE,
    game_name TEXT NOT NULL,
    tag_line TEXT NOT NULL,
    region TEXT,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create riot_stats table
CREATE TABLE IF NOT EXISTS public.riot_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    riot_account_id UUID NOT NULL REFERENCES public.riot_accounts(id) ON DELETE CASCADE UNIQUE,
    matches_analyzed INTEGER DEFAULT 0,
    win_rate NUMERIC(5, 2) DEFAULT 0.0,
    kda NUMERIC(5, 2) DEFAULT 0.0,
    headshot_rate NUMERIC(5, 2) DEFAULT 0.0,
    average_score NUMERIC(8, 2) DEFAULT 0.0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    current_rank TEXT,
    agent_stats JSONB DEFAULT '[]'::jsonb,
    map_stats JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create riot_matches table
CREATE TABLE IF NOT EXISTS public.riot_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    riot_account_id UUID NOT NULL REFERENCES public.riot_accounts(id) ON DELETE CASCADE,
    match_id TEXT NOT NULL,
    map TEXT NOT NULL,
    agent TEXT NOT NULL,
    agent_image_url TEXT,
    result TEXT NOT NULL CHECK (result IN ('VICTORY', 'DEFEAT', 'DRAW')),
    score TEXT,
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    combat_score INTEGER DEFAULT 0,
    played_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(riot_account_id, match_id)
);

-- Set up RLS
ALTER TABLE public.riot_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riot_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riot_matches ENABLE ROW LEVEL SECURITY;

-- riot_accounts policies
-- Everyone can read riot_accounts to view other players' connected accounts
CREATE POLICY "riot_accounts_select_policy" 
ON public.riot_accounts FOR SELECT 
USING (true);

-- Users can insert/update their own riot_accounts (until Edge Function fully takes over, if necessary)
-- Though ideally, only edge functions (service role) should create/update based on Riot auth.
-- But let's allow the owner for now for easy testing.
CREATE POLICY "riot_accounts_insert_policy"
ON public.riot_accounts FOR INSERT
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "riot_accounts_update_policy"
ON public.riot_accounts FOR UPDATE
USING (auth.uid() = profile_id);

CREATE POLICY "riot_accounts_delete_policy"
ON public.riot_accounts FOR DELETE
USING (auth.uid() = profile_id);


-- riot_stats policies
-- Everyone can view stats
CREATE POLICY "riot_stats_select_policy" 
ON public.riot_stats FOR SELECT 
USING (true);

-- Insert/Update should ideally be service_role only. 
-- For now, allow the owner of the linked riot_account to mutate (or edge function).
CREATE POLICY "riot_stats_all_policy"
ON public.riot_stats FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.riot_accounts ra 
        WHERE ra.id = riot_account_id AND ra.profile_id = auth.uid()
    )
);

-- riot_matches policies
-- Everyone can view matches
CREATE POLICY "riot_matches_select_policy" 
ON public.riot_matches FOR SELECT 
USING (true);

CREATE POLICY "riot_matches_all_policy"
ON public.riot_matches FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.riot_accounts ra 
        WHERE ra.id = riot_account_id AND ra.profile_id = auth.uid()
    )
);

-- Trigger for updated_at on riot_stats
DROP TRIGGER IF EXISTS handle_updated_at ON public.riot_stats;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.riot_stats
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
