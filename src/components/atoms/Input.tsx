import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', error, ...props }, ref) => {
  const baseStyles =
    'flex h-11 w-full rounded-2xl border bg-[var(--dl-surface)] px-4 py-2 text-sm text-[var(--dl-text)] font-medium placeholder:text-[var(--dl-muted)] placeholder:normal-case placeholder:tracking-normal focus-visible:outline-none focus-visible:border-[var(--dl-red)] focus-visible:ring-2 focus-visible:ring-[rgba(255,70,85,0.18)] disabled:cursor-not-allowed disabled:opacity-50 transition-all';
  const borderStyles = error
    ? 'border-[var(--dl-red)]'
    : 'border-[var(--dl-border)]';
  const classes = [baseStyles, borderStyles, className].filter(Boolean).join(' ');

  return (
    <div className="flex w-full flex-col gap-1.5">
      <input ref={ref} className={classes} {...props} />
      {error && <span className="text-xs font-medium text-[var(--dl-red-soft)]">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
