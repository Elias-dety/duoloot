import React, { HTMLAttributes } from 'react';

export interface DuolootCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'accent' | 'danger' | 'muted';
}

export const DuolootCard: React.FC<DuolootCardProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-[1.5rem] border p-5 md:p-6';
  const variants: Record<NonNullable<DuolootCardProps['variant']>, string> = {
    default: 'border-[var(--dl-border)] bg-[var(--dl-bg)]',
    elevated: 'border-[var(--dl-border)] bg-[var(--dl-surface)] shadow-[var(--shadow-md)]',
    interactive: 'border-[var(--dl-border)] bg-[var(--dl-bg)] transition duration-200 hover:-translate-y-1 hover:border-[var(--dl-keyword)] hover:shadow-[var(--shadow-lg)]',
    accent: 'border-[var(--dl-keyword)] bg-[linear-gradient(180deg,rgb(var(--dl-red-rgb)/0.12),rgb(var(--dl-red-rgb)/0.03))]',
    danger: 'border-[var(--dl-error)] bg-[rgb(var(--dl-error-rgb)/0.18)]',
    muted: 'border-[var(--dl-border)] bg-white/[0.03]',
  };

  return (
    <div className={[baseStyles, variants[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
};
