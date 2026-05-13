import React from 'react';
import { SectionTitle, SkeletonBlock } from '@/components/atoms';
import { PlayerStat } from '@/components/molecules';

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
  title = "Últimos Vencedores", 
  winners, 
  isLoading = false 
}) => {
  return (
    <section className="w-full">
      <div className="mb-6">
        <SectionTitle title={title} />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} width="100%" height="72px" className="rounded-lg" />
          ))}
        </div>
      ) : winners.length === 0 ? (
        <div className="w-full py-10 bg-surface-dark rounded-xl border border-surface-highlight flex flex-col items-center justify-center">
          <span className="text-content-secondary">Ainda não há vencedores.</span>
          <p className="text-sm text-content-tertiary mt-1">Seja o primeiro a abrir o cofre!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {winners.map((winner) => (
            <div key={winner.id} className="bg-surface-dark border border-surface-highlight rounded-lg p-4 flex items-center justify-between hover:bg-surface-highlight/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-highlight flex items-center justify-center overflow-hidden">
                  {winner.avatarUrl ? (
                    <img src={winner.avatarUrl} alt={winner.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-content-primary font-bold text-sm">{winner.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-content-primary font-medium">{winner.username}</h4>
                  <span className="text-xs text-content-tertiary">{winner.date}</span>
                </div>
              </div>
              <PlayerStat label="Prêmio" value={winner.prizeWon} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
