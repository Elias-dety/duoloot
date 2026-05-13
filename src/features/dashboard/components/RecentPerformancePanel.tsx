import React from 'react';
import { Badge, Card, SectionTitle } from '@/components/atoms';

export const RecentPerformancePanel: React.FC = () => {
  const recentMatches = [
    { id: 1, result: 'Vitoria', score: '13-10', agent: 'Jett', kda: '24/12/5', isMvp: true },
    { id: 2, result: 'Derrota', score: '11-13', agent: 'Sova', kda: '14/15/8', isMvp: false },
    { id: 3, result: 'Vitoria', score: '13-8', agent: 'Omen', kda: '18/10/12', isMvp: false },
    { id: 4, result: 'Vitoria', score: '13-5', agent: 'Jett', kda: '28/9/3', isMvp: true },
  ];

  return (
    <Card variant="elevated" className="flex h-full w-full flex-col">
      <SectionTitle title="Desempenho Recente" subtitle="Ultimas 4 partidas" accent="info" />

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {recentMatches.map((match) => (
          <div key={match.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-card p-3">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-2 rounded-full ${match.result === 'Vitoria' ? 'bg-success' : 'bg-danger'}`} />
              <div>
                <p className="font-bold text-content-base">
                  {match.result} <span className="ml-1 text-sm font-normal text-content-muted">{match.score}</span>
                </p>
                <p className="text-xs text-content-muted">{match.agent}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                {match.isMvp && <Badge variant="gold">MVP</Badge>}
                <p className="font-medium text-content-base">{match.kda}</p>
              </div>
              <p className="text-xs text-content-muted">K/D/A</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
