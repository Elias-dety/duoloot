import React from 'react';

export interface LobbyActionsBarProps {
  totalLobbies: number;
  onCreateLobby?: () => void;
}

export const LobbyActionsBar: React.FC<LobbyActionsBarProps> = ({ totalLobbies, onCreateLobby }) => {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-[var(--dl-tactical-line)] py-4 md:flex-row md:items-center">
      <h2 className="font-['Rajdhani'] text-xl font-bold uppercase text-[var(--dl-tactical-text)] flex items-center gap-3">
        Lobbies disponíveis
        <span className="dl-stamp" style={{ color: 'var(--dl-tactical-blue)', borderColor: 'rgba(70,183,255,0.3)', background: 'rgba(70,183,255,0.07)' }}>
          {totalLobbies}
        </span>
      </h2>
      <button type="button" className="dl-btn dl-btn-primary" onClick={onCreateLobby}>
        + Criar Lobby
      </button>
    </div>
  );
};
