import React, { HTMLAttributes } from 'react';

export interface StatValueProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  description?: string;
  tone?: 'default' | 'success' | 'premium' | 'prize' | 'danger' | 'info';
}

export const StatValue: React.FC<StatValueProps> = ({
  label,
  value,
  description,
  tone = 'default',
  className = '',
  ...props
}) => {
  const tones = {
    default: 'text-content-primary',
    success: 'text-success',
    premium: 'text-premium',
    prize: 'text-prize',
    danger: 'text-danger',
    info: 'text-info',
  };

  return (
    <div className={`flex min-w-0 flex-col gap-1 ${className}`} {...props}>
      <span className="text-xs font-bold uppercase tracking-wide text-content-muted">{label}</span>
      <span className={`break-words text-2xl font-black ${tones[tone]}`}>{value}</span>
      {description && <span className="text-xs text-content-muted">{description}</span>}
    </div>
  );
};
