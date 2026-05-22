import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface DuolootButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'surface';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const DuolootButton = forwardRef<HTMLButtonElement, DuolootButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = [
      'inline-flex items-center justify-center gap-2 rounded-full border font-semibold uppercase tracking-[0.12em]',
      'transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[var(--dl-error)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dl-black)]',
      'disabled:pointer-events-none disabled:opacity-50',
    ].join(' ');

    const variants: Record<NonNullable<DuolootButtonProps['variant']>, string> = {
      primary: 'border-[var(--dl-keyword)] bg-[var(--dl-keyword)] text-[var(--dl-black)] shadow-[0_18px_35px_rgb(var(--dl-red-rgb)/0.24)] hover:bg-[var(--dl-error)] hover:border-[var(--dl-error)] hover:text-white',
      secondary: 'border-[var(--dl-border)] bg-white/[0.04] text-[var(--dl-text)] hover:border-[var(--dl-keyword)] hover:bg-white/[0.08]',
      ghost: 'border-transparent bg-transparent text-[var(--dl-muted-light)] hover:border-[var(--dl-border)] hover:bg-white/[0.05] hover:text-white',
      danger: 'border-[var(--dl-error)] bg-[rgb(var(--dl-error-rgb)/0.28)] text-[var(--dl-error)] hover:bg-[rgb(var(--dl-error-rgb)/0.4)] hover:text-white',
      surface: 'border-[var(--dl-border)] bg-[var(--dl-surface)] text-[var(--dl-text)] hover:border-[var(--dl-keyword)]',
    };

    const sizes: Record<NonNullable<DuolootButtonProps['size']>, string> = {
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

DuolootButton.displayName = 'DuolootButton';
