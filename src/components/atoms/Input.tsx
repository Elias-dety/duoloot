import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', error, ...props }, ref) => {
  const baseStyles =
    'flex h-11 w-full rounded-[1rem] border bg-[var(--dl-surface)] px-4 py-2 text-sm text-[var(--dl-text)] font-medium placeholder:text-[var(--dl-muted)] placeholder:normal-case placeholder:tracking-normal focus-visible:outline-none focus-visible:border-[var(--dl-keyword)] focus-visible:ring-2 focus-visible:ring-[var(--dl-keyword)]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all';
  const borderStyles = error
    ? 'border-[var(--dl-error)]'
    : 'border-[var(--dl-border)]';
  const classes = [baseStyles, borderStyles, className].filter(Boolean).join(' ');

  return (
    <div className="flex w-full flex-col gap-1.5">
      <input ref={ref} className={classes} {...props} />
      {error && <span className="text-xs font-medium text-[var(--dl-error)]">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
