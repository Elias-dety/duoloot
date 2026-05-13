import React, { HTMLAttributes } from 'react';

export interface SkeletonBlockProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width = '100%',
  height = '100%',
  rounded = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-surface-hover/80';

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  };

  const classes = [baseStyles, roundedStyles[rounded], className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      {...props}
    />
  );
};
