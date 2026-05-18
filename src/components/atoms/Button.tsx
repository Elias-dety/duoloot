import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { DuolootButton } from '@/components/duoloot';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium' | 'success' | 'danger' | 'tactical' | 'tactical-green' | 'tactical-yellow';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const variantMap: Record<NonNullable<ButtonProps['variant']>, React.ComponentProps<typeof DuolootButton>['variant']> = {
      primary: 'primary',
      secondary: 'secondary',
      outline: 'secondary',
      ghost: 'ghost',
      premium: 'surface',
      success: 'primary',
      danger: 'danger',
      tactical: 'secondary',
      'tactical-green': 'primary',
      'tactical-yellow': 'primary',
    };

    const sizeMap: Record<NonNullable<ButtonProps['size']>, React.ComponentProps<typeof DuolootButton>['size']> = {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    };

    return (
      <DuolootButton
        ref={ref}
        variant={variantMap[variant]}
        size={sizeMap[size]}
        fullWidth={fullWidth}
        className={className}
        {...props}
      >
        {children}
      </DuolootButton>
    );
  }
);

Button.displayName = 'Button';
