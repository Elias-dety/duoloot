import React from 'react';
import { SectionTitle, StatValue, Avatar, Badge } from '@/components/atoms';
import { Player } from '@/schemas/player.schema';
import { DashboardSummary as DashboardSummaryType } from '@/schemas/dashboardSummary.schema';

export interface DashboardSummaryProps {
  player: Player;
  summary: DashboardSummaryType;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ player, summary }) => {
  // Extracting or deriving data
  const { name, avatarUrl, status, isPremium, gameProfile, stats, metadata } = player;
  
  // Fake calculation or metadata extraction for K/D and streak since it's not strictly in schema
  const kd = (metadata?.kd as number) || 1.15;
  const streak = (metadata?.streak as number) || 3;
  const matches = stats.matchesPlayed;
  const winRate = stats.winRate;
  const wins = Math.round(matches * (winRate / 100));

  return (
    <section className="w-full p-6 bg-surface-dark border border-surface-highlight rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={avatarUrl} alt={name} fallback={name} size="lg" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-content-base">{name}</h2>
              {isPremium && <Badge variant="premium">Premium</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-content-muted">
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-success' : status === 'in-game' ? 'bg-warning' : 'bg-zinc-500'}`} />
                {status}
              </span>
              <span>•</span>
              <span className="font-medium text-content-highlight">{gameProfile.rank}</span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-content-muted mb-1">Ganhos Totais</p>
          <p className="text-2xl font-bold text-success">R$ {summary.totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-surface-base rounded-xl border border-surface-highlight/50">
          <StatValue label="Partidas" value={matches} />
        </div>
        <div className="p-4 bg-surface-base rounded-xl border border-surface-highlight/50">
          <StatValue label="Vitórias" value={wins} />
        </div>
        <div className="p-4 bg-surface-base rounded-xl border border-surface-highlight/50">
          <StatValue label="Taxa de Vitória" value={`${winRate.toFixed(1)}%`} />
        </div>
        <div className="p-4 bg-surface-base rounded-xl border border-surface-highlight/50">
          <StatValue label="K/D Ratio" value={kd.toFixed(2)} />
        </div>
        <div className="p-4 bg-surface-base rounded-xl border border-surface-highlight/50">
          <StatValue label="Streak Atual" value={`${streak}W`} />
        </div>
      </div>
    </section>
  );
};
