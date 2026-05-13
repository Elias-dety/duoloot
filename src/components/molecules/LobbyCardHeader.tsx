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
  const getStatusVariant = () => {
    if (owner.status === 'online') return 'success';
    if (owner.status === 'in-game') return 'info';
    return 'default';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Avatar 
          src={owner.avatarUrl} 
          fallback={owner.name} 
          size="md" 
          className="border-2 border-zinc-800"
        />
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-zinc-950 ${
          owner.status === 'online' ? 'bg-emerald-500' : owner.status === 'in-game' ? 'bg-blue-500' : 'bg-zinc-600'
        }`} />
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-100 truncate">{owner.name}</span>
          <Badge variant={owner.trustScore >= 90 ? 'success' : 'default'} className="text-[10px] py-0 px-1.5">
            {owner.trustScore} TS
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>{owner.gameProfile.rank}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>{owner.gameProfile.mainRole}</span>
        </div>
      </div>
    </div>
  );
};
