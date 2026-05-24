import React from 'react';
import { StatValue } from '@/components/atoms';
import { Player } from '@/schemas/player.schema';
import { ASSETS } from '@/constants/assets';

export interface ProfileStatsGridProps {
  player: Player;
}

export const ProfileStatsGrid: React.FC<ProfileStatsGridProps> = ({ player }) => {
  return (
    <article className="dl-panel p-6">
      <h3 className="dl-hud-label mb-6"><span className="text-[var(--dl-function)]">■</span> Estatísticas gerais</h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border border-[var(--dl-border)] bg-white/[0.02] p-4 rounded-[1rem]">
          <img src={ASSETS.icons.matchmaking} alt="" aria-hidden="true" className="mb-2 h-5 w-5 object-contain" />
          <StatValue label="Partidas" value={player.stats.matchesPlayed} />
        </div>

        <div className="border border-[rgba(var(--dl-success-rgb),0.3)] bg-[rgba(var(--dl-success-rgb),0.05)] p-4 rounded-[1rem]">
          <img src={ASSETS.icons.ranking} alt="" aria-hidden="true" className="mb-2 h-5 w-5 object-contain" />
          <StatValue label="Win rate" value={`${player.stats.winRate}%`} tone="success" />
        </div>

        <div className="border border-[rgba(var(--dl-function-rgb),0.3)] bg-[rgba(var(--dl-function-rgb),0.05)] p-4 rounded-[1rem]">
          <StatValue label="KDA médio" value={player.stats.averageKda.toFixed(2)} tone="info" />
        </div>

        <div className="border border-[var(--dl-border)] bg-white/[0.02] p-4 rounded-[1rem]">
          <img src={ASSETS.rewards.duocoinsThumb} alt="" aria-hidden="true" className="mb-2 h-5 w-5 object-contain" />
          <StatValue label="Horas" value={`${player.stats.hoursPlayed}h`} />
        </div>
      </div>
    </article>
  );
};
