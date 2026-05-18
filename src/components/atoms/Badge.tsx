import React, { HTMLAttributes } from 'react';
import { DuolootBadge } from '@/components/duoloot';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'premium' | 'danger' | 'warning' | 'gold' | 'info' | 'muted' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const variants: Record<NonNullable<BadgeProps['variant']>, React.ComponentProps<typeof DuolootBadge>['variant']> = {
    default: 'default',
    success: 'accent',
    premium: 'accent',
    danger: 'danger',
    error: 'danger',
    warning: 'muted',
    gold: 'accent',
    info: 'muted',
    muted: 'muted',
  };

  return (
    <DuolootBadge variant={variants[variant]} className={className} {...props}>
      {children}
    </DuolootBadge>
  );
};
