import React, { HTMLAttributes } from 'react';

export interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  as: Component = 'h2',
  className = '',
  ...props
}) => {
  const titleSizes = {
    h1: 'text-3xl md:text-4xl font-bold tracking-tight text-white',
    h2: 'text-2xl md:text-3xl font-semibold tracking-tight text-white',
    h3: 'text-xl md:text-2xl font-semibold tracking-tight text-white',
    h4: 'text-lg md:text-xl font-medium tracking-tight text-white',
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} {...props}>
      <Component className={titleSizes[Component]}>
        {title}
      </Component>
      {subtitle && (
        <p className="text-sm md:text-base text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
