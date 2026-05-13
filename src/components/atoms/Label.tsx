import React, { LabelHTMLAttributes, forwardRef } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', required, children, ...props }, ref) => {
    const baseStyles = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200';
    const classes = [baseStyles, className].filter(Boolean).join(' ');

    return (
      <label ref={ref} className={classes} {...props}>
        {children}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
