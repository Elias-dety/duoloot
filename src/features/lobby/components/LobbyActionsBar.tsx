import React from 'react';
import { Button } from '@/components/atoms';

export interface LobbyActionsBarProps {
  totalLobbies: number;
  onCreateLobby?: () => void;
}

export const LobbyActionsBar: React.FC<LobbyActionsBarProps> = ({ totalLobbies, onCreateLobby }) => {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-border py-4 md:flex-row md:items-center">
      <h2 className="text-xl font-bold text-content-primary">
        Lobbies Disponíveis <span className="text-content-tertiary text-base font-normal ml-2">({totalLobbies})</span>
      </h2>
      <Button variant="primary" onClick={onCreateLobby}>
        + Criar Lobby
      </Button>
    </div>
  );
};
