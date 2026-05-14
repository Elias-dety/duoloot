import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium' | 'success' | 'danger' | 'tactical' | 'tactical-green' | 'tactical-yellow';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dl-tactical-bg)] disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider font-[Chakra_Petch]';

    const variants: Record<string, string> = {
      primary:
        'bg-[var(--dl-tactical-yellow)] text-[#120900] border border-[var(--dl-tactical-yellow)] shadow-[0_0_24px_rgba(255,226,102,0.3)] [clip-path:var(--dl-cut-button)] hover:translate-y-[-2px]',
      secondary:
        'border border-[var(--dl-tactical-line)] bg-[rgba(255,255,255,0.04)] text-[var(--dl-tactical-text)] [clip-path:var(--dl-cut-button)] hover:translate-y-[-2px] hover:border-[rgba(255,226,102,0.26)]',
      outline:
        'border border-[var(--dl-tactical-line)] bg-transparent text-[var(--dl-tactical-muted)] [clip-path:var(--dl-cut-button)] hover:text-[var(--dl-tactical-green)] hover:border-[rgba(56,242,139,0.28)] hover:bg-[rgba(56,242,139,0.08)]',
      ghost:
        'bg-transparent text-[var(--dl-tactical-muted)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--dl-tactical-text)] [clip-path:var(--dl-cut-button)]',
      premium:
        'bg-[var(--dl-tactical-purple)] text-white border border-[var(--dl-tactical-purple)] shadow-[0_0_22px_rgba(141,92,255,0.3)] [clip-path:var(--dl-cut-button)] hover:translate-y-[-2px]',
      success:
        'bg-[var(--dl-tactical-green)] text-[#031008] border border-[var(--dl-tactical-green)] shadow-[0_0_22px_rgba(56,242,139,0.26)] [clip-path:var(--dl-cut-button)] hover:translate-y-[-2px]',
      danger:
        'bg-[var(--dl-tactical-red)] text-white border border-[var(--dl-tactical-red)] shadow-[0_0_22px_rgba(255,51,102,0.26)] [clip-path:var(--dl-cut-button)] hover:translate-y-[-2px]',
      tactical:
        'border border-[var(--dl-tactical-line)] bg-[rgba(255,255,255,0.04)] text-[var(--dl-tactical-text)] [clip-path:var(--dl-cut-button)] hover:translate-y-[-2px]',
      'tactical-green':
        'bg-[var(--dl-tactical-green)] text-[#031008] border border-[var(--dl-tactical-green)] shadow-[0_0_22px_rgba(56,242,139,0.26)] [clip-path:var(--dl-cut-button)] hover:translate-y-[-2px]',
      'tactical-yellow':
        'bg-[var(--dl-tactical-yellow)] text-[#120900] border border-[var(--dl-tactical-yellow)] shadow-[0_0_24px_rgba(255,226,102,0.3)] [clip-path:var(--dl-cut-button)] hover:translate-y-[-2px]',
    };

    const sizes: Record<string, string> = {
      sm: 'h-8 px-3 text-[11px]',
      md: 'h-10 px-4 py-2 text-[12px]',
      lg: 'h-12 px-6 text-[13px]',
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
