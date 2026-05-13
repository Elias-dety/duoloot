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
    <div className={`bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-lg flex justify-between items-center ${className}`}>
      <StatValue label={label} value={value} className="gap-0" />
      
      {trend && (
        <div className={`text-xs font-bold ${
          trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-zinc-500'
        }`}>
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {trend === 'neutral' && '•'}
        </div>
      )}
    </div>
  );
};
