import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    const baseStyles = 'flex h-10 w-full rounded-md border bg-surface-base px-3 py-2 text-sm text-content-primary ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors';
    const borderStyles = error ? 'border-red-500 focus-visible:ring-red-500' : 'border-surface-highlight';
    
    const classes = [baseStyles, borderStyles, className].filter(Boolean).join(' ');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <input
          ref={ref}
          className={classes}
          {...props}
        />
        {error && <span className="text-xs text-danger font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
