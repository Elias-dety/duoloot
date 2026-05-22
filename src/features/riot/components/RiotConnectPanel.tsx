import React, { useState } from 'react';
import { DuolootCard, DuolootButton } from '@/components/duoloot';
import { Input } from '@/components/atoms';

export function RiotConnectPanel() {
  const [riotId, setRiotId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular requisição
    setTimeout(() => {
      setIsLoading(false);
      console.log('Riot ID conectado:', riotId);
    }, 1500);
  };

  return (
    <DuolootCard variant="elevated" className="max-w-md w-full mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-2">Conectar Conta Riot</h3>
        <p className="text-sm text-[var(--dl-muted-light)]">
          Vincule seu Riot ID para sincronizar estatísticas reais, histórico de partidas e habilitar recompensas do Cofre.
        </p>
      </div>

      <form onSubmit={handleConnect} className="space-y-4">
        <div>
          <label htmlFor="riotId" className="block text-xs font-bold uppercase tracking-wider text-[var(--dl-muted-light)] mb-2">
            Riot ID (Ex: Player#BR1)
          </label>
          <Input
            id="riotId"
            type="text"
            placeholder="Nome#Tag"
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
            required
            pattern="^.+#.+$"
            title="Formato exigido: Nome#Tagline"
          />
        </div>

        <DuolootButton
          type="submit"
          variant="primary"
          fullWidth
          disabled={!riotId.includes('#') || isLoading}
        >
          {isLoading ? 'Conectando...' : 'Vincular Conta'}
        </DuolootButton>
      </form>

      <div className="mt-4 text-center">
        <p className="text-[10px] text-[var(--dl-muted)] uppercase tracking-wider">
          Ao conectar, você autoriza o Duo Loot a ler suas estatísticas públicas da Riot Games.
        </p>
      </div>
    </DuolootCard>
  );
}
