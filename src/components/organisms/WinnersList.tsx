import React from 'react';
import { Avatar, Card, SectionTitle, SkeletonBlock, StatValue } from '@/components/atoms';

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
  title = 'Ultimos Vencedores',
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
            <SkeletonBlock key={i} width="100%" height="72px" rounded="lg" />
          ))}
        </div>
      ) : winners.length === 0 ? (
        <Card variant="elevated" className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-content-secondary">Ainda nao ha vencedores.</span>
          <p className="mt-1 text-sm text-content-muted">Seja o primeiro a abrir o cofre.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {winners.map((winner) => (
            <Card key={winner.id} variant="prize" className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-4">
                <Avatar src={winner.avatarUrl} alt={winner.username} fallback={winner.username} />
                <div className="min-w-0">
                  <h4 className="truncate font-bold text-content-primary">{winner.username}</h4>
                  <span className="text-xs text-content-muted">{winner.date}</span>
                </div>
              </div>
              <StatValue label="Premio" value={winner.prizeWon} tone="prize" className="items-end text-right" />
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
