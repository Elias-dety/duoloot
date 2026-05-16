import React from 'react';
import { Crown } from 'lucide-react';

export const PremiumHero: React.FC = () => {
  return (
    <div className="dl-panel relative overflow-hidden p-[18px] mb-6 md:p-[28px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.14),transparent_20rem),linear-gradient(120deg,transparent,rgba(168,85,247,0.04),transparent)]" />
      <div className="relative z-[2] flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="dl-hud-label" style={{ color: 'var(--dl-tactical-purple)', borderColor: 'rgba(168,85,247,0.34)', background: 'rgba(168,85,247,0.08)' }}>
              PREMIUM ACCESS // ELITE CONTRACT
            </span>
          </div>
          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Desbloqueie filtros avançados e{' '}
            <span className="text-[var(--dl-tactical-purple)] drop-shadow-[0_0_24px_rgba(168,85,247,0.3)]">
              vantagens no cofre
            </span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">
            O contrato Elite garante prioridade no lobby, acesso a coaches exclusivos e bônus em todos os eventos do cofre.
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-center lg:px-8">
          <div className="flex h-24 w-24 items-center justify-center border border-[rgba(168,85,247,0.4)] bg-[rgba(168,85,247,0.1)] [clip-path:var(--dl-cut-card)] shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Crown className="h-10 w-10 text-[var(--dl-tactical-purple)] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          </div>
        </div>
      </div>
    </div>
  );
};
