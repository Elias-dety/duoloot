import React from 'react';
import { Card } from '@/components/atoms';;

export interface MapStatMock {
  mapName: string;
  winRate: number;
  matchesPlayed: number;
}

export function MapStatsGrid({ stats }: { stats?: MapStatMock[] }) {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dl-muted-light)]">Top Mapas</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} variant="elevated" className="p-4 flex flex-col items-center text-center">
            <span className="text-sm font-bold text-white mb-2">{stat.mapName}</span>
            <span className={`text-lg font-bold mb-1 ${stat.winRate >= 50 ? 'text-[var(--dl-string)]' : 'text-[var(--dl-warning)]'}`}>
              {stat.winRate}%
            </span>
            <span className="text-[10px] font-semibold text-[var(--dl-muted-light)] uppercase tracking-wider">
              {stat.matchesPlayed} Partidas
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
