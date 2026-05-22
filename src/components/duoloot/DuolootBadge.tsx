import React, { HTMLAttributes } from 'react';

export interface DuolootBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'muted' | 'danger';
}

export const DuolootBadge: React.FC<DuolootBadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]';
  const variants: Record<NonNullable<DuolootBadgeProps['variant']>, string> = {
    default: 'border-[var(--dl-border)] bg-white/[0.04] text-[var(--dl-text)]',
    accent: 'border-[var(--dl-border-red)] bg-[rgba(255,70,85,0.12)] text-[var(--dl-text)]',
    muted: 'border-[var(--dl-border)] bg-white/[0.03] text-[var(--dl-muted-light)]',
    danger: 'border-[rgba(143,8,8,0.55)] bg-[rgba(143,8,8,0.22)] text-white',
  };

  return (
    <span className={[baseStyles, variants[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  );
};
