import React from 'react';
import { Button } from '@/components/atoms';
import { VaultMission, VaultMissionProgress } from '@/features/vault/vault.schema';
import { CheckCircle2, ChevronRight, Target } from 'lucide-react';

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
    <div className={`dl-panel p-5 relative overflow-hidden flex flex-col justify-between ${isCompleted ? 'border-[var(--dl-tactical-green)] bg-[var(--dl-tactical-green)]/[0.02]' : ''}`}>
      {isCompleted && (
        <div className="absolute top-0 right-0 p-2 bg-[var(--dl-tactical-green)] text-black [clip-path:polygon(0_0,100%_0,100%_100%,20px_100%)]">
          <CheckCircle2 className="h-4 w-4 ml-3" />
        </div>
      )}

      <div>
        <div className="flex items-start justify-between mb-2 pr-6">
          <h3 className={`font-['Rajdhani'] text-xl font-bold uppercase ${isCompleted ? 'text-[var(--dl-tactical-green)]' : 'text-white'}`}>
            {mission.title}
          </h3>
        </div>
        <p className="text-[12px] text-[var(--dl-tactical-muted)] mb-4 min-h-[36px]">
          {mission.description}
        </p>
      </div>

      <div className="space-y-4">
        {participantExists && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="text-[var(--dl-tactical-muted)]">Progresso</span>
              <span className="text-white">{currentValue} / {targetValue}</span>
            </div>
            <div className="dl-progress h-1.5">
              <div 
                className={`dl-progress-bar ${isCompleted ? 'bg-[var(--dl-tactical-green)]' : 'bg-[var(--dl-tactical-yellow)]'}`} 
                style={{ width: `${percentage}%` }} 
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[var(--dl-tactical-line)]">
          <div className="flex items-center gap-1.5 text-[var(--dl-tactical-yellow)] font-bold font-['Rajdhani'] text-lg">
            <Target className="h-4 w-4" />
            +{mission.points_reward} <span className="text-[12px] text-[var(--dl-tactical-muted)] uppercase tracking-wide ml-1">pts</span>
          </div>

          {participantExists && !isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClaim(mission.id)}
              disabled={isSubmitting}
              className="h-8 text-[11px] gap-1 hover:bg-[var(--dl-tactical-yellow)] hover:text-black border border-[var(--dl-tactical-yellow)] text-[var(--dl-tactical-yellow)]"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar'}
              <ChevronRight className="h-3 w-3" />
            </Button>
          )}

          {participantExists && isCompleted && (
            <span className="text-[11px] font-bold uppercase text-[var(--dl-tactical-green)] flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Concluída
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
