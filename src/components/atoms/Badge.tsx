import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'premium' | 'danger' | 'warning' | 'gold' | 'info' | 'muted' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles =
    'inline-flex items-center [clip-path:var(--dl-cut-button)] border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors';

  const variants: Record<string, string> = {
    default: 'border-[var(--dl-tactical-line)] bg-[rgba(255,255,255,0.035)] text-[var(--dl-tactical-muted)]',
    success: 'border-[rgba(56,242,139,0.3)] bg-[rgba(56,242,139,0.07)] text-[var(--dl-tactical-green)]',
    premium: 'border-[rgba(141,92,255,0.3)] bg-[rgba(141,92,255,0.08)] text-[var(--dl-tactical-purple)]',
    danger: 'border-[rgba(255,51,102,0.3)] bg-[rgba(255,51,102,0.07)] text-[var(--dl-tactical-red)]',
    error: 'border-[rgba(255,51,102,0.3)] bg-[rgba(255,51,102,0.07)] text-[var(--dl-tactical-red)]',
    warning: 'border-[rgba(255,122,26,0.3)] bg-[rgba(255,122,26,0.07)] text-[var(--dl-tactical-orange)]',
    gold: 'border-[rgba(255,226,102,0.3)] bg-[rgba(255,226,102,0.07)] text-[var(--dl-tactical-yellow)]',
    info: 'border-[rgba(70,183,255,0.28)] bg-[rgba(70,183,255,0.07)] text-[var(--dl-tactical-blue)]',
    muted: 'border-[var(--dl-tactical-line)] bg-[rgba(255,255,255,0.025)] text-[var(--dl-tactical-muted)]',
  };

  const classes = [baseStyles, variants[variant], className].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
