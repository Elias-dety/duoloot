import React from 'react';
import { LobbyGrid } from '@/components/organisms/LobbyGrid';
import { LobbyActionsBar } from '@/features/lobby/components/LobbyActionsBar';
import { LobbyFilters } from '@/features/lobby/components/LobbyFilters';
import { Lobby } from '@/schemas/lobby.schema';

export interface LobbyTemplateProps {
  lobbies: Lobby[];
  isLoading: boolean;
  isError: boolean;
  onJoinLobby?: (id: string) => void;
  onCreateTestLobby?: () => void;
  isCreating?: boolean;
  joiningLobbyId?: string | null;
  errorMessage?: string | null;
}

const readMetadataString = (metadata: Record<string, unknown> | undefined, key: string) =>
  typeof metadata?.[key] === 'string' ? String(metadata[key]) : '';

const readMetadataBoolean = (metadata: Record<string, unknown> | undefined, key: string) =>
  typeof metadata?.[key] === 'boolean' ? Boolean(metadata[key]) : undefined;

export const LobbyTemplate: React.FC<LobbyTemplateProps> = ({
  lobbies,
  isLoading,
  isError,
  onJoinLobby,
  onCreateTestLobby,
  isCreating,
  joiningLobbyId,
  errorMessage,
}) => {
  const [filters, setFilters] = React.useState({
    search: '',
    game: 'all',
    rank: 'all',
    region: 'all',
    microphone: 'all',
  });

  const handleClearFilters = () => {
    setFilters({
      search: '',
      game: 'all',
      rank: 'all',
      region: 'all',
      microphone: 'all',
    });
  };

  const filteredLobbies = React.useMemo(() => {
    return lobbies.filter((lobby) => {
      const metadata = lobby.metadata;
      const ownerName = (lobby.owner?.name || '').toLowerCase();
      const riotId = readMetadataString(metadata, 'riotId').toLowerCase();
      const bio = readMetadataString(metadata, 'bio').toLowerCase();
      const searchLower = filters.search.toLowerCase();

      if (filters.search && !ownerName.includes(searchLower) && !riotId.includes(searchLower) && !bio.includes(searchLower)) {
        return false;
      }

      const gameVal = String(readMetadataString(metadata, 'mainGame') || lobby.owner?.gameProfile?.mainGame || '').toLowerCase();
      if (filters.game !== 'all' && gameVal !== filters.game.toLowerCase()) {
        return false;
      }

      const rankVal = String(lobby.owner?.gameProfile?.currentRank || readMetadataString(metadata, 'currentRank') || lobby.minRank || '').toLowerCase();
      if (filters.rank !== 'all' && rankVal !== filters.rank.toLowerCase()) {
        return false;
      }

      const regionVal = String(lobby.owner?.gameProfile?.region || readMetadataString(metadata, 'region') || '').toLowerCase();
      if (filters.region !== 'all' && regionVal !== filters.region.toLowerCase()) {
        return false;
      }

      const ownerMicrophone = lobby.owner?.gameProfile?.microphone;
      const micVal = ownerMicrophone !== undefined ? ownerMicrophone : readMetadataBoolean(metadata, 'microphone') ?? false;
      if (filters.microphone !== 'all') {
        const wantsMic = filters.microphone === 'yes';
        if (micVal !== wantsMic) {
          return false;
        }
      }

      return true;
    });
  }, [filters, lobbies]);

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      <div className="dl-panel relative overflow-hidden p-[18px] md:p-[28px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(70,183,255,0.14),transparent_20rem),linear-gradient(120deg,transparent,rgba(70,183,255,0.04),transparent)]" />

        <div className="relative z-[2]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="dl-hud-label" style={{ color: 'var(--dl-tactical-blue)', borderColor: 'rgba(70,183,255,0.34)', background: 'rgba(70,183,255,0.08)' }}>
                LOBBY RADAR // MATCHMAKING NODE
              </span>
              <span className="dl-stamp" style={{ color: 'var(--dl-tactical-blue)', borderColor: 'rgba(70,183,255,0.3)', background: 'rgba(70,183,255,0.07)' }}>
                {filteredLobbies.length} contratos
              </span>
            </div>

            {onCreateTestLobby && import.meta.env.DEV && (
              <button
                type="button"
                onClick={onCreateTestLobby}
                disabled={isCreating}
                className="dl-btn border-[var(--dl-tactical-yellow)]/50 px-3 py-1 text-[10px] text-[var(--dl-tactical-yellow)]"
              >
                {isCreating ? 'PROCESSANDO...' : 'DEV: criar lobby'}
              </button>
            )}
          </div>

          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Encontre seu <span className="text-[var(--dl-tactical-blue)] drop-shadow-[0_0_24px_rgba(70,183,255,0.3)]">duo ideal</span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">
            Junte-se a jogadores compatíveis, suba de rank e conquiste prêmios. A confiança e a compatibilidade vêm em primeiro lugar.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="dl-panel flex items-center gap-4 border-[var(--dl-tactical-red)] bg-[rgba(255,51,102,0.05)] p-4">
          <div className="h-10 w-1 animate-pulse rounded-full bg-[var(--dl-tactical-red)]" />
          <div className="flex-1">
            <h4 className="mb-1 font-['Rajdhani'] text-[14px] font-bold uppercase tracking-wider text-[var(--dl-tactical-red)]">SISTEMA // ALERTA</h4>
            <p className="font-['Rajdhani'] text-[13px] uppercase text-white/80">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="dl-btn border-[var(--dl-tactical-red)]/50 px-3 py-1 text-[10px] text-[var(--dl-tactical-red)]"
          >
            RECONECTAR
          </button>
        </div>
      )}

      <section>
        <LobbyFilters filters={filters} onFiltersChange={setFilters} onClearFilters={handleClearFilters} />
      </section>

      <section>
        <LobbyActionsBar totalLobbies={filteredLobbies.length} />

        {isError ? (
          <div className="dl-panel flex w-full flex-col items-center justify-center py-16" style={{ borderColor: 'rgba(255,51,102,0.3)' }}>
            <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-tactical-red)]">Erro ao carregar os lobbies.</p>
            <button type="button" className="dl-btn" onClick={() => window.location.reload()}>
              Tentar Novamente
            </button>
          </div>
        ) : !isLoading && filteredLobbies.length === 0 ? (
          <div className="dl-panel flex w-full flex-col items-center justify-center py-16" style={{ borderColor: 'rgba(70,183,255,0.2)' }}>
            <p className="mb-2 font-['Rajdhani'] text-lg font-bold uppercase tracking-widest text-[var(--dl-tactical-blue)]">// CONTRATOS ENCONTRADOS: 0</p>
            <p className="mb-6 font-['Rajdhani'] text-sm uppercase tracking-wider text-[var(--dl-tactical-muted)]">Tente ajustar seus parâmetros de busca tática.</p>
            <button type="button" className="dl-btn" onClick={handleClearFilters}>
              // RESETAR FILTROS
            </button>
          </div>
        ) : (
          <LobbyGrid items={filteredLobbies} isLoading={isLoading} onJoinLobby={onJoinLobby} joiningLobbyId={joiningLobbyId} />
        )}
      </section>
    </div>
  );
};
