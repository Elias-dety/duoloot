import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'premium' | 'prize' | 'danger' | 'locked' | 'tactical' | 'tactical-blue' | 'tactical-yellow' | 'tactical-green' | 'tactical-red';
}

export const Card: React.FC<CardProps> = ({ variant = 'default', className = '', children, ...props }) => {
  const baseStyles = 'border backdrop-blur-[10px] p-6 [clip-path:var(--dl-cut-card)] relative transition-all duration-200';

  const variants: Record<string, string> = {
    default: 'border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-panel)]',
    elevated: 'border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-panel-2)]',
    interactive:
      'border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-panel)] hover:translate-y-[-4px] hover:border-[rgba(255,226,102,0.26)] hover:shadow-[0_0_38px_rgba(255,226,102,0.07)]',
    premium: 'border-[rgba(141,92,255,0.3)] bg-[rgba(141,92,255,0.08)]',
    prize: 'border-[rgba(255,226,102,0.3)] bg-[rgba(255,226,102,0.07)]',
    danger: 'border-[rgba(255,51,102,0.3)] bg-[rgba(255,51,102,0.07)]',
    locked: 'border-[rgba(255,51,102,0.2)] bg-[var(--dl-tactical-panel)] opacity-60',
    tactical: 'border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-panel)] hover:translate-y-[-4px] hover:border-[rgba(255,226,102,0.26)] hover:shadow-[0_0_38px_rgba(255,226,102,0.07)]',
    'tactical-blue': 'border-[rgba(70,183,255,0.28)] bg-[rgba(70,183,255,0.07)]',
    'tactical-yellow': 'border-[rgba(255,226,102,0.3)] bg-[rgba(255,226,102,0.07)]',
    'tactical-green': 'border-[rgba(56,242,139,0.28)] bg-[rgba(56,242,139,0.07)]',
    'tactical-red': 'border-[rgba(255,51,102,0.3)] bg-[rgba(255,51,102,0.07)]',
  };

  return (
    <div className={[baseStyles, variants[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
};
