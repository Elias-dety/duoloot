import React from 'react';
import { SectionTitle, Badge } from '@/components/atoms';

export const RecentPerformancePanel: React.FC = () => {
  const recentMatches = [
    { id: 1, result: 'Vitória', score: '13-10', agent: 'Jett', kda: '24/12/5', isMvp: true },
    { id: 2, result: 'Derrota', score: '11-13', agent: 'Sova', kda: '14/15/8', isMvp: false },
    { id: 3, result: 'Vitória', score: '13-8', agent: 'Omen', kda: '18/10/12', isMvp: false },
    { id: 4, result: 'Vitória', score: '13-5', agent: 'Jett', kda: '28/9/3', isMvp: true },
  ];

  return (
    <section className="w-full p-6 bg-surface-dark border border-surface-highlight rounded-2xl flex flex-col h-full">
      <SectionTitle title="Desempenho Recente" subtitle="Últimas 4 partidas" />
      
      <div className="mt-4 flex-1 flex flex-col gap-3">
        {recentMatches.map((match) => (
          <div key={match.id} className="flex items-center justify-between p-3 bg-surface-base rounded-xl border border-surface-highlight/50">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-10 rounded-full ${match.result === 'Vitória' ? 'bg-success' : 'bg-danger'}`} />
              <div>
                <p className="font-bold text-content-base">{match.result} <span className="text-content-muted font-normal text-sm ml-1">{match.score}</span></p>
                <p className="text-xs text-content-muted">{match.agent}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                {match.isMvp && <Badge variant="premium" className="text-[10px] px-1 py-0 h-4">MVP</Badge>}
                <p className="font-medium text-content-base">{match.kda}</p>
              </div>
              <p className="text-xs text-content-muted">K/D/A</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
