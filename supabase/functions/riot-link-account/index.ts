import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';
import { corsHeaders } from '../_shared/cors.ts';

// Supabase environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// Riot API Key
const riotApiKey = Deno.env.get('RIOT_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!riotApiKey) {
      throw new Error('RIOT_API_KEY não configurada no servidor.');
    }

    const authHeader = req.headers.get('Authorization')!;
    if (!authHeader) {
      throw new Error('Acesso não autorizado. Header ausente.');
    }

    const { gameName, tagLine } = await req.json();
    if (!gameName || !tagLine) {
      throw new Error('gameName e tagLine são obrigatórios.');
    }

    // Initialize Supabase Client with service role to bypass RLS internally for upsert
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Token inválido ou expirado.');
    }

    // 1. Chamar a API da Riot para buscar o PUUID
    // AMERICAS endpoint handles most Riot IDs globally for Account-V1
    const riotResponse = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      {
        headers: {
          'X-Riot-Token': riotApiKey,
        },
      }
    );

    if (!riotResponse.ok) {
      const errText = await riotResponse.text();
      console.error('Erro Riot API:', errText);
      throw new Error(`Não foi possível encontrar a conta na Riot. Status: ${riotResponse.status}`);
    }

    const riotData = await riotResponse.json();
    const puuid = riotData.puuid;
    const resolvedGameName = riotData.gameName;
    const resolvedTagLine = riotData.tagLine;

    // 2. Salvar/Atualizar no banco de dados (riot_accounts)
    const { data: upsertData, error: upsertError } = await supabase
      .from('riot_accounts')
      .upsert({
        profile_id: user.id,
        puuid: puuid,
        game_name: resolvedGameName,
        tag_line: resolvedTagLine,
        last_sync_at: new Date().toISOString(),
      }, { onConflict: 'profile_id' })
      .select()
      .single();

    if (upsertError) {
      throw new Error(`Erro ao salvar no banco: ${upsertError.message}`);
    }

    return new Response(
      JSON.stringify({ message: 'Conta vinculada com sucesso.', account: upsertData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
