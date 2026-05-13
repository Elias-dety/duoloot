import React from 'react';
import { Player } from '@/schemas/player.schema';
import { Avatar, Badge, Button, Card } from '@/components/atoms';
import { MessageCircle, Shield, Trophy } from 'lucide-react';

export interface ProfileHeaderProps {
  player: Player;
}

const statusMap = {
  online: { label: 'Online', tone: 'bg-success' },
  'in-game': { label: 'Em partida', tone: 'bg-warning' },
  offline: { label: 'Offline', tone: 'bg-content-muted' },
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ player }) => {
  const status = statusMap[player.status];

  return (
    <Card variant={player.isPremium ? 'premium' : 'default'}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar src={player.avatarUrl} alt={player.nickname} fallback={player.nickname} size="xl" />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black text-content-base">{player.nickname}</h1>
              {player.isPremium && <Badge variant="premium">Premium</Badge>}
            </div>
            <p className="mt-1 text-sm text-content-muted">{player.name}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-content-muted">
              <span className="flex items-center gap-2 font-medium text-content-secondary">
                <span className={`h-2.5 w-2.5 rounded-full ${status.tone}`} />
                {status.label}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-surface-hover sm:block" />
              <span className="flex items-center gap-2 font-medium text-content-secondary">
                <Trophy className="h-4 w-4 text-warning" />
                {player.gameProfile.rank}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-surface-hover sm:block" />
              <span>Membro desde {new Date(player.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:w-auto">
          <Button variant="outline" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Mensagem
          </Button>
          <Button variant="primary" className="gap-2">
            <Shield className="h-4 w-4" />
            Convidar
          </Button>
        </div>
      </div>
    </Card>
  );
};
