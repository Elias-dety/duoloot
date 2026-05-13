import React from 'react';
import { SectionTitle } from '@/components/atoms';
import { PrizeBox, CountdownTimer, RewardProgress } from '@/components/molecules';

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
  title = "Cofre Semanal",
  prizeAmount,
  currency = "R$",
  endsAt,
  currentValue,
  targetValue,
  status = 'active'
}) => {
  return (
    <section className="w-full bg-surface-base border border-surface-highlight rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <SectionTitle 
          title={title} 
          subtitle="Acumule pontos para bater a meta e liberar o prêmio." 
        />
          <CountdownTimer targetDate={endsAt.toISOString()} size="md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-4 flex justify-center md:justify-start">
          <PrizeBox 
            amount={prizeAmount} 
            currency={currency} 
            status={status === 'completed' ? 'ended' : 'active'} 
          />
        </div>
        <div className="md:col-span-8">
          <RewardProgress 
            currentProgress={(currentValue / targetValue) * 100} 
            nextMilestone="Próximo Aumento" 
          />
        </div>
      </div>
    </section>
  );
};
