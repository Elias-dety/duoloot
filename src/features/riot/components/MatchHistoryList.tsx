import React from 'react';
import { DuolootCard } from '@/components/duoloot';

export interface RiotMatchMock {
  id: string;
  result: 'VICTORY' | 'DEFEAT' | 'DRAW';
  agent: string;
  agentImageUrl?: string;
  map: string;
  score: string;
  kda: string;
  kdRatio: number;
  combatScore: number;
  date: string;
}

export function MatchHistoryList({ matches }: { matches?: RiotMatchMock[] }) {
  if (!matches || matches.length === 0) {
    return (
      <DuolootCard variant="muted" className="w-full flex items-center justify-center p-8 h-40">
        <p className="text-[var(--dl-muted-light)] text-sm font-semibold uppercase tracking-wider">
          Nenhuma partida encontrada.
        </p>
      </DuolootCard>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-4">Últimas Partidas</h3>
      
      {matches.map((match) => (
        <DuolootCard 
          key={match.id} 
          variant="default" 
          className="flex items-center justify-between p-3 sm:p-4 hover:border-[var(--dl-keyword)] transition-colors cursor-pointer group"
        >
          {/* Left Side: Agent + Map + Result */}
          <div className="flex items-center gap-4">
            <div className={`w-1.5 h-12 rounded-full ${
              match.result === 'VICTORY' ? 'bg-[var(--dl-string)]' : 
              match.result === 'DEFEAT' ? 'bg-[var(--dl-error)]' : 'bg-[var(--dl-muted-light)]'
            }`} />
            
            <div className="w-12 h-12 rounded-xl bg-[var(--dl-surface-2)] border border-[var(--dl-border)] overflow-hidden shrink-0">
              {match.agentImageUrl ? (
                <img src={match.agentImageUrl} alt={match.agent} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[var(--dl-muted)]">
                  {match.agent.substring(0, 3).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className={`text-sm font-bold uppercase ${
                match.result === 'VICTORY' ? 'text-[var(--dl-string)]' : 
                match.result === 'DEFEAT' ? 'text-[var(--dl-error)]' : 'text-[var(--dl-muted-light)]'
              }`}>
                {match.result === 'VICTORY' ? 'Vitória' : match.result === 'DEFEAT' ? 'Derrota' : 'Empate'} {match.score}
              </span>
              <span className="text-xs font-semibold text-white">{match.map}</span>
              <span className="text-[10px] text-[var(--dl-muted-light)] mt-0.5">{match.date}</span>
            </div>
          </div>

          {/* Right Side: Stats */}
          <div className="flex items-center gap-6 text-right">
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)]">KDA</span>
              <span className="text-sm font-bold text-[var(--dl-number)]">{match.kda}</span>
            </div>
            
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)]">ACS</span>
              <span className="text-sm font-bold text-[var(--dl-function)]">{match.combatScore}</span>
            </div>
            
            <div className="text-[var(--dl-muted-light)] group-hover:text-[var(--dl-keyword)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </DuolootCard>
      ))}
    </div>
  );
}
