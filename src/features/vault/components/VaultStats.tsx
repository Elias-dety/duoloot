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
  targetValue,
}) => {
  return (
    <div className="dl-panel flex h-full flex-col gap-6 p-5" style={{ borderColor: 'rgba(255,226,102,0.25)' }}>
      <h3 className="font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-tactical-yellow)] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--dl-tactical-yellow)] animate-pulse" />
        Status do evento
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Inscritos" value={totalParticipants} description="no torneio" tone="info" />
        </div>
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Online" value={onlineParticipants} description="jogando agora" tone="success" />
        </div>
      </div>

      <div className="mt-auto border-t border-[var(--dl-tactical-line)] pt-6">
        <RewardProgress currentProgress={(currentValue / targetValue) * 100} nextMilestone="Próximo aumento" />
        <p className="mt-2 text-center text-[11px] text-[var(--dl-tactical-muted)]">Joguem para aumentar o prêmio do cofre coletivo.</p>
      </div>
    </div>
  );
};
