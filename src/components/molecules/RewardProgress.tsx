import React from 'react';
import { ProgressBar } from '@/components/atoms';

interface RewardProgressProps {
  currentProgress: number;
  nextMilestone?: string;
  rewardValue?: string;
  className?: string;
}

export const RewardProgress: React.FC<RewardProgressProps> = ({
  currentProgress,
  nextMilestone,
  rewardValue,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-content-secondary">Progresso da missao</span>
        <span className="text-sm font-bold text-info">{currentProgress}%</span>
      </div>

      <ProgressBar value={currentProgress} color="primary" size="md" />

      {(nextMilestone || rewardValue) && (
        <div className="mt-1 flex items-center justify-between">
          {nextMilestone && (
            <span className="text-[11px] font-semibold uppercase text-content-muted">
              Proximo: {nextMilestone}
            </span>
          )}
          {rewardValue && <span className="text-[11px] font-bold uppercase text-success">Ganho: {rewardValue}</span>}
        </div>
      )}
    </div>
  );
};
