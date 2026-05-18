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
    interactive: 'border-[var(--dl-border)] bg-[var(--dl-bg)] transition duration-200 hover:-translate-y-1 hover:border-[var(--dl-border-red)] hover:shadow-[var(--shadow-lg)]',
    accent: 'border-[var(--dl-border-red)] bg-[linear-gradient(180deg,rgba(255,0,0,0.12),rgba(255,0,0,0.03))]',
    danger: 'border-[rgba(143,8,8,0.5)] bg-[rgba(143,8,8,0.18)]',
    muted: 'border-[var(--dl-border)] bg-white/[0.03]',
  };

  return (
    <div className={[baseStyles, variants[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
};
