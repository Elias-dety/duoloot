import React from 'react';
import { StatValue } from '@/components/atoms';

interface PlayerStatProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const PlayerStat: React.FC<PlayerStatProps> = ({ label, value, trend, className = '' }) => {
  return (
    <div className={`flex items-center justify-between rounded-lg border border-border bg-surface-elevated p-3 ${className}`}>
      <StatValue label={label} value={value} className="gap-0" />

      {trend && (
        <div className={`text-xs font-bold ${
          trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-content-muted'
        }`}>
          {trend === 'up' && 'up'}
          {trend === 'down' && 'down'}
          {trend === 'neutral' && 'stable'}
        </div>
      )}
    </div>
  );
};
