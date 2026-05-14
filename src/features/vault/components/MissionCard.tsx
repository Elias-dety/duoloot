import React from 'react';
import { Badge, Button, ProgressBar } from '@/components/atoms';
import { Mission } from '@/schemas/mission.schema';

export interface MissionCardProps {
  mission: Mission;
  onClaim?: (id: string) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onClaim }) => {
  return (
    <div
      className="dl-panel flex flex-col gap-4 p-5 transition-all hover:translate-y-[-4px]"
      style={{
        borderColor: mission.isCompleted ? 'rgba(255,226,102,0.3)' : 'var(--dl-tactical-line)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="mb-1 font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-tactical-text)]">{mission.title}</h3>
          <p className="line-clamp-2 text-[12px] text-[var(--dl-tactical-muted)]">{mission.description}</p>
        </div>
        <Badge variant={mission.isCompleted ? 'gold' : 'warning'} className="shrink-0">
          {mission.reward.amount} {mission.reward.currency}
        </Badge>
      </div>

      {/* Progress */}
      <div className="mt-2 flex-1">
        <div className="mb-1.5 flex justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--dl-tactical-muted)]">
          <span>Progresso</span>
          <span className={mission.isCompleted ? 'text-[var(--dl-tactical-green)]' : 'text-[var(--dl-tactical-yellow)]'}>
            {mission.progress}%
          </span>
        </div>
        <ProgressBar value={mission.progress} color={mission.isCompleted ? 'success' : 'primary'} size="sm" />
      </div>

      {/* Action */}
      <div className="mt-2 border-t border-[var(--dl-tactical-line)] pt-4">
        <Button
          variant={mission.isCompleted ? 'tactical-yellow' : 'secondary'}
          className="w-full"
          disabled={!mission.isCompleted}
          onClick={() => onClaim && onClaim(mission.id)}
        >
          {mission.isCompleted ? 'Resgatar recompensa' : 'Em andamento'}
        </Button>
      </div>
    </div>
  );
};
