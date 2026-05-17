import React from 'react';

interface OnboardingStepCardProps {
  title: string;
  description: string;
  stepNumber: number;
  totalSteps: number;
  children: React.ReactNode;
}

export const OnboardingStepCard: React.FC<OnboardingStepCardProps> = ({
  title,
  description,
  stepNumber,
  totalSteps,
  children,
}) => {
  return (
    <div className="dl-panel p-6 border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-panel)] relative overflow-hidden transition-all duration-300">
      {/* Indicador visual de progresso neon */}
      <div 
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[var(--dl-tactical-green)] to-[var(--dl-tactical-yellow)] transition-all duration-500"
        style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
      />

      {/* Canto decorativo HUD */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 border border-[var(--dl-tactical-green)]/20 bg-[var(--dl-tactical-green)]/5 rounded-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--dl-tactical-green)] animate-pulse" />
        <span className="text-[10px] font-bold text-[var(--dl-tactical-green)] uppercase tracking-wider font-[Chakra_Petch]">
          SECURE STAGE {stepNumber}/{totalSteps}
        </span>
      </div>

      <div className="mb-6 space-y-1 mt-2">
        <h3 className="text-lg font-bold text-[var(--dl-tactical-text)] uppercase font-[Chakra_Petch] tracking-widest flex items-center gap-2">
          <span className="text-[var(--dl-tactical-yellow)] font-bold font-mono">0{stepNumber}.</span>
          {title}
        </h3>
        <p className="text-xs text-[var(--dl-tactical-muted)] tracking-wider">
          {description}
        </p>
      </div>

      <div className="space-y-4 font-[Chakra_Petch]">
        {children}
      </div>
    </div>
  );
};
