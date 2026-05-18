import React from 'react';

import { ASSETS } from '@/constants/assets';

interface DuolootLogoProps {
  compact?: boolean;
  subtitle?: string;
}

export const DuolootLogo: React.FC<DuolootLogoProps> = ({ compact = false, subtitle = 'Red Vault' }) => (
  <>
    <span className={`grid place-items-center rounded-[1rem] border border-[var(--dl-border-red)] bg-[linear-gradient(135deg,var(--dl-red-dark),var(--dl-red))] text-white shadow-[0_18px_30px_rgba(255,0,0,0.24)] ${compact ? 'h-10 w-10 p-1.5' : 'h-12 w-12 p-2'}`}>
      <img
        src={ASSETS.logo.mark}
        alt="Duoloot"
        className="h-full w-full object-contain"
      />
    </span>
    <span className="dl-brand-copy">
      <strong>Duoloot</strong>
      <small>{subtitle}</small>
    </span>
  </>
);
