import React from 'react';
import { Badge, Card, SectionTitle } from '@/components/atoms';

export const RecentPerformancePanel: React.FC = () => {
  const recentMatches = [
    { id: 1, result: 'Vitória', score: '13-10', agent: 'Jett', kda: '24/12/5', isMvp: true },
    { id: 2, result: 'Derrota', score: '11-13', agent: 'Sova', kda: '14/15/8', isMvp: false },
    { id: 3, result: 'Vitória', score: '13-8', agent: 'Omen', kda: '18/10/12', isMvp: false },
    { id: 4, result: 'Vitória', score: '13-5', agent: 'Jett', kda: '28/9/3', isMvp: true },
  ];

  return (
    <article className="dl-panel flex h-full w-full flex-col p-6">
      <div className="mb-6">
        <h3 className="dl-hud-label mb-2"><span className="text-[var(--dl-tactical-blue)]">■</span> Desempenho Recente</h3>
        <p className="text-[13px] text-[var(--dl-tactical-muted)]">Últimas 4 partidas</p>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {recentMatches.map((match) => (
          <div key={match.id} className="flex items-center justify-between border border-[var(--dl-tactical-line)] bg-white/[0.02] p-3 [clip-path:var(--dl-cut-button)]">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-2 [clip-path:var(--dl-cut-button)] ${match.result === 'Vitória' ? 'bg-[var(--dl-tactical-green)]' : 'bg-[var(--dl-tactical-red)]'}`} />
              <div>
                <p className="font-bold text-[13px] uppercase tracking-wide text-white">
                  {match.result} <span className="ml-1 font-normal text-white/50">{match.score}</span>
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">{match.agent}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                {match.isMvp && <span className="dl-stamp dl-stamp-yellow">MVP</span>}
                <p className="font-['Rajdhani'] text-lg font-bold text-white">{match.kda}</p>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--dl-tactical-muted)]">K/D/A</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};
