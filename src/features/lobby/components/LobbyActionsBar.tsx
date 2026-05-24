import React from 'react';
import { DuolootBadge, DuolootButton } from '@/components/duoloot';

export interface LobbyActionsBarProps {
  totalLobbies: number;
  onCreateLobby?: () => void;
}

export const LobbyActionsBar: React.FC<LobbyActionsBarProps> = ({ totalLobbies, onCreateLobby }) => {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-[var(--dl-border)] py-4 md:flex-row md:items-center">
      <h2 className="flex items-center gap-3 font-['Rajdhani'] text-2xl font-bold uppercase text-white">
        Lobbies disponíveis
        <DuolootBadge>{String(totalLobbies)}</DuolootBadge>
      </h2>
      <DuolootButton type="button" onClick={onCreateLobby} className="w-full md:w-auto">
        + Criar Lobby
      </DuolootButton>
    </div>
  );
};
