import React from 'react';
import { Card, StatValue } from '@/components/atoms';
import { Player } from '@/schemas/player.schema';

export interface ProfileStatsGridProps {
  player: Player;
}

export const ProfileStatsGrid: React.FC<ProfileStatsGridProps> = ({ player }) => {
  return (
    <Card variant="elevated">
      <h3 className="mb-6 text-lg font-bold text-content-base">Estatisticas gerais</h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface-card p-4">
          <StatValue label="Partidas" value={player.stats.matchesPlayed} />
        </div>

        <div className="rounded-xl border border-border bg-surface-card p-4">
          <StatValue label="Win rate" value={`${player.stats.winRate}%`} tone="success" />
        </div>

        <div className="rounded-xl border border-border bg-surface-card p-4">
          <StatValue label="KDA medio" value={player.stats.averageKda.toFixed(2)} tone="info" />
        </div>

        <div className="rounded-xl border border-border bg-surface-card p-4">
          <StatValue label="Horas" value={`${player.stats.hoursPlayed}h`} />
        </div>
      </div>
    </Card>
  );
};
