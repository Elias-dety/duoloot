import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'primary',
  size = 'sm',
  className = '',
}) => {
  const safeValue = Math.min(100, Math.max(0, value));

  const colors = {
    primary: 'bg-indigo-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const baseStyles = 'w-full bg-zinc-800 overflow-hidden rounded-full';
  const containerClasses = [baseStyles, sizes[size], className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} role="progressbar" aria-valuenow={safeValue} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`h-full transition-all duration-300 ease-in-out ${colors[color]}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};
