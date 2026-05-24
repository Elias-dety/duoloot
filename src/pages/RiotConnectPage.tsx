import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { lookupValorantProfile, isValorantApiError } from '@/services/valorant';

export default function RiotConnectPage() {
  const navigate = useNavigate();
  const [riotId, setRiotId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleConnect = async () => {
    setError('');

    const match = riotId.trim().match(/^(.+)#(.+)$/);
    if (!match) {
      setError('Formato inválido. Use Nome#TAG.');
      return;
    }

    const gameName = match[1].trim();
    const tagLine = match[2].trim();

    setLoading(true);

    try {
      await lookupValorantProfile({
        gameName,
        tagLine,
        region: 'americas',
        platform: 'br',
      });

      setSuccess(true);

      setTimeout(() => {
        navigate(`/riot/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      }, 900);
    } catch (err) {
      setError(isValorantApiError(err) ? err.message : 'Erro ao validar conta Riot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-center">
      <div className="dl-card flex w-full max-w-md flex-col items-center p-8">
        <h1 className="dl-title mb-4 text-2xl">Conectar conta Riot</h1>
        <p className="dl-muted mb-6 text-sm">
          Insira seu Riot ID para validar suas estatísticas e abrir o perfil.
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl text-[var(--dl-string)]">✓</div>
            <p className="font-bold text-white">Perfil Riot validado com sucesso!</p>
            <p className="text-[12px] text-[var(--dl-muted-light)]">Redirecionando...</p>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4">
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
              {loading ? 'Validando...' : 'Validar Riot ID'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
