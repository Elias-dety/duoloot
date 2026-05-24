import React from 'react';
import { StatValue } from '@/components/atoms';
import { VaultEvent } from '@/features/vault/vault.schema';
import { ASSETS } from '@/constants/assets';

export interface VaultStatsPanelProps {
  event: VaultEvent;
  participantCount: number;
}

export const VaultStatsPanel: React.FC<VaultStatsPanelProps> = ({
  event,
  participantCount,
}) => {
  const currentPoints = event.current_points || 0;
  const goalPoints = event.goal_points || 1000;
  const percentage = Math.min(100, Math.round((currentPoints / goalPoints) * 100));
  
  const endsAt = event.ends_at ? new Date(event.ends_at) : null;
  const now = new Date();
  const timeRemaining = endsAt ? Math.max(0, Math.floor((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="dl-panel flex h-full flex-col gap-6 p-5" style={{ borderColor: 'rgba(255,226,102,0.25)' }}>
      <h3 className="font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-keyword)] flex items-center gap-2">
        <img src={ASSETS.vault.openRewardsThumb} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
        Status da Operação
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3 rounded-[1rem]">
          <StatValue label="Participantes" value={participantCount} description="Operadores" tone="info" />
        </div>
        <div className="border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3 rounded-[1rem]">
          <StatValue label="Restante" value={`${timeRemaining} d`} description="Prazo limite" tone="danger" />
        </div>
      </div>

      <div className="mt-auto border-t border-[var(--dl-border)] pt-6">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide mb-2">
          <span className="text-[var(--dl-muted)]">Progresso Global</span>
          <span className="text-[var(--dl-keyword)]">{currentPoints} / {goalPoints} pts</span>
        </div>
        <div className="dl-progress h-2">
          <div 
            className="dl-progress-bar bg-[var(--dl-keyword)]" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
        <p className="mt-4 text-center text-[11px] text-[var(--dl-muted)] leading-relaxed">
          <img src={ASSETS.rewards.duocoinsThumb} alt="DuoCoins" loading="lazy" decoding="async" className="mx-auto mb-2 h-14 w-14 object-contain" />
          Complete os contratos para desbloquear o <span className="text-[var(--dl-keyword)]">{event.prize_label}</span> de <span className="font-bold text-white">{event.prize_value} DuoCoins</span>!
        </p>
      </div>
    </div>
  );
};
