import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', error, ...props }, ref) => {
  const baseStyles =
    'flex h-10 w-full border bg-[var(--dl-tactical-metal)] px-3 py-2 text-sm text-[var(--dl-tactical-text)] font-[Chakra_Petch] font-medium tracking-wider uppercase [clip-path:var(--dl-cut-button)] placeholder:text-[var(--dl-tactical-muted)] placeholder:normal-case placeholder:tracking-normal placeholder:lowercase focus-visible:outline-none focus-visible:border-[var(--dl-tactical-green)] focus-visible:shadow-[0_0_12px_rgba(56,242,139,0.15)] disabled:cursor-not-allowed disabled:opacity-50 transition-all';
  const borderStyles = error
    ? 'border-[var(--dl-tactical-red)] focus-visible:border-[var(--dl-tactical-red)] focus-visible:shadow-[0_0_12px_rgba(255,51,102,0.15)]'
    : 'border-[var(--dl-tactical-line)]';
  const classes = [baseStyles, borderStyles, className].filter(Boolean).join(' ');

  return (
    <div className="flex w-full flex-col gap-1.5">
      <input ref={ref} className={classes} {...props} />
      {error && <span className="text-xs font-medium text-[var(--dl-tactical-red)]">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
