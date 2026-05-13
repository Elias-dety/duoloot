import React from 'react';
import { Card, SectionTitle } from '@/components/atoms';
import { CountdownTimer, PrizeBox, RewardProgress } from '@/components/molecules';

export interface VaultEventSectionProps {
  title?: string;
  prizeAmount: number;
  currency?: string;
  endsAt: Date;
  currentValue: number;
  targetValue: number;
  status?: 'active' | 'completed' | 'upcoming';
}

export const VaultEventSection: React.FC<VaultEventSectionProps> = ({
  title = 'Cofre Semanal',
  prizeAmount,
  currency = 'R$',
  endsAt,
  currentValue,
  targetValue,
  status = 'active',
}) => {
  return (
    <Card variant="prize" className="w-full">
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <SectionTitle
          title={title}
          subtitle="Acumule pontos para bater a meta e liberar o premio coletivo."
          accent="prize"
        />
        <div className="rounded-2xl border border-prize/25 bg-surface-card px-4 py-3">
          <CountdownTimer targetDate={endsAt.toISOString()} size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(260px,0.8fr)_1fr]">
        <PrizeBox
          amount={prizeAmount}
          currency={currency}
          status={status === 'completed' ? 'ended' : 'active'}
        />
        <div className="flex flex-col justify-center rounded-2xl border border-brand-primary/20 bg-surface-elevated p-5">
          <RewardProgress
            currentProgress={(currentValue / targetValue) * 100}
            nextMilestone="Proximo aumento"
            rewardValue="bonus ativo"
          />
        </div>
      </div>
    </Card>
  );
};
