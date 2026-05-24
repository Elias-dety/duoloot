import React, { HTMLAttributes } from 'react';

export interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  accent?: 'orange' | 'green' | 'premium' | 'prize' | 'info';
  eyebrow?: string;
  align?: 'left' | 'center';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  eyebrow,
  align = 'left',
  as: Component = 'h2',
  accent = 'orange',
  className = '',
  ...props
}) => {
  const titleSizes = {
    h1: "font-['Rajdhani'] text-[clamp(2.5rem,5vw,4rem)] font-bold uppercase leading-[0.92] text-[var(--dl-text)]",
    h2: "font-['Rajdhani'] text-[clamp(1.9rem,4vw,3.2rem)] font-bold uppercase leading-[0.92] text-[var(--dl-text)]",
    h3: "font-['Rajdhani'] text-2xl md:text-3xl font-bold uppercase leading-[0.92] text-[var(--dl-text)]",
    h4: "font-['Rajdhani'] text-xl md:text-2xl font-bold uppercase leading-[0.92] text-[var(--dl-text)]",
  };

  const accents = {
    orange: 'bg-[var(--dl-keyword)]',
    green: 'bg-green-500',
    premium: 'bg-yellow-500',
    prize: 'bg-purple-500',
    info: 'bg-[var(--dl-border)]',
  };

  return (
    <div
      className={[
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {eyebrow ? (
        <span className="rounded-full border border-[var(--dl-keyword)] bg-[rgb(var(--dl-red-rgb)/0.1)] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--dl-text)]">
          {eyebrow}
        </span>
      ) : (
        <div className={`h-1 w-12 rounded-full ${accents[accent]}`} />
      )}
      <Component className={titleSizes[Component]}>{title}</Component>
      {subtitle ? <p className="max-w-2xl text-sm leading-7 text-[var(--dl-muted-light)]">{subtitle}</p> : null}
    </div>
  );
};
