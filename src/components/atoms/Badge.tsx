import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-950';
  
  const variants = {
    default: 'bg-zinc-800 text-zinc-100',
    success: 'bg-emerald-500/15 text-emerald-500',
    warning: 'bg-amber-500/15 text-amber-500',
    error: 'bg-red-500/15 text-red-500',
    info: 'bg-blue-500/15 text-blue-500',
    premium: 'bg-gradient-to-r from-amber-200 to-yellow-500 text-black shadow-sm',
  };

  const classes = [baseStyles, variants[variant], className].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
