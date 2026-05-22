import React from 'react';
import { DuolootCard } from '@/components/duoloot';
import { ProgressBar } from '@/components/atoms';

// Mock types for now
export interface RiotPlayerStats {
  winRate: number;
  kda: number;
  headshotRate: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  averageScore: number;
  currentRank: string;
}

export function PlayerStatsOverview({ stats }: { stats?: RiotPlayerStats }) {
  if (!stats) {
    return (
      <DuolootCard variant="muted" className="w-full flex items-center justify-center p-8 h-40">
        <p className="text-[var(--dl-muted-light)] text-sm font-semibold uppercase tracking-wider">
          Estatísticas não disponíveis. Sincronize sua conta Riot.
        </p>
      </DuolootCard>
    );
  }

  return (
    <DuolootCard variant="default" className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold uppercase tracking-wider text-white">Visão Geral de Performance</h3>
        <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-[var(--dl-border)] text-xs font-bold text-[var(--dl-muted-light)] uppercase tracking-wider">
          {stats.matchesPlayed} Partidas Analisadas
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Win Rate */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)]">Win Rate</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-[var(--dl-string)]">{stats.winRate}%</span>
            <span className="text-xs font-medium text-[var(--dl-muted-light)] mb-1">
              ({stats.wins}V - {stats.losses}D)
            </span>
          </div>
          <ProgressBar value={stats.winRate} color="success" size="sm" className="mt-1" />
        </div>

        {/* KDA */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)]">KDA Médio</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-[var(--dl-number)]">{stats.kda.toFixed(2)}</span>
          </div>
          <ProgressBar value={Math.min((stats.kda / 3) * 100, 100)} color="info" size="sm" className="mt-1" />
        </div>

        {/* Headshot Rate */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)]">Taxa de Headshot</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-[var(--dl-keyword)]">{stats.headshotRate}%</span>
          </div>
          <ProgressBar value={stats.headshotRate} color="primary" size="sm" className="mt-1" />
        </div>

        {/* ACS */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)]">ACS Médio</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-[var(--dl-function)]">{Math.round(stats.averageScore)}</span>
          </div>
          <ProgressBar value={Math.min((stats.averageScore / 300) * 100, 100)} color="premium" size="sm" className="mt-1" />
        </div>
      </div>
    </DuolootCard>
  );
}
