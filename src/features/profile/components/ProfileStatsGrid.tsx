import React from 'react';
import { Card, StatValue } from '@/components/atoms';
import { Player } from '@/schemas/player.schema';

export interface ProfileStatsGridProps {
  player: Player;
}

export const ProfileStatsGrid: React.FC<ProfileStatsGridProps> = ({ player }) => {
  return (
    <article className="dl-panel p-6">
      <h3 className="dl-hud-label mb-6"><span className="text-[var(--dl-tactical-blue)]">■</span> Estatísticas gerais</h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border border-[var(--dl-tactical-line)] bg-white/[0.02] p-4 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Partidas" value={player.stats.matchesPlayed} />
        </div>

        <div className="border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.05)] p-4 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Win rate" value={`${player.stats.winRate}%`} tone="success" />
        </div>

        <div className="border border-[rgba(56,189,248,0.3)] bg-[rgba(56,189,248,0.05)] p-4 [clip-path:var(--dl-cut-button)]">
          <StatValue label="KDA médio" value={player.stats.averageKda.toFixed(2)} tone="info" />
        </div>

        <div className="border border-[var(--dl-tactical-line)] bg-white/[0.02] p-4 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Horas" value={`${player.stats.hoursPlayed}h`} />
        </div>
      </div>
    </article>
  );
};
