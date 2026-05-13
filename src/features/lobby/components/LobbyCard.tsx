import React from 'react';
import { Button, Avatar, StatValue } from '@/components/atoms';
import { CompatibilityMeter } from '@/components/molecules';
import { Lobby } from '@/schemas/lobby.schema';

export interface LobbyCardProps {
  lobby: Lobby;
  onJoin?: (id: string) => void;
}

export const LobbyCard: React.FC<LobbyCardProps> = ({ lobby, onJoin }) => {
  const vagas = lobby.slotsTotal - lobby.slotsFilled;
  const isFull = lobby.status === 'full' || vagas === 0;
  const isClosed = lobby.status === 'closed';
  
  return (
    <div className="bg-surface-dark border border-surface-highlight rounded-xl p-5 hover:border-brand-primary/50 transition-colors flex flex-col gap-4 h-full">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Avatar src={lobby.owner.avatarUrl} alt={lobby.owner.name} fallback={lobby.owner.name} />
          <div>
            <h3 className="text-content-primary font-bold text-lg">{lobby.owner.name}'s Lobby</h3>
            <p className="text-xs text-content-tertiary">{lobby.mode} • {lobby.queue}</p>
          </div>
        </div>
      </div>

      {lobby.compatibilityScore && (
        <div className="mt-2">
          <CompatibilityMeter score={lobby.compatibilityScore} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-4 flex-1">
        <StatValue label="Rank" value={`${lobby.minRank}`} description={`até ${lobby.maxRank}`} className="text-sm" />
        <StatValue label="Vagas" value={vagas > 0 ? `${vagas} / ${lobby.slotsTotal}` : 'Lotado'} className="text-sm" />
        <StatValue label="Confiança" value={`${lobby.owner.trustScore}%`} className="text-sm" />
        <StatValue label="Status" value={lobby.status.toUpperCase()} className="text-sm" />
      </div>

      <div className="mt-4 pt-4 border-t border-surface-highlight">
        <Button 
          variant={isFull || isClosed ? 'outline' : 'primary'} 
          className="w-full"
          disabled={isFull || isClosed}
          onClick={() => onJoin && onJoin(lobby.id)}
        >
          {isClosed ? 'Fechado' : isFull ? 'Lobby Cheio' : 'Entrar no Lobby'}
        </Button>
      </div>
    </div>
  );
};
