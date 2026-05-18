import React, { HTMLAttributes } from 'react';

export interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  accent?: 'orange' | 'green' | 'premium' | 'prize' | 'info';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  as: Component = 'h2',
  accent = 'orange',
  className = '',
  ...props
}) => {
  const titleSizes = {
    h1: 'font-[Rajdhani] text-3xl md:text-4xl font-bold uppercase text-content-base',
    h2: 'font-[Rajdhani] text-2xl md:text-3xl font-bold uppercase text-content-base',
    h3: 'font-[Rajdhani] text-xl md:text-2xl font-bold uppercase text-content-base',
    h4: 'font-[Rajdhani] text-lg md:text-xl font-bold uppercase text-content-base',
  };

  const accents = {
    orange: 'bg-brand-primary',
    green: 'bg-brand-secondary',
    premium: 'bg-premium',
    prize: 'bg-prize',
    info: 'bg-content-secondary',
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`} {...props}>
      <div className={`h-1 w-12 rounded-full ${accents[accent]}`} />
      <Component className={titleSizes[Component]}>{title}</Component>
      {subtitle && <p className="max-w-2xl text-sm md:text-base text-content-secondary">{subtitle}</p>}
    </div>
  );
};
