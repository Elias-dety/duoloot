import React from 'react';
import { SkeletonBlock } from '@/components/atoms';
import { LobbyCard } from '@/features/lobby/components/LobbyCard';
import { Lobby } from '@/schemas/lobby.schema';

export interface LobbyGridProps {
  items: Lobby[];
  isLoading?: boolean;
  onJoinLobby?: (id: string) => void;
  joiningLobbyId?: string | null;
}

export const LobbyGrid: React.FC<LobbyGridProps> = ({ 
  items, 
  isLoading = false,
  onJoinLobby,
  joiningLobbyId
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="dl-panel p-5 min-h-[320px] animate-pulse">
            <SkeletonBlock width="100%" height="100%" className="bg-[var(--dl-tactical-metal)]" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="dl-panel flex w-full flex-col items-center justify-center border-dashed py-16">
        <p className="text-[var(--dl-tactical-muted)] text-center mb-2 text-[14px] font-['Rajdhani'] font-bold uppercase">Nenhum lobby encontrado.</p>
        <span className="text-[12px] text-[var(--dl-tactical-muted)]">Tente ajustar seus filtros ou crie um novo lobby.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((lobby) => (
        <LobbyCard 
          key={lobby.id} 
          lobby={lobby} 
          onJoin={onJoinLobby} 
          isJoining={joiningLobbyId === lobby.id}
        />
      ))}
    </div>
  );
};
