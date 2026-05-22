import React from 'react';
import { Button } from '@/components/atoms';
import { VaultMission, VaultMissionProgress } from '@/features/vault/vault.schema';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { ASSETS } from '@/constants/assets';

interface VaultMissionCardProps {
  mission: VaultMission & { progress: VaultMissionProgress | null };
  onClaim: (missionId: string) => void;
  isSubmitting: boolean;
  participantExists: boolean;
}

export const VaultMissionCard: React.FC<VaultMissionCardProps> = ({
  mission,
  onClaim,
  isSubmitting,
  participantExists,
}) => {
  const isCompleted = mission.progress?.completed || false;
  const currentValue = mission.progress?.current_value || 0;
  const targetValue = mission.target_value;
  const percentage = Math.min(100, Math.round((currentValue / targetValue) * 100));

  return (
    <div className={`dl-panel relative flex flex-col justify-between overflow-hidden p-5 ${isCompleted ? 'border-[var(--dl-border-red)] bg-[rgba(255,70,85,0.08)]' : ''}`}>
      {isCompleted ? (
        <div className="absolute right-0 top-0 bg-[var(--dl-red)] p-2 text-white [clip-path:polygon(0_0,100%_0,100%_100%,20px_100%)]">
          <CheckCircle2 className="ml-3 h-4 w-4" />
        </div>
      ) : null}

      <div>
        <div className="mb-2 flex items-start justify-between pr-6">
          <div className="flex items-center gap-3">
            <img src={isCompleted ? ASSETS.rewards.lootBoxSmallThumb : ASSETS.vault.keyThumb} alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
            <h3 className={`font-['Rajdhani'] text-xl font-bold uppercase ${isCompleted ? 'text-white' : 'text-white'}`}>
              {mission.title}
            </h3>
          </div>
        </div>
        <p className="mb-4 min-h-[36px] text-[12px] text-[var(--dl-muted-light)]">
          {mission.description}
        </p>
      </div>

      <div className="space-y-4">
        {participantExists ? (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="text-[var(--dl-muted-light)]">Progresso</span>
              <span className="text-white">{currentValue} / {targetValue}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full border border-[var(--dl-border)] bg-white/[0.06]">
              <div
                className={`h-full transition-all duration-300 ${isCompleted ? 'bg-[var(--dl-red)]' : 'bg-[var(--dl-red-soft)]'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t border-[var(--dl-border)] pt-3">
          <div className="flex items-center gap-1.5 font-['Rajdhani'] text-lg font-bold text-white">
            <img src={ASSETS.icons.mission} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
            +{mission.points_reward} <span className="ml-1 text-[12px] uppercase tracking-wide text-[var(--dl-muted-light)]">pts</span>
          </div>

          {participantExists && !isCompleted ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onClaim(mission.id)}
              disabled={isSubmitting}
              className="gap-1 border-[var(--dl-border-red)] text-white"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar'}
              <ChevronRight className="h-3 w-3" />
            </Button>
          ) : null}

          {participantExists && isCompleted ? (
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase text-white">
              <CheckCircle2 className="h-3 w-3" /> Concluída
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
