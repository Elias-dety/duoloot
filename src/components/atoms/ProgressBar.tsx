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
    primary: 'bg-gradient-to-r from-[var(--dl-error)] to-[var(--dl-keyword)] shadow-[0_0_16px_rgb(var(--dl-red-rgb)/0.3)]',
    success: 'bg-[var(--dl-string)] shadow-[0_0_12px_rgba(59,217,130,0.25)]',
    warning: 'bg-[var(--dl-muted-light)] shadow-[0_0_10px_rgba(255,255,255,0.16)]',
    error: 'bg-[var(--dl-error)] shadow-[0_0_12px_rgb(var(--dl-error-rgb)/0.3)]',
    premium: 'bg-[var(--dl-error)] shadow-[0_0_12px_rgba(255,42,42,0.28)]',
    info: 'bg-[var(--dl-muted)] shadow-[0_0_10px_rgba(183,186,193,0.16)]',
  };

  const sizes: Record<string, string> = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const containerClasses = [
    'w-full overflow-hidden rounded-full border border-[var(--dl-border)] bg-white/[0.06]',
    sizes[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} role="progressbar" aria-valuenow={safeValue} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full transition-all duration-300 ease-out ${colors[color]}`} style={{ width: `${safeValue}%` }} />
    </div>
  );
};
