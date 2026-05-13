import React from 'react';
import { Avatar, Badge, Card, StatValue } from '@/components/atoms';
import { Player } from '@/schemas/player.schema';
import { DashboardSummary as DashboardSummaryType } from '@/schemas/dashboardSummary.schema';

export interface DashboardSummaryProps {
  player: Player;
  summary: DashboardSummaryType;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ player, summary }) => {
  const { name, nickname, avatarUrl, status, isPremium, gameProfile, stats, metadata } = player;
  const kd = (metadata?.kd as number) || stats.averageKda;
  const streak = (metadata?.streak as number) || 3;
  const matches = stats.matchesPlayed;
  const winRate = stats.winRate;
  const wins = Math.round(matches * (winRate / 100));

  return (
    <Card variant="default" className="w-full">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Avatar src={avatarUrl} alt={nickname} fallback={nickname} size="lg" />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-content-base">{nickname}</h2>
              {isPremium && <Badge variant="premium">Premium</Badge>}
            </div>
            <p className="text-sm text-content-muted">{name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-content-muted">
              <span className="flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${status === 'online' ? 'bg-success' : status === 'in-game' ? 'bg-info' : 'bg-content-muted'}`} />
                {status}
              </span>
              <span className="font-medium text-prize">{gameProfile.rank}</span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className="mb-1 text-sm text-content-muted">Ganhos Totais</p>
          <p className="text-2xl font-black text-success">R$ {summary.totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-surface-elevated p-4">
          <StatValue label="Partidas" value={matches} />
        </div>
        <div className="rounded-xl border border-border bg-surface-elevated p-4">
          <StatValue label="Vitorias" value={wins} tone="success" />
        </div>
        <div className="rounded-xl border border-border bg-surface-elevated p-4">
          <StatValue label="Winrate" value={`${winRate.toFixed(1)}%`} tone="success" />
        </div>
        <div className="rounded-xl border border-border bg-surface-elevated p-4">
          <StatValue label="K/D Ratio" value={kd.toFixed(2)} tone="info" />
        </div>
        <div className="rounded-xl border border-border bg-surface-elevated p-4">
          <StatValue label="Streak Atual" value={`${streak}W`} tone="prize" />
        </div>
      </div>
    </Card>
  );
};
