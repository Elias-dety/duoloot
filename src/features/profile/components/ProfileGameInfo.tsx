import React from 'react';
import { Player } from '@/schemas/player.schema';
import { Badge, Card } from '@/components/atoms';
import { Crosshair, Gamepad2, Trophy } from 'lucide-react';

export interface ProfileGameInfoProps {
  player: Player;
}

export const ProfileGameInfo: React.FC<ProfileGameInfoProps> = ({ player }) => {
  return (
    <Card variant="elevated" className="h-full">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-content-base">
        <Gamepad2 className="h-5 w-5 text-brand-primary" />
        Perfil competitivo
      </h3>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-surface-card p-4">
          <p className="text-sm text-content-muted">Rank atual</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-prize/30 bg-prize/10">
              <Trophy className="h-6 w-6 text-prize" />
            </div>
            <span className="text-xl font-black text-content-base">{player.gameProfile.rank}</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-content-muted">Roles</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info" className="gap-1 px-3 py-1 text-sm">
              <Crosshair className="h-3.5 w-3.5" />
              {player.gameProfile.mainRole}
            </Badge>
            {player.gameProfile.secondaryRole && (
              <Badge variant="default" className="px-3 py-1 text-sm">
                {player.gameProfile.secondaryRole}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
