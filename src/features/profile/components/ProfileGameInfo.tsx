import React from 'react';
import { Player } from '@/schemas/player.schema';
import { Badge } from '@/components/atoms';
import { Trophy, Crosshair, Mic, Gamepad2 } from 'lucide-react';

export interface ProfileGameInfoProps {
  player: Player;
}

export const ProfileGameInfo: React.FC<ProfileGameInfoProps> = ({ player }) => {
  return (
    <section className="bg-surface-dark border border-surface-highlight p-6 rounded-2xl h-full flex flex-col">
      <h3 className="text-lg font-bold text-content-base mb-6 flex items-center gap-2">
        <Gamepad2 className="w-5 h-5 text-brand-primary" />
        Perfil de Jogo
      </h3>

      <div className="space-y-6 flex-grow">
        <div>
          <p className="text-sm text-content-muted mb-2">Rank Atual</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-surface-highlight flex items-center justify-center border border-surface-highlight">
              <Trophy className="w-6 h-6 text-warning" />
            </div>
            <span className="text-xl font-black text-content-base">{player.gameProfile.rank}</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-content-muted mb-2">Funções (Roles)</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info" className="gap-1 px-3 py-1 text-sm">
              <Crosshair className="w-3.5 h-3.5" />
              {player.gameProfile.mainRole}
            </Badge>
            {player.gameProfile.secondaryRole && (
              <Badge variant="default" className="px-3 py-1 text-sm">
                {player.gameProfile.secondaryRole}
              </Badge>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-content-muted mb-2">Preferências</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="gap-1">
              {player.preferences.micRequired ? <Mic className="w-3 h-3" /> : null}
              {player.preferences.micRequired ? 'Com Microfone' : 'Sem Microfone'}
            </Badge>
            <Badge variant="default">{player.preferences.playStyle}</Badge>
          </div>
        </div>
      </div>
    </section>
  );
};
