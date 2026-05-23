import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    if (!code) {
      return new Response(JSON.stringify({ error: "No code provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase env vars");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clientId = Deno.env.get("RIOT_CLIENT_ID");
    const clientSecret = Deno.env.get("RIOT_CLIENT_SECRET");
    const redirectUri = Deno.env.get("RIOT_REDIRECT_URI");

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("Missing RSO env vars");
      return new Response(JSON.stringify({ error: "Internal Configuration Error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    });

    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    const tokenResponse = await fetch("https://auth.riotgames.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Riot token error:", errorData);
      return new Response(JSON.stringify({ error: "Failed to exchange token" }), {
        status: tokenResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    const meResponse = await fetch("https://americas.api.riotgames.com/riot/account/v1/accounts/me", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!meResponse.ok) {
      const errorData = await meResponse.text();
      console.error("Riot me error:", errorData);
      return new Response(JSON.stringify({ error: "Failed to fetch account data" }), {
        status: meResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const meData = await meResponse.json();
    const puuid = meData.puuid;
    const gameName = meData.gameName;
    const tagLine = meData.tagLine;

    const { error: dbError } = await supabase
      .from("riot_connections")
      .upsert({
        profile_id: user.id,
        puuid: puuid,
        game_name: gameName,
        tag_line: tagLine,
        access_token_hash: accessToken,
        refresh_token_hash: refreshToken,
        scopes: tokenData.scope ? tokenData.scope.split(" ") : [],
        consent_given_at: new Date().toISOString(),
      }, {
        onConflict: "profile_id",
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(JSON.stringify({ error: "Failed to save connection data" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, gameName, tagLine }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Unhandled error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
