import React, { HTMLAttributes } from 'react';

export interface DuolootSectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const DuolootSectionTitle: React.FC<DuolootSectionTitleProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className = '',
  ...props
}) => (
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
    ) : null}
    <h2 className="font-['Rajdhani'] text-[clamp(1.9rem,4vw,3.2rem)] font-bold uppercase leading-[0.92] text-[var(--dl-text)]">
      {title}
    </h2>
    {subtitle ? <p className="max-w-2xl text-sm leading-7 text-[var(--dl-muted-light)]">{subtitle}</p> : null}
  </div>
);
