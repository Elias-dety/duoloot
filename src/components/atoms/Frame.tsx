import React, { HTMLAttributes } from 'react';

export const Frame: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    className={[
      'dl-page-shell dl-grid-bg',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    {children}
  </div>
);
