import React from 'react';
import { VaultParticipant } from '@/features/vault/vault.schema';
import { Shield, Trophy, Target } from 'lucide-react';

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
        <div className="flex h-10 w-10 items-center justify-center bg-[var(--dl-tactical-yellow)]/[0.1] text-[var(--dl-tactical-yellow)] [clip-path:var(--dl-cut-button)]">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-['Rajdhani'] text-xl font-bold uppercase text-white">Seu Progresso</h3>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--dl-tactical-green)]">Operador Ativo</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] p-4 [clip-path:var(--dl-cut-button)] text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-tactical-muted)] mb-1">Pontos Acumulados</p>
          <div className="flex items-center justify-center gap-2 font-['Rajdhani'] text-3xl font-bold text-[var(--dl-tactical-yellow)]">
            <Trophy className="h-5 w-5" />
            {totalPoints}
          </div>
        </div>
        <div className="bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] p-4 [clip-path:var(--dl-cut-button)] text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-tactical-muted)] mb-1">Missões Concluídas</p>
          <div className="flex items-center justify-center gap-2 font-['Rajdhani'] text-3xl font-bold text-white">
            <Target className="h-5 w-5" />
            {completedMissionsCount}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide">
          <span className="text-[var(--dl-tactical-muted)]">Aproveitamento</span>
          <span className="text-[var(--dl-tactical-yellow)]">{percentage}%</span>
        </div>
        <div className="dl-progress">
          <div 
            className="dl-progress-bar bg-[var(--dl-tactical-yellow)] shadow-[0_0_10px_rgba(255,226,102,0.5)]" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>
    </div>
  );
};
