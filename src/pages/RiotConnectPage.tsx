import { useEffect } from 'react';

export default function RiotConnectPage() {
  useEffect(() => {
    // We redirect the user to Riot's authorization endpoint
    const clientId = import.meta.env.VITE_RIOT_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_RIOT_REDIRECT_URI || `${window.location.origin}/riot/callback`;
    
    // We can generate a random state here if we want to prevent CSRF, 
    // but for this MVP we'll just redirect.
    // const state = btoa(new Date().getTime().toString());
    
    const riotAuthUrl = new URL('https://auth.riotgames.com/authorize');
    riotAuthUrl.searchParams.append('client_id', clientId || 'YOUR_CLIENT_ID');
    riotAuthUrl.searchParams.append('redirect_uri', redirectUri);
    riotAuthUrl.searchParams.append('response_type', 'code');
    riotAuthUrl.searchParams.append('scope', 'openid offline_access cpid');
    
    if (!clientId) {
      console.warn("VITE_RIOT_CLIENT_ID not found. RSO might not work correctly.");
    }

    // Redirect to Riot
    window.location.href = riotAuthUrl.toString();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-center">
      <div className="dl-card flex flex-col items-center p-8 max-w-md w-full">
        <h1 className="dl-title mb-4 text-2xl">Redirecionando para a Riot...</h1>
        <p className="dl-muted text-sm mb-6">
          Você está sendo levado para o portal de login da Riot Games de forma segura.
        </p>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--dl-keyword)] border-t-transparent"></div>
      </div>
    </div>
  );
}
