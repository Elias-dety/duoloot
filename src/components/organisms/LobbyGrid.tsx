import React from 'react';
import { SkeletonBlock } from '@/components/atoms';
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

const gridClassName = 'grid grid-cols-1 gap-5 xl:grid-cols-2';

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
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="dl-panel min-h-[320px] p-5 animate-pulse">
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
        <p className="mb-2 text-center font-['Rajdhani'] text-[14px] font-bold uppercase text-white">Nenhum lobby encontrado.</p>
        <span className="text-[12px] text-[var(--dl-muted-light)]">Tente ajustar seus filtros ou crie um novo lobby.</span>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {items.map((lobby) => {
        const isOwner = Boolean(currentUserId && lobby.owner?.id === currentUserId);
        const isJoined = isOwner || joinedLobbyIds.includes(lobby.id);

        return (
          <div key={lobby.id}>
            <LobbyCard
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
  );
};
