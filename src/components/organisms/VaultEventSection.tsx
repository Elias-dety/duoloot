import React from 'react';
import { SectionTitle } from '@/components/atoms';
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
    <div className="dl-panel w-full p-5 md:p-6" style={{ borderColor: 'rgba(255,226,102,0.25)' }}>
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <SectionTitle
          title={title}
          subtitle="Acumule pontos para bater a meta e liberar o prêmio coletivo."
          accent="prize"
        />
        <div className="border border-[rgba(255,226,102,0.25)] bg-[var(--dl-tactical-metal)] px-4 py-3 [clip-path:var(--dl-cut-card)]">
          <CountdownTimer targetDate={endsAt.toISOString()} size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(260px,0.8fr)_1fr]">
        <PrizeBox
          amount={prizeAmount}
          currency={currency}
          status={status === 'completed' ? 'ended' : 'active'}
        />
        <div className="flex flex-col justify-center border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-5 [clip-path:var(--dl-cut-card)]">
          <RewardProgress
            currentProgress={(currentValue / targetValue) * 100}
            nextMilestone="Próximo aumento"
            rewardValue="bônus ativo"
          />
        </div>
      </div>
    </div>
  );
};
