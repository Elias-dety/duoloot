import React from 'react';
import { Badge, Button, Card, ProgressBar } from '@/components/atoms';
import { Mission } from '@/schemas/mission.schema';

export interface MissionCardProps {
  mission: Mission;
  onClaim?: (id: string) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onClaim }) => {
  return (
    <Card variant={mission.isCompleted ? 'prize' : 'interactive'} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="mb-1 text-lg font-black text-content-primary">{mission.title}</h3>
          <p className="line-clamp-2 text-sm text-content-secondary">{mission.description}</p>
        </div>
        <Badge variant={mission.isCompleted ? 'success' : 'gold'} className="shrink-0">
          {mission.reward.amount} {mission.reward.currency}
        </Badge>
      </div>

      <div className="mt-2 flex-1">
        <div className="mb-1.5 flex justify-between text-xs font-bold uppercase text-content-muted">
          <span>Progresso</span>
          <span>{mission.progress}%</span>
        </div>
        <ProgressBar value={mission.progress} color={mission.isCompleted ? 'success' : 'primary'} size="sm" />
      </div>

      <div className="mt-2 border-t border-border pt-4">
        <Button
          variant={mission.isCompleted ? 'success' : 'secondary'}
          className="w-full"
          disabled={!mission.isCompleted}
          onClick={() => onClaim && onClaim(mission.id)}
        >
          {mission.isCompleted ? 'Resgatar recompensa' : 'Em andamento'}
        </Button>
      </div>
    </Card>
  );
};
