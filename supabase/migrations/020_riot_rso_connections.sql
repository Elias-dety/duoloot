CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create riot_connections table
CREATE TABLE IF NOT EXISTS public.riot_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    puuid TEXT NOT NULL UNIQUE,
    game_name TEXT NOT NULL,
    tag_line TEXT NOT NULL,
    access_token_hash TEXT,
    refresh_token_hash TEXT,
    scopes TEXT[],
    consent_given_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure a profile can only have one Riot connection for now
CREATE UNIQUE INDEX IF NOT EXISTS idx_riot_connections_profile_id ON public.riot_connections(profile_id);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS handle_updated_at_riot_connections ON public.riot_connections;
CREATE TRIGGER handle_updated_at_riot_connections
  BEFORE UPDATE ON public.riot_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Set up Row Level Security
ALTER TABLE public.riot_connections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own connections
CREATE POLICY "Users can view their own riot connections"
  ON public.riot_connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

-- Policy: Users can delete their own connections (disconnect)
CREATE POLICY "Users can delete their own riot connections"
  ON public.riot_connections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = profile_id);

-- Note: INSERT and UPDATE should be handled via secure Edge Functions (Service Role)
