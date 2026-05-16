import React from 'react';

import { PageState } from '@/components/molecules';
import { PremiumPlan } from '@/schemas/premiumPlan.schema';
import { PremiumComparison } from '@/features/premium/components/PremiumComparison';
import { PremiumHero } from '@/features/premium/components/PremiumHero';
import { PremiumPlanCard } from '@/features/premium/components/PremiumPlanCard';

export interface PremiumTemplateProps {
  plans: PremiumPlan[];
  isLoading?: boolean;
  isError?: boolean;
  isPremiumLocked?: boolean;
}

export const PremiumTemplate: React.FC<PremiumTemplateProps> = ({
  plans,
  isLoading,
  isError,
  isPremiumLocked,
}) => {
  const freePlan = plans.find((plan) => plan.tier === 'free');
  const premiumPlan = plans.find((plan) => plan.tier === 'premium');

  if (isLoading) {
    return <PageState type="loading" loadingBlocks={4} className="max-w-6xl" />;
  }

  if (isError) {
    return (
      <div className="dl-panel mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16" style={{ borderColor: 'rgba(255,51,102,0.3)' }}>
        <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-red)] font-['Rajdhani'] uppercase">Erro ao carregar planos</p>
        <p className="text-[var(--dl-tactical-muted)] text-sm mb-6">Não foi possível carregar os planos premium neste momento.</p>
      </div>
    );
  }

  if (isPremiumLocked) {
    return (
      <div className="dl-panel mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-yellow)] font-['Rajdhani'] uppercase">Assinatura temporariamente indisponível</p>
        <p className="text-[var(--dl-tactical-muted)] text-sm mb-6">O acesso premium está bloqueado para esta conta enquanto finalizamos a validação.</p>
        <button type="button" className="dl-btn">Entender benefícios</button>
      </div>
    );
  }

  if (!plans.length || !freePlan || !premiumPlan) {
    return (
      <div className="dl-panel mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-muted)] font-['Rajdhani'] uppercase">Nenhum plano disponível</p>
        <p className="text-[var(--dl-tactical-muted)] text-sm mb-6">Os planos ainda não foram configurados para exibição.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-3 pb-12 md:px-6">
      <PremiumHero />

      <section className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PremiumPlanCard plan={freePlan} />
        <PremiumPlanCard plan={premiumPlan} highlighted />
      </section>

      <PremiumComparison freePlan={freePlan} premiumPlan={premiumPlan} />

      <div className="dl-panel text-center p-8 mt-12" style={{ borderColor: 'rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.05)' }}>
        <h3 className="dl-title text-2xl font-black mb-3">Pronto para subir de nível?</h3>
        <p className="dl-muted mx-auto max-w-2xl text-sm mb-6">
          Assine para destravar ganho extra no cofre, prioridade no lobby e acesso completo aos coaches premium.
        </p>
        <button
          type="button"
          className="dl-btn dl-btn-purple mt-6 w-full sm:w-auto"
        >
          {premiumPlan.ctaLabel}
        </button>
      </div>
    </div>
  );
};
