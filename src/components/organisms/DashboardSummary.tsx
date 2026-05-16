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
    <article className="dl-panel w-full p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Avatar src={avatarUrl} alt={nickname} fallback={nickname} size="lg" />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h2 className="font-['Rajdhani'] text-3xl font-bold uppercase leading-none text-white">{nickname}</h2>
              {isPremium && <span className="dl-stamp dl-stamp-purple">Premium</span>}
            </div>
            <p className="text-[13px] uppercase tracking-wide text-[var(--dl-tactical-muted)]">{name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">
              <span className="flex items-center gap-1">
                <span className={`h-2 w-2 [clip-path:var(--dl-cut-button)] ${status === 'online' ? 'bg-[var(--dl-tactical-green)]' : status === 'in-game' ? 'bg-[var(--dl-tactical-blue)]' : 'bg-white/20'}`} />
                {status}
              </span>
              <span className="text-[var(--dl-tactical-yellow)]">{gameProfile.rank}</span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--dl-tactical-muted)]">Ganhos Totais</p>
          <p className="font-['Rajdhani'] text-3xl font-bold text-[var(--dl-tactical-green)]">R$ {summary.totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="border border-[var(--dl-tactical-line)] bg-white/[0.02] p-4 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Partidas" value={matches} />
        </div>
        <div className="border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.05)] p-4 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Vitórias" value={wins} tone="success" />
        </div>
        <div className="border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.05)] p-4 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Winrate" value={`${winRate.toFixed(1)}%`} tone="success" />
        </div>
        <div className="border border-[rgba(56,189,248,0.3)] bg-[rgba(56,189,248,0.05)] p-4 [clip-path:var(--dl-cut-button)]">
          <StatValue label="K/D Ratio" value={kd.toFixed(2)} tone="info" />
        </div>
        <div className="border border-[rgba(234,179,8,0.3)] bg-[rgba(234,179,8,0.05)] p-4 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Streak Atual" value={`${streak}W`} tone="prize" />
        </div>
      </div>
    </article>
  );
};
