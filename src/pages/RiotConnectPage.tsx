import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms';

export default function RiotConnectPage() {
  const navigate = useNavigate();
  const [riotId, setRiotId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleConnect = async () => {
    setError('');
    
    // Validate Name#TAG format
    const match = riotId.match(/^(.+)#(.+)$/);
    if (!match) {
      setError('Formato inválido. Use Nome#TAG.');
      return;
    }

    const gameName = match[1];
    const tagLine = match[2];

    setLoading(true);

    try {
      // Mock network delay
      await new Promise(r => setTimeout(r, 800));
      
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate(`/riot/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      }, 1500);

    } catch {
      setError('Erro ao conectar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-center">
      <div className="dl-card flex flex-col items-center p-8 max-w-md w-full">
        <h1 className="dl-title mb-4 text-2xl">Conectar conta Riot</h1>
        <p className="dl-muted text-sm mb-6">
          Insira seu Riot ID para vincular suas estatísticas. (Mock Seguro)
        </p>
        
        {/* TODO: Chamadas reais da Riot devem passar pelo backend/serverless (RSO) */}
        
        {success ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-[var(--dl-string)] text-4xl">✓</div>
            <p className="text-white font-bold">Conta vinculada com sucesso!</p>
            <p className="text-[12px] text-[var(--dl-muted-light)]">Redirecionando...</p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome#TAG"
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              className="w-full rounded-md border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3 text-white placeholder-[var(--dl-muted-light)] outline-none focus:border-[var(--dl-keyword)]"
            />
            {error && <p className="text-[12px] text-[var(--dl-error)]">{error}</p>}
            
            <Button 
              variant="primary" 
              onClick={handleConnect}
              disabled={loading || !riotId.includes('#')}
              className="w-full justify-center"
            >
              {loading ? 'Conectando...' : 'Vincular Conta'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
