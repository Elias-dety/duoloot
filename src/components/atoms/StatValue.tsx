import React, { HTMLAttributes } from 'react';

export interface StatValueProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  description?: string;
}

export const StatValue: React.FC<StatValueProps> = ({
  label,
  value,
  description,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`} {...props}>
      <span className="text-sm font-medium text-zinc-400">{label}</span>
      <span className="text-2xl font-bold tracking-tight text-zinc-100">{value}</span>
      {description && (
        <span className="text-xs text-zinc-500">{description}</span>
      )}
    </div>
  );
};
