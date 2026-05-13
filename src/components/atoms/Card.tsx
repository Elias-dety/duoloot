import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'premium' | 'prize' | 'danger' | 'locked';
}

export const Card: React.FC<CardProps> = ({ variant = 'default', className = '', children, ...props }) => {
  const baseStyles = 'rounded-2xl border p-6';
  const variants = {
    default: 'border-brand-primary/20 bg-surface-card shadow-lg',
    elevated: 'border-border bg-surface-elevated shadow-md',
    interactive:
      'border-brand-primary/20 bg-surface-card shadow-lg transition-colors hover:border-brand-primary/45 hover:bg-surface-hover',
    premium: 'border-premium/35 bg-premium/10 shadow-premium',
    prize: 'border-prize/35 bg-prize/10 shadow-prize',
    danger: 'border-danger/35 bg-danger/10',
    locked: 'border-danger/25 bg-surface-card opacity-80',
  };

  return (
    <div className={[baseStyles, variants[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
};
