import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'premium' | 'danger' | 'warning' | 'gold' | 'info' | 'muted' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-background';

  const variants = {
    default: 'border-brand-primary/20 bg-brand-primary/10 text-content-primary',
    success: 'border-success/25 bg-success/10 text-success',
    premium: 'border-premium/35 bg-premium/15 text-premium',
    danger: 'border-danger/30 bg-danger/10 text-danger',
    error: 'border-danger/30 bg-danger/10 text-danger',
    warning: 'border-prize/35 bg-prize/10 text-prize',
    gold: 'border-prize/35 bg-prize/10 text-prize',
    info: 'border-info/30 bg-info/10 text-info',
    muted: 'border-border bg-surface-hover/50 text-content-muted',
  };

  const classes = [baseStyles, variants[variant], className].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
