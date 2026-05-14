import React from 'react';
import { Avatar, SectionTitle, SkeletonBlock, StatValue } from '@/components/atoms';

export interface Winner {
  id: string;
  username: string;
  avatarUrl?: string;
  prizeWon: string;
  date: string;
}

export interface WinnersListProps {
  title?: string;
  winners: Winner[];
  isLoading?: boolean;
}

export const WinnersList: React.FC<WinnersListProps> = ({
  title = 'Últimos Vencedores',
  winners,
  isLoading = false,
}) => {
  return (
    <section className="w-full">
      <div className="mb-6">
        <SectionTitle title={title} accent="prize" />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="dl-panel p-4 min-h-[72px] animate-pulse">
              <SkeletonBlock width="100%" height="40px" className="bg-[var(--dl-tactical-metal)]" />
            </div>
          ))}
        </div>
      ) : winners.length === 0 ? (
        <div className="dl-panel flex flex-col items-center justify-center py-10 text-center p-5">
          <span className="text-[var(--dl-tactical-muted)] text-[13px]">Ainda não há vencedores.</span>
          <p className="mt-1 text-[12px] text-[var(--dl-tactical-muted)]">Seja o primeiro a abrir o cofre.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {winners.map((winner) => (
            <div
              key={winner.id}
              className="dl-panel flex items-center justify-between gap-4 p-4 transition-all hover:translate-y-[-2px]"
              style={{ borderColor: 'rgba(255,226,102,0.2)' }}
            >
              <div className="flex min-w-0 items-center gap-4">
                <Avatar src={winner.avatarUrl} alt={winner.username} fallback={winner.username} />
                <div className="min-w-0">
                  <h4 className="truncate font-bold text-[var(--dl-tactical-text)] text-[14px]">{winner.username}</h4>
                  <span className="text-[11px] text-[var(--dl-tactical-muted)] uppercase tracking-[0.08em]">{winner.date}</span>
                </div>
              </div>
              <StatValue label="Prêmio" value={winner.prizeWon} tone="prize" className="items-end text-right" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
