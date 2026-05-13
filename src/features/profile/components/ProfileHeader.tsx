import React from 'react';
import { Player } from '@/schemas/player.schema';
import { Avatar, Badge, Button } from '@/components/atoms';
import { Shield, MessageCircle } from 'lucide-react';

export interface ProfileHeaderProps {
  player: Player;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ player }) => {
  return (
    <section className="bg-surface-dark border border-surface-highlight p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <Avatar 
          src={player.avatarUrl} 
          alt={player.name} 
          fallback={player.name} 
          size="xl" 
        />
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-content-base">{player.name}</h1>
            {player.isPremium && <Badge variant="premium">Premium</Badge>}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-content-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <span className={`w-2.5 h-2.5 rounded-full ${
                player.status === 'online' ? 'bg-success' : 
                player.status === 'in-game' ? 'bg-warning' : 
                'bg-zinc-500'
              }`} />
              {player.status === 'online' ? 'Online' : 
               player.status === 'in-game' ? 'Em Partida' : 'Offline'}
            </span>
            <span>•</span>
            <span>Membro desde {new Date(player.createdAt).getFullYear()}</span>
          </div>
        </div>
      </div>

      <div className="flex w-full md:w-auto gap-3">
        <Button variant="outline" className="flex-1 md:flex-none gap-2">
          <MessageCircle className="w-4 h-4" />
          Mensagem
        </Button>
        <Button variant="primary" className="flex-1 md:flex-none gap-2">
          <Shield className="w-4 h-4" />
          Convidar
        </Button>
      </div>
    </section>
  );
};
