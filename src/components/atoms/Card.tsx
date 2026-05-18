import React, { HTMLAttributes } from 'react';
import { DuolootCard } from '@/components/duoloot';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'premium' | 'prize' | 'danger' | 'locked' | 'tactical' | 'tactical-blue' | 'tactical-yellow' | 'tactical-green' | 'tactical-red';
}

export const Card: React.FC<CardProps> = ({ variant = 'default', className = '', children, ...props }) => {
  const variants: Record<NonNullable<CardProps['variant']>, React.ComponentProps<typeof DuolootCard>['variant']> = {
    default: 'default',
    elevated: 'elevated',
    interactive: 'interactive',
    premium: 'accent',
    prize: 'accent',
    danger: 'danger',
    locked: 'muted',
    tactical: 'interactive',
    'tactical-blue': 'muted',
    'tactical-yellow': 'accent',
    'tactical-green': 'accent',
    'tactical-red': 'danger',
  };

  return (
    <DuolootCard variant={variants[variant]} className={className} {...props}>
      {children}
    </DuolootCard>
  );
};
