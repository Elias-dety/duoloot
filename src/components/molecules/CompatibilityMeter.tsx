import React from 'react';
import { ProgressBar, Badge } from '@/components/atoms';

interface CompatibilityMeterProps {
  score: number;
  className?: string;
}

export const CompatibilityMeter: React.FC<CompatibilityMeterProps> = ({ score, className = '' }) => {
  const getVariant = () => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const getLabel = () => {
    if (score >= 80) return 'Alta compatibilidade';
    if (score >= 50) return 'Media compatibilidade';
    return 'Baixa compatibilidade';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-end justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-content-muted">Match de perfil</span>
        <span className={`text-lg font-bold ${score >= 80 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-danger'}`}>
          {score}%
        </span>
      </div>

      <ProgressBar value={score} color={getVariant()} size="md" />

      <Badge variant={getVariant()} className="mt-1 w-fit">
        {getLabel()}
      </Badge>
    </div>
  );
};
