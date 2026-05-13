import React from 'react';
import { Avatar, Badge } from '@/components/atoms';

interface LobbyCardHeaderProps {
  owner: {
    name: string;
    avatarUrl?: string;
    trustScore: number;
    status: 'online' | 'offline' | 'in-game';
    gameProfile: {
      rank: string;
      mainRole: string;
    };
  };
  className?: string;
}

export const LobbyCardHeader: React.FC<LobbyCardHeaderProps> = ({ owner, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Avatar src={owner.avatarUrl} fallback={owner.name} size="md" className="border-2 border-brand-primary/25" />
        <div
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
            owner.status === 'online' ? 'bg-success' : owner.status === 'in-game' ? 'bg-info' : 'bg-content-muted'
          }`}
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2">
          <span className="truncate font-bold text-content-primary">{owner.name}</span>
          <Badge variant={owner.trustScore >= 90 ? 'success' : 'default'} className="px-1.5 py-0 text-[10px]">
            {owner.trustScore} TS
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-content-muted">
          <span>{owner.gameProfile.rank}</span>
          <span className="h-1 w-1 rounded-full bg-surface-hover" />
          <span>{owner.gameProfile.mainRole}</span>
        </div>
      </div>
    </div>
  );
};
