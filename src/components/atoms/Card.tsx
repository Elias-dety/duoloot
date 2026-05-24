import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'premium' | 'prize' | 'danger' | 'locked' | 'tactical' | 'tactical-blue' | 'tactical-yellow' | 'tactical-green' | 'tactical-red' | 'muted' | 'accent';
}

export const Card: React.FC<CardProps> = ({ variant = 'default', className = '', children, ...props }) => {
  const baseStyles = 'rounded-[1.5rem] border p-5 md:p-6';
  
  const defaultStyles = 'border-[var(--dl-border)] bg-[var(--dl-bg)]';
  const elevatedStyles = 'border-[var(--dl-border)] bg-[var(--dl-surface)] shadow-[var(--shadow-md)]';
  const interactiveStyles = 'border-[var(--dl-border)] bg-[var(--dl-bg)] transition duration-200 hover:-translate-y-1 hover:border-[var(--dl-keyword)] hover:shadow-[var(--shadow-lg)]';
  const accentStyles = 'border-[var(--dl-keyword)] bg-[linear-gradient(180deg,rgb(var(--dl-red-rgb)/0.12),rgb(var(--dl-red-rgb)/0.03))]';
  const dangerStyles = 'border-[var(--dl-error)] bg-[rgb(var(--dl-error-rgb)/0.18)]';
  const mutedStyles = 'border-[var(--dl-border)] bg-white/[0.03]';

  const variants: Record<NonNullable<CardProps['variant']>, string> = {
    default: defaultStyles,
    elevated: elevatedStyles,
    interactive: interactiveStyles,
    premium: accentStyles,
    prize: accentStyles,
    danger: dangerStyles,
    locked: mutedStyles,
    tactical: interactiveStyles,
    'tactical-blue': mutedStyles,
    'tactical-yellow': accentStyles,
    'tactical-green': accentStyles,
    'tactical-red': dangerStyles,
    muted: mutedStyles,
    accent: accentStyles,
  };

  return (
    <div className={[baseStyles, variants[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
};
