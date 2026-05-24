import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium' | 'success' | 'danger' | 'tactical' | 'tactical-green' | 'tactical-yellow';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = [
      'inline-flex items-center justify-center gap-2 rounded-full border font-semibold uppercase tracking-[0.12em]',
      'transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[var(--dl-error)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dl-black)]',
      'disabled:pointer-events-none disabled:opacity-50',
    ].join(' ');

    const primaryStyles = 'border-[var(--dl-keyword)] bg-[var(--dl-keyword)] text-[var(--dl-black)] shadow-[0_18px_35px_rgb(var(--dl-red-rgb)/0.24)] hover:bg-[var(--dl-error)] hover:border-[var(--dl-error)] hover:text-white';
    const secondaryStyles = 'border-[var(--dl-border)] bg-white/[0.04] text-[var(--dl-text)] hover:border-[var(--dl-keyword)] hover:bg-white/[0.08]';

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary: primaryStyles,
      secondary: secondaryStyles,
      outline: secondaryStyles,
      ghost: 'border-transparent bg-transparent text-[var(--dl-muted-light)] hover:border-[var(--dl-border)] hover:bg-white/[0.05] hover:text-white',
      premium: 'border-[var(--dl-border)] bg-[var(--dl-surface)] text-[var(--dl-text)] hover:border-[var(--dl-keyword)]',
      success: primaryStyles,
      danger: 'border-[var(--dl-error)] bg-[rgb(var(--dl-error-rgb)/0.28)] text-[var(--dl-error)] hover:bg-[rgb(var(--dl-error-rgb)/0.4)] hover:text-white',
      tactical: secondaryStyles,
      'tactical-green': primaryStyles,
      'tactical-yellow': primaryStyles,
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'min-h-9 px-3.5 text-[0.68rem]',
      md: 'min-h-11 px-5 text-[0.74rem]',
      lg: 'min-h-12 px-6 text-[0.8rem]',
    };

    const classes = [baseStyles, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
