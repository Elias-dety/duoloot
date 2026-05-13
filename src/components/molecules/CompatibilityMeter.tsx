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
    if (score >= 80) return 'Alta Compatibilidade';
    if (score >= 50) return 'Média Compatibilidade';
    return 'Baixa Compatibilidade';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-end">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Match de Perfil
        </span>
        <span className={`text-lg font-bold ${score >= 80 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-danger'}`}>
          {score}%
        </span>
      </div>
      
      <ProgressBar value={score} color={getVariant()} size="md" />
      
      <Badge variant={getVariant()} className="w-fit mt-1">
        {getLabel()}
      </Badge>
    </div>
  );
};
