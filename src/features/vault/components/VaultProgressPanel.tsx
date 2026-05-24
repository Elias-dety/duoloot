import React from 'react';
import { VaultParticipant } from '@/features/vault/vault.schema';
import { ASSETS } from '@/constants/assets';

interface VaultProgressPanelProps {
  participant: VaultParticipant;
  totalPoints: number;
  percentage: number;
  completedMissionsCount: number;
}

export const VaultProgressPanel: React.FC<VaultProgressPanelProps> = ({
  totalPoints,
  percentage,
  completedMissionsCount,
}) => {
  return (
    <div className="dl-panel p-6" style={{ borderColor: 'rgba(255,226,102,0.25)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center bg-[var(--dl-keyword)]/[0.1] text-[var(--dl-keyword)] rounded-[1rem]">
          <img src={ASSETS.icons.vaultKey} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
        </div>
        <div>
          <h3 className="font-['Rajdhani'] text-xl font-bold uppercase text-white">Seu Progresso</h3>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--dl-success)]">Operador Ativo</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--dl-surface)] border border-[var(--dl-border)] p-4 rounded-[1rem] text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)] mb-1">Pontos Acumulados</p>
          <div className="flex items-center justify-center gap-2 font-['Rajdhani'] text-3xl font-bold text-[var(--dl-keyword)]">
            <img src={ASSETS.rewards.duocoinsThumb} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
            {totalPoints}
          </div>
        </div>
        <div className="bg-[var(--dl-surface)] border border-[var(--dl-border)] p-4 rounded-[1rem] text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)] mb-1">Missões Concluídas</p>
          <div className="flex items-center justify-center gap-2 font-['Rajdhani'] text-3xl font-bold text-white">
            <img src={ASSETS.icons.mission} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
            {completedMissionsCount}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide">
          <span className="text-[var(--dl-muted)]">Aproveitamento</span>
          <span className="text-[var(--dl-keyword)]">{percentage}%</span>
        </div>
        <div className="dl-progress">
          <div 
            className="dl-progress-bar bg-[var(--dl-keyword)] shadow-[0_0_10px_rgba(255,226,102,0.5)]" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>
    </div>
  );
};
