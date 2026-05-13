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
    <div className={`bg-surface-base/30 border border-surface-highlight/50 p-3 rounded-lg flex justify-between items-center ${className}`}>
      <StatValue label={label} value={value} className="gap-0" />
      
      {trend && (
        <div className={`text-xs font-bold ${
          trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-content-muted'
        }`}>
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {trend === 'neutral' && '•'}
        </div>
      )}
    </div>
  );
};
