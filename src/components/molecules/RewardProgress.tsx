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
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-zinc-300">
          Progresso da Missão
        </span>
        <span className="text-sm font-bold text-indigo-400">
          {currentProgress}%
        </span>
      </div>

      <ProgressBar value={currentProgress} color="primary" size="md" />

      {(nextMilestone || rewardValue) && (
        <div className="flex justify-between items-center mt-1">
          {nextMilestone && (
            <span className="text-[11px] text-zinc-500 uppercase font-semibold">
              Próximo: {nextMilestone}
            </span>
          )}
          {rewardValue && (
            <span className="text-[11px] text-emerald-500 font-bold uppercase">
              Ganho: {rewardValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
