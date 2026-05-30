import React from 'react';
import { SkeletonBlock, UiMarker } from '@/components/atoms';
import { UI_MARKERS } from '@/config/uiMarkers';
import { LobbyCard } from '@/features/lobby/components/LobbyCard';
import { Lobby } from '@/schemas/lobby.schema';

export interface LobbyGridProps {
  items: Lobby[];
  isLoading?: boolean;
  onJoinLobby?: (id: string) => void;
  onLeaveLobby?: (id: string) => void;
  joiningLobbyId?: string | null;
  leavingLobbyId?: string | null;
  joinedLobbyIds?: string[];
  currentUserId?: string;
}

const gridClassName = 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4';

export const LobbyGrid: React.FC<LobbyGridProps> = ({
  items,
  isLoading = false,
  onJoinLobby,
  onLeaveLobby,
  joiningLobbyId,
  leavingLobbyId,
  joinedLobbyIds = [],
  currentUserId,
}) => {
  if (isLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="min-w-0">
            <div className="dl-panel min-h-[280px] animate-pulse p-4">
              <SkeletonBlock width="100%" height="100%" className="rounded-[1rem] bg-[var(--dl-surface)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="dl-panel flex w-full flex-col items-center justify-center border-dashed py-16">
        <p className="mb-2 text-center font-['Rajdhani'] text-[14px] font-bold uppercase text-white">
          Nenhum lobby encontrado.
        </p>
        <span className="text-[12px] text-[var(--dl-muted-light)]">
          Tente ajustar seus filtros ou crie um novo lobby.
        </span>
      </div>
    );
  }

  return (
    <>
      {/* UI_MARKER: lobby.grid.501 | Grid de lobbies */}
      <div data-ui-id={UI_MARKERS.lobby.grid.id} data-ui-label={UI_MARKERS.lobby.grid.label}>
        <UiMarker {...UI_MARKERS.lobby.grid} />
        <div className={gridClassName}>
        {items.map((lobby) => {
          const isOwner = Boolean(currentUserId && lobby.owner?.id === currentUserId);
          const isJoined = isOwner || joinedLobbyIds.includes(lobby.id);

          return (
            <div key={lobby.id} className="min-w-0">
              <LobbyCard
                density="compact"
                lobby={lobby}
                onJoin={onJoinLobby}
                onLeave={onLeaveLobby}
                isJoining={joiningLobbyId === lobby.id}
                isLeaving={leavingLobbyId === lobby.id}
                isJoined={isJoined}
                isOwner={isOwner}
              />
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
};
