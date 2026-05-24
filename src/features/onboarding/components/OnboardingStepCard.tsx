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
    <div className="dl-panel p-6 border-[var(--dl-border)] bg-[var(--dl-surface)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--dl-error-rgb),0.1)]">
      {/* Indicador visual de progresso */}
      <div 
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[var(--dl-error)] to-[var(--dl-keyword)] transition-all duration-500"
        style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
      />

      {/* Canto decorativo HUD */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 border border-[var(--dl-border)] bg-white/[0.02] rounded text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--dl-error)] animate-pulse" />
        <span>
          STEP {stepNumber}/{totalSteps}
        </span>
      </div>

      <div className="mb-8 space-y-1 mt-2">
        <h3 className="font-['Rajdhani'] text-2xl font-bold uppercase tracking-wide text-white flex items-center gap-2">
          <span className="text-[var(--dl-error)] text-xl">0{stepNumber}.</span>
          {title}
        </h3>
        <p className="text-sm text-[var(--dl-muted-light)]">
          {description}
        </p>
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};
