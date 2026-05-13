import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', error, ...props }, ref) => {
  const baseStyles =
    'flex h-10 w-full rounded-lg border bg-surface-elevated px-3 py-2 text-sm text-content-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary disabled:cursor-not-allowed disabled:opacity-disabled transition-colors';
  const borderStyles = error ? 'border-danger focus-visible:ring-danger' : 'border-border';
  const classes = [baseStyles, borderStyles, className].filter(Boolean).join(' ');

  return (
    <div className="flex w-full flex-col gap-1.5">
      <input ref={ref} className={classes} {...props} />
      {error && <span className="text-xs font-medium text-danger">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
