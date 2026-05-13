import React from 'react';
import { StatValue } from '@/components/atoms';
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
  targetValue
}) => {
  return (
    <div className="bg-surface-dark border border-surface-highlight rounded-xl p-6 flex flex-col gap-6 h-full">
      <h3 className="text-lg font-bold text-content-primary">Status do Evento</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <StatValue 
          label="Inscritos" 
          value={totalParticipants} 
          description="no torneio" 
          className="text-sm"
        />
        <StatValue 
          label="Online" 
          value={onlineParticipants} 
          description="jogando agora" 
          className="text-sm text-brand-primary"
        />
      </div>

      <div className="pt-6 border-t border-surface-highlight mt-auto">
        <RewardProgress 
          currentProgress={(currentValue / targetValue) * 100} 
          nextMilestone="Próximo Aumento" 
        />
        <p className="text-xs text-content-tertiary mt-2 text-center">
          Joguem para aumentar o prêmio do cofre coletivo!
        </p>
      </div>
    </div>
  );
};
