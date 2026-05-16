import React from 'react';
import { Player } from '@/schemas/player.schema';
import { Badge, Card } from '@/components/atoms';
import { Crosshair, Gamepad2, Trophy } from 'lucide-react';

export interface ProfileGameInfoProps {
  player: Player;
}

export const ProfileGameInfo: React.FC<ProfileGameInfoProps> = ({ player }) => {
  return (
    <article className="dl-panel h-full p-6">
      <h3 className="dl-hud-label mb-6"><span className="text-[var(--dl-tactical-yellow)]">■</span> Perfil competitivo</h3>

      <div className="space-y-6">
        <div className="border border-[var(--dl-tactical-line)] bg-white/[0.02] p-4 [clip-path:var(--dl-cut-button)]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">Rank atual</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border border-[var(--dl-tactical-yellow)]/[0.3] bg-[var(--dl-tactical-yellow)]/[0.1] [clip-path:var(--dl-cut-button)]">
              <Trophy className="h-6 w-6 text-[var(--dl-tactical-yellow)]" />
            </div>
            <span className="font-['Rajdhani'] text-3xl font-bold uppercase text-white">{player.gameProfile.rank}</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">Roles</p>
          <div className="flex flex-wrap gap-2">
            <span className="dl-chip dl-chip-blue gap-1">
              <Crosshair className="h-3.5 w-3.5" />
              {player.gameProfile.mainRole}
            </span>
            {player.gameProfile.secondaryRole && (
              <span className="dl-chip">
                {player.gameProfile.secondaryRole}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
