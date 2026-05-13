import React from 'react';
import { Button, Badge, ProgressBar } from '@/components/atoms';
import { Mission } from '@/schemas/mission.schema';

export interface MissionCardProps {
  mission: Mission;
  onClaim?: (id: string) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onClaim }) => {
  return (
    <div className="bg-surface-dark border border-surface-highlight rounded-xl p-5 hover:border-brand-primary/50 transition-colors flex flex-col gap-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-content-primary font-bold text-lg mb-1">{mission.title}</h3>
          <p className="text-sm text-content-secondary line-clamp-2">{mission.description}</p>
        </div>
        <Badge variant={mission.isCompleted ? 'success' : 'default'} className="shrink-0">
          {mission.reward.amount} {mission.reward.currency}
        </Badge>
      </div>

      <div className="flex-1 mt-2">
        <div className="flex justify-between text-xs text-content-tertiary mb-1.5">
          <span>Progresso</span>
          <span>{mission.progress}%</span>
        </div>
        <ProgressBar value={mission.progress} color={mission.isCompleted ? 'success' : 'primary'} size="sm" />
      </div>

      <div className="mt-2 pt-4 border-t border-surface-highlight">
        <Button 
          variant={mission.isCompleted ? 'primary' : 'outline'} 
          className="w-full"
          disabled={!mission.isCompleted}
          onClick={() => onClaim && onClaim(mission.id)}
        >
          {mission.isCompleted ? 'Resgatar Recompensa' : 'Em andamento'}
        </Button>
      </div>
    </div>
  );
};
