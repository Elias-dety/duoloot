import React from 'react';

export interface ProgressBarProps {
  value: number;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'premium' | 'info';
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

  const colors: Record<string, string> = {
    primary: 'bg-gradient-to-r from-[var(--dl-tactical-green)] to-[var(--dl-tactical-yellow)] shadow-[0_0_16px_rgba(255,226,102,0.45)]',
    success: 'bg-[var(--dl-tactical-green)] shadow-[0_0_12px_rgba(56,242,139,0.3)]',
    warning: 'bg-[var(--dl-tactical-yellow)] shadow-[0_0_12px_rgba(255,226,102,0.3)]',
    error: 'bg-[var(--dl-tactical-red)] shadow-[0_0_12px_rgba(255,51,102,0.3)]',
    premium: 'bg-[var(--dl-tactical-purple)] shadow-[0_0_12px_rgba(141,92,255,0.3)]',
    info: 'bg-[var(--dl-tactical-blue)] shadow-[0_0_12px_rgba(70,183,255,0.3)]',
  };

  const sizes: Record<string, string> = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const containerClasses = [
    'w-full overflow-hidden border border-[var(--dl-tactical-line)] bg-[rgba(255,255,255,0.06)] [clip-path:var(--dl-cut-button)]',
    sizes[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} role="progressbar" aria-valuenow={safeValue} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full transition-all duration-300 ease-out ${colors[color]}`} style={{ width: `${safeValue}%` }} />
    </div>
  );
};
