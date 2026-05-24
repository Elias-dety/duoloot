import React from 'react';
import { Badge, Button } from '@/components/atoms';

export interface LobbyActionsBarProps {
  totalLobbies: number;
  onCreateLobby?: () => void;
  isCreating?: boolean;
}

export const LobbyActionsBar: React.FC<LobbyActionsBarProps> = ({
  totalLobbies,
  onCreateLobby,
  isCreating,
}) => {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-[var(--dl-border)] py-4 md:flex-row md:items-center">
      <h2 className="flex items-center gap-3 font-['Rajdhani'] text-2xl font-bold uppercase text-white">
        Lobbies disponíveis
        <Badge>{String(totalLobbies)}</Badge>
      </h2>
      {onCreateLobby ? (
        <Button type="button" onClick={onCreateLobby} disabled={isCreating} className="w-full md:w-auto">
          {isCreating ? 'Criando...' : '+ Criar Lobby'}
        </Button>
      ) : null}
    </div>
  );
};
