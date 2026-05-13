import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-disabled';

    const variants = {
      primary:
        'bg-brand-primary text-background shadow-lg hover:bg-brand-secondary focus-visible:ring-brand-primary',
      secondary:
        'border border-brand-primary/30 bg-surface-card text-content-primary hover:border-brand-primary/60 hover:bg-surface-hover focus-visible:ring-brand-primary',
      outline:
        'border border-brand-primary/30 bg-transparent text-content-primary hover:border-brand-primary/60 hover:bg-brand-primary/10 focus-visible:ring-brand-primary',
      ghost:
        'bg-transparent text-content-secondary hover:bg-surface-hover hover:text-content-base focus-visible:ring-brand-primary',
      premium:
        'bg-premium text-content-base shadow-premium hover:bg-premium/85 focus-visible:ring-premium',
      success:
        'bg-success text-background hover:bg-success/85 focus-visible:ring-success',
      danger:
        'bg-danger text-content-base hover:bg-danger/85 focus-visible:ring-danger',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    const classes = [
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
