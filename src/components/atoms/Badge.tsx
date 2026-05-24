import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'premium' | 'danger' | 'warning' | 'gold' | 'info' | 'muted' | 'error' | 'accent';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]';
  
  const defaultStyles = 'border-[var(--dl-border)] bg-white/[0.04] text-[var(--dl-text)]';
  const accentStyles = 'border-[var(--dl-keyword)] bg-[rgb(var(--dl-red-rgb)/0.12)] text-[var(--dl-text)]';
  const mutedStyles = 'border-[var(--dl-border)] bg-white/[0.03] text-[var(--dl-muted-light)]';
  const dangerStyles = 'border-[rgb(var(--dl-error-rgb)/0.55)] bg-[rgb(var(--dl-error-rgb)/0.22)] text-white';

  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: defaultStyles,
    success: accentStyles,
    premium: accentStyles,
    danger: dangerStyles,
    error: dangerStyles,
    warning: mutedStyles,
    gold: accentStyles,
    info: mutedStyles,
    muted: mutedStyles,
    accent: accentStyles,
  };

  return (
    <span className={[baseStyles, variants[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  );
};
