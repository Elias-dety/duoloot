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
  onCreateTestLobby?: () => void;
  isCreating?: boolean;
  joiningLobbyId?: string | null;
  errorMessage?: string | null;
  statusMessage?: string | null;
  invitedLobbyIds?: string[];
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
  statusMessage,
  invitedLobbyIds,
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
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 pt-4 md:px-6 md:pt-6">
      <Card variant="accent" className="space-y-5 px-5 py-6 md:px-8 md:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle
            eyebrow={copy.lobby.eyebrow}
            title={copy.lobby.title}
            subtitle={copy.lobby.subtitle}
          />

          </div>
          <div className="flex items-center justify-center gap-4 rounded-[1.25rem] border border-[var(--dl-border)] bg-black/20 p-4">
            <img src={ASSETS.icons.lobbyFinderThumb} alt="Icone de busca de lobby" loading="eager" decoding="async" className="h-24 w-24 object-contain" />
            <img src={ASSETS.icons.matchmakingTrustThumb} alt="Icone de matchmaking por confianca" loading="eager" decoding="async" className="h-20 w-20 object-contain opacity-90" />
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
            joiningLobbyId={joiningLobbyId} 
            invitedLobbyIds={invitedLobbyIds}
          />
        )}
      </section>
    </div>
  );
};
