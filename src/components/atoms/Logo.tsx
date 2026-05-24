import React from 'react';

import { ASSETS } from '@/constants/assets';

interface LogoProps {
  compact?: boolean;
  subtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({ compact = false, subtitle = 'Red Vault' }) => (
  <span className="flex flex-col items-start justify-center">
    <img
      src={ASSETS.logo.full}
      alt="Duoloot Logo"
      className={`object-contain transition-all duration-300 ${compact ? 'h-7 md:h-8' : 'h-9 md:h-11'}`}
    />
    {subtitle && (
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--dl-muted-light)] mt-1.5 pl-0.5 select-none leading-none">
        {subtitle}
      </span>
    )}
  </span>
);

