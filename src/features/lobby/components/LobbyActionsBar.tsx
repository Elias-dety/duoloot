import React from 'react';
import { Button } from '@/components/atoms';

export interface LobbyActionsBarProps {
  totalLobbies: number;
  onCreateLobby?: () => void;
}

export const LobbyActionsBar: React.FC<LobbyActionsBarProps> = ({ totalLobbies, onCreateLobby }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-surface-highlight mb-6">
      <h2 className="text-xl font-bold text-content-primary">
        Lobbies Disponíveis <span className="text-content-tertiary text-base font-normal ml-2">({totalLobbies})</span>
      </h2>
      <Button variant="primary" onClick={onCreateLobby}>
        + Criar Lobby
      </Button>
    </div>
  );
};
