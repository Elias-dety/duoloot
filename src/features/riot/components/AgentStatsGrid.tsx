import React from 'react';
import { Card } from '@/components/atoms';

export interface AgentStatMock {
  agentName: string;
  agentRole: string;
  winRate: number;
  matchesPlayed: number;
  kda: number;
}

export function AgentStatsGrid({ stats }: { stats?: AgentStatMock[] }) {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dl-muted-light)]">Top Agentes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} variant="elevated" className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--dl-surface-2)] border border-[var(--dl-border)] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-[var(--dl-muted)]">{stat.agentName.substring(0,3).toUpperCase()}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm font-bold text-white truncate">{stat.agentName}</span>
                <span className={`text-xs font-bold ${stat.winRate >= 50 ? 'text-[var(--dl-string)]' : 'text-[var(--dl-warning)]'}`}>
                  {stat.winRate}% WR
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--dl-muted-light)]">
                <span>{stat.matchesPlayed} partidas</span>
                <span>{stat.kda.toFixed(2)} KDA</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
