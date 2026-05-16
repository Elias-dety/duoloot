import React from 'react';


export interface CoachesHeroProps {
  totalCoaches: number;
  premiumCount: number;
}

export const CoachesHero: React.FC<CoachesHeroProps> = ({ totalCoaches, premiumCount }) => {
  return (
    <div className="dl-panel relative overflow-hidden p-[18px] mb-6 md:p-[28px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.14),transparent_20rem),linear-gradient(120deg,transparent,rgba(168,85,247,0.04),transparent)]" />
      <div className="relative z-[2] flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="dl-hud-label" style={{ color: 'var(--dl-tactical-purple)', borderColor: 'rgba(168,85,247,0.34)', background: 'rgba(168,85,247,0.08)' }}>
              COACH NETWORK // ELITE TRAINING
            </span>
          </div>
          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Aprenda com a{' '}
            <span className="text-[var(--dl-tactical-purple)] drop-shadow-[0_0_24px_rgba(168,85,247,0.3)]">
              Elite
            </span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">
            Encontre treinadores e mentores de alto nível para melhorar seu jogo, ajustar sua mentalidade e subir de rank mais rápido.
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-[120px_120px]">
          <div className="flex flex-col items-center justify-center border border-[var(--dl-tactical-line)] bg-white/[0.02] py-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--dl-tactical-muted)]">Ativos</span>
            <span className="font-['Rajdhani'] text-[24px] font-bold text-white">{totalCoaches}</span>
          </div>
          <div className="flex flex-col items-center justify-center border border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.05)] py-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--dl-tactical-muted)]">Premium</span>
            <span className="font-['Rajdhani'] text-[24px] font-bold text-[var(--dl-tactical-purple)]">{premiumCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
