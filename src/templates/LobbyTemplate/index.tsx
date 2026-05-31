import React from 'react';

import { LobbyGrid } from '@/components/organisms/LobbyGrid';
import { LobbyActionsBar } from '@/features/lobby/components/LobbyActionsBar';
import { LobbyFilters } from '@/features/lobby/components/LobbyFilters';
import { Lobby } from '@/schemas/lobby.schema';
import { Button, Card } from '@/components/atoms';
import { EmptyState } from '@/components/molecules';
import { useLanguage } from '@/i18n';

export interface LobbyTemplateProps {
  lobbies: Lobby[];
  isLoading: boolean;
  isError: boolean;
  onJoinLobby?: (id: string) => void;
  onLeaveLobby?: (id: string) => void;
  onCreateTestLobby?: () => void;
  onConfigureLobby?: () => void;
  isCreating?: boolean;
  joiningLobbyId?: string | null;
  leavingLobbyId?: string | null;
  errorMessage?: string | null;
  statusMessage?: string | null;
  joinedLobbyIds?: string[];
  currentUserId?: string;
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
  onLeaveLobby,
  onCreateTestLobby,
  onConfigureLobby,
  isCreating,
  joiningLobbyId,
  leavingLobbyId,
  errorMessage,
  statusMessage,
  joinedLobbyIds,
  currentUserId,
}) => {
  const { messages: copy } = useLanguage();
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
    <div className="dl-premium-shell relative space-y-6 px-5 pb-14 pt-4 sm:px-6 md:pt-6 lg:px-12">
      <section className="dl-premium-hero overflow-hidden" data-watermark="LOBBY">
        <div className="grid items-stretch gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="relative z-[2] px-5 py-8 md:px-9 md:py-11">
            <div className="dl-premium-badge mb-6 px-3 py-1.5">
              Matchmaking em auditoria
            </div>

            <div className="max-w-4xl">
              <p className="mb-3 font-['Inter'] text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--dl-muted)]">
                {copy.lobby.eyebrow}
              </p>
              <h1 className="dl-premium-title text-[clamp(2.4rem,5vw,5rem)] font-black">
                {copy.lobby.title}
              </h1>
              <p className="dl-premium-muted mt-5 max-w-2xl text-sm md:text-base">
                {copy.lobby.subtitle}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Lobbies reais', value: String(lobbies.length), color: 'var(--dl-number)' },
                { label: 'Filtrados', value: String(filteredLobbies.length), color: 'var(--dl-string)' },
                { label: 'Criação', value: 'Perfil', color: 'var(--dl-warning)' },
              ].map((item) => (
                <div key={item.label} className="dl-stat-tile min-h-[5.8rem]">
                  <span className="dl-stat-label">{item.label}</span>
                  <span className="dl-stat-value mt-2 block text-[1.25rem]" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[22rem] items-center justify-center border-l border-white/[0.08] bg-black/10 p-8 lg:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,70,85,0.08),transparent_60%)]" />
            <div className="dl-radar" />
            <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between font-mono text-[0.7rem]">
                <span className="text-[var(--dl-number)]">// lobby.scan()</span>
                <span className="text-[var(--dl-string)]">sync</span>
              </div>
              <div className="grid gap-2">
                <div className="h-2 rounded-full bg-white/[0.07]"><div className="h-full w-[86%] rounded-full bg-[linear-gradient(90deg,var(--dl-number),var(--dl-string))]" /></div>
                <div className="h-2 rounded-full bg-white/[0.07]"><div className="h-full w-[74%] rounded-full bg-[linear-gradient(90deg,var(--dl-number),var(--dl-function))]" /></div>
                <div className="h-2 rounded-full bg-white/[0.07]"><div className="h-full w-[62%] rounded-full bg-[linear-gradient(90deg,var(--dl-warning),var(--dl-keyword))]" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <Card variant="danger" className="flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white">{copy.lobby.syncError}</p>
            <p className="mt-1 text-sm text-[var(--dl-muted-light)]">{errorMessage}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
            {copy.common.reload}
          </Button>
        </Card>
      ) : null}

      {statusMessage ? (
        <Card variant="muted" className="rounded-2xl border-[var(--dl-string)] bg-[rgb(var(--dl-string-rgb)/0.1)] p-4">
          <p className="text-sm font-semibold text-white">{statusMessage}</p>
        </Card>
      ) : null}

      <div className="dl-glass rounded-3xl p-3 md:p-4">
        <LobbyFilters filters={filters} onFiltersChange={setFilters} onClearFilters={handleClearFilters} />
      </div>

      <section className="space-y-5">
        <div className="dl-glass rounded-3xl p-3 md:p-4">
          <LobbyActionsBar
            totalLobbies={filteredLobbies.length}
            onCreateLobby={onCreateTestLobby}
            onConfigureLobby={onConfigureLobby}
            isCreating={isCreating}
          />
        </div>

        {isError ? (
          <EmptyState
            icon="error"
            title={copy.lobby.loadingErrorTitle}
            description={copy.lobby.loadingErrorDescription}
            actionLabel={copy.common.tryAgain}
            onAction={() => window.location.reload()}
          />
        ) : !isLoading && filteredLobbies.length === 0 ? (
          <EmptyState
            title={copy.lobby.emptyTitle}
            description={copy.lobby.emptyDescription}
            actionLabel={copy.lobby.clearFilters}
            onAction={handleClearFilters}
          />
        ) : (
          <LobbyGrid
            items={filteredLobbies}
            isLoading={isLoading}
            onJoinLobby={onJoinLobby}
            onLeaveLobby={onLeaveLobby}
            joiningLobbyId={joiningLobbyId}
            leavingLobbyId={leavingLobbyId}
            joinedLobbyIds={joinedLobbyIds}
            currentUserId={currentUserId}
          />
        )}
      </section>
    </div>
  );
};
