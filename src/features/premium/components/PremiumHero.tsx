import React from 'react';
import { Crown } from 'lucide-react';

export const PremiumHero: React.FC = () => {
  return (
    <div className="dl-panel relative overflow-hidden p-[18px] mb-6 md:p-[28px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.14),transparent_20rem),linear-gradient(120deg,transparent,rgba(168,85,247,0.04),transparent)]" />
      <div className="relative z-[2] flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="dl-hud-label" style={{ color: 'var(--dl-string)', borderColor: 'rgba(var(--dl-string-rgb),0.34)', background: 'rgba(var(--dl-string-rgb),0.08)' }}>
              PREMIUM ACCESS // ELITE CONTRACT
            </span>
          </div>
          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Desbloqueie o modo{' '}
            <span className="text-[var(--dl-string)] drop-shadow-[0_0_24px_rgba(var(--dl-string-rgb),0.3)]">
              Elite
            </span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">
            Ganhe prioridade no lobby, bônus no Vault e acesso a benefícios premium para evoluir mais rápido.
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-center lg:px-8">
          <div className="flex h-24 w-24 items-center justify-center border border-[rgba(var(--dl-string-rgb),0.4)] bg-[rgba(var(--dl-string-rgb),0.1)] rounded-[2rem] shadow-[0_0_20px_rgba(var(--dl-string-rgb),0.2)]">
            <Crown className="h-10 w-10 text-[var(--dl-string)] drop-shadow-[0_0_8px_rgba(var(--dl-string-rgb),0.8)]" />
          </div>
        </div>
      </div>
    </div>
  );
};
