import React from 'react';
import { Card, SkeletonBlock } from '@/components/atoms';
import { LobbyCard } from '@/features/lobby/components/LobbyCard';
import { Lobby } from '@/schemas/lobby.schema';

export interface LobbyGridProps {
  items: Lobby[];
  isLoading?: boolean;
  onJoinLobby?: (id: string) => void;
}

export const LobbyGrid: React.FC<LobbyGridProps> = ({ 
  items, 
  isLoading = false,
  onJoinLobby
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} width="100%" height="320px" className="rounded-xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card variant="elevated" className="flex w-full flex-col items-center justify-center border-dashed py-16">
        <p className="text-content-secondary text-center mb-2 text-lg">Nenhum lobby encontrado.</p>
        <span className="text-sm text-content-tertiary">Tente ajustar seus filtros ou crie um novo lobby.</span>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((lobby) => (
        <LobbyCard key={lobby.id} lobby={lobby} onJoin={onJoinLobby} />
      ))}
    </div>
  );
};
