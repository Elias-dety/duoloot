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
    <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] backdrop-blur-xl">
      <div className="flex flex-col items-start justify-between gap-4 px-5 py-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h2 className="text-xl font-bold uppercase tracking-[-0.01em] text-white md:text-2xl">
              Lobbies disponíveis
            </h2>
            <Badge>{String(totalLobbies)}</Badge>
          </div>
          <p className="font-['Inter'] text-[0.78rem] text-[var(--dl-muted-light)]">
            Criação e entrada usam Supabase. Complete o perfil gamer antes de participar.
          </p>
        </div>

        {onCreateLobby ? (
          <Button type="button" onClick={onCreateLobby} disabled={isCreating} className="w-full shadow-[0_8px_28px_rgba(255,70,85,0.22)] md:w-auto">
            {isCreating ? 'Criando...' : '+ Criar Lobby'}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
