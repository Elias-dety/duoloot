import React from 'react';

import { LobbyGrid } from '@/components/organisms/LobbyGrid';
import { LobbyActionsBar } from '@/features/lobby/components/LobbyActionsBar';
import { LobbyFilters } from '@/features/lobby/components/LobbyFilters';
import { Lobby } from '@/schemas/lobby.schema';
import { Button, Card, SectionTitle } from '@/components/atoms';
import { EmptyState } from '@/components/molecules';
import { ASSETS } from '@/constants/assets';
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
    <div className="relative mx-auto w-full max-w-[1600px] space-y-6 px-6 pb-12 pt-4 md:px-10 lg:px-16 md:pt-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] rounded-full opacity-80 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 0%, rgba(13,240,255,0.08), transparent 70%), radial-gradient(ellipse 45% 45% at 82% 12%, rgba(255,70,85,0.06), transparent 65%)',
        }}
      />

      <Card variant="muted" className="overflow-hidden border-white/[0.08] bg-white/[0.035] p-0 backdrop-blur-xl">
        <div className="grid items-stretch gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="relative px-5 py-7 md:px-8 md:py-9">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--dl-number)]/30 bg-[var(--dl-number)]/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--dl-number)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--dl-number)] shadow-[0_0_8px_var(--dl-number)]" />
              Matchmaking em auditoria
            </div>

            <SectionTitle
              eyebrow={copy.lobby.eyebrow}
              title={copy.lobby.title}
              subtitle={copy.lobby.subtitle}
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Lobbies reais', value: String(lobbies.length), color: 'var(--dl-number)' },
                { label: 'Filtrados', value: String(filteredLobbies.length), color: 'var(--dl-string)' },
                { label: 'Criação', value: 'Perfil obrigatório', color: 'var(--dl-warning)' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                  <span className="block font-['Inter'] text-[0.68rem] uppercase tracking-[0.14em] text-[var(--dl-muted)]">
                    {item.label}
                  </span>
                  <span className="mt-1 block font-mono text-[0.82rem] font-semibold" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center border-t border-white/[0.08] bg-black/20 p-6 lg:border-l lg:border-t-0">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(255,70,85,0.08), transparent 70%)',
              }}
            />
            <div className="relative flex items-center justify-center gap-5 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
              <img src={ASSETS.icons.lobbyFinderThumb} alt="Icone de busca de lobby" loading="eager" decoding="async" className="h-24 w-24 object-contain" />
              <img src={ASSETS.icons.matchmakingTrustThumb} alt="Icone de matchmaking por confianca" loading="eager" decoding="async" className="h-20 w-20 object-contain opacity-90" />
            </div>
          </div>
        </div>
      </Card>

      {errorMessage ? (
        <Card variant="danger" className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
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
        <Card variant="muted" className="border-[var(--dl-string)] bg-[rgb(var(--dl-string-rgb)/0.1)] p-4">
          <p className="text-sm font-semibold text-white">{statusMessage}</p>
        </Card>
      ) : null}

      <LobbyFilters filters={filters} onFiltersChange={setFilters} onClearFilters={handleClearFilters} />

      <section className="space-y-4">
        <LobbyActionsBar
          totalLobbies={filteredLobbies.length}
          onCreateLobby={onCreateTestLobby}
          onConfigureLobby={onConfigureLobby}
          isCreating={isCreating}
        />

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