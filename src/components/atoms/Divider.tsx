import React, { HTMLAttributes } from 'react';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  const baseStyles = 'shrink-0 bg-surface-hover border-none';
  const orientationStyles = orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]';
  
  const classes = [baseStyles, orientationStyles, className].filter(Boolean).join(' ');

  return (
    <hr
      className={classes}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
};
