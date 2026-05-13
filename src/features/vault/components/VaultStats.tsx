import React from 'react';
import { Card, StatValue } from '@/components/atoms';
import { RewardProgress } from '@/components/molecules';

export interface VaultStatsProps {
  totalParticipants: number;
  onlineParticipants: number;
  currentValue: number;
  targetValue: number;
}

export const VaultStats: React.FC<VaultStatsProps> = ({
  totalParticipants,
  onlineParticipants,
  currentValue,
  targetValue,
}) => {
  return (
    <Card variant="elevated" className="flex h-full flex-col gap-6">
      <h3 className="text-lg font-black text-content-primary">Status do Evento</h3>

      <div className="grid grid-cols-2 gap-4">
        <StatValue label="Inscritos" value={totalParticipants} description="no torneio" tone="info" />
        <StatValue label="Online" value={onlineParticipants} description="jogando agora" tone="success" />
      </div>

      <div className="mt-auto border-t border-border pt-6">
        <RewardProgress currentProgress={(currentValue / targetValue) * 100} nextMilestone="Proximo aumento" />
        <p className="mt-2 text-center text-xs text-content-muted">Joguem para aumentar o premio do cofre coletivo.</p>
      </div>
    </Card>
  );
};
