import React from 'react';

import { PageState } from '@/components/molecules';
import { PremiumComparison } from '@/features/premium/components/PremiumComparison';
import { PremiumHero } from '@/features/premium/components/PremiumHero';
import { PremiumPlanCard } from '@/features/premium/components/PremiumPlanCard';
import { PremiumPlan } from '@/schemas/premiumPlan.schema';
import { DuolootButton, DuolootCard } from '@/components/duoloot';

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
      <DuolootCard variant="danger" className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-white">Erro ao carregar planos</p>
        <p className="mb-6 text-sm text-[var(--dl-muted-light)]">Não foi possível carregar os planos premium neste momento.</p>
      </DuolootCard>
    );
  }

  if (isPremiumLocked) {
    return (
      <DuolootCard variant="muted" className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-white">Pagamento em breve</p>
        <p className="mb-6 text-sm text-[var(--dl-muted-light)]">O acesso premium está temporariamente indisponível enquanto finalizamos a ativação.</p>
        <DuolootButton variant="secondary">Entender benefícios</DuolootButton>
      </DuolootCard>
    );
  }

  if (!plans.length || !freePlan || !premiumPlan) {
    return (
      <DuolootCard variant="muted" className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-muted-light)]">Nenhum plano disponível</p>
        <p className="mb-6 text-sm text-[var(--dl-muted-light)]">Os planos ainda não foram configurados para exibição.</p>
      </DuolootCard>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      <PremiumHero />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PremiumPlanCard plan={freePlan} />
        <PremiumPlanCard plan={premiumPlan} highlighted />
      </section>

      <PremiumComparison freePlan={freePlan} premiumPlan={premiumPlan} />

      <DuolootCard variant="accent" className="mt-6 p-8 text-center">
        <h3 className="font-['Rajdhani'] text-2xl font-bold uppercase text-white">Pronto para subir de nível?</h3>
        <p className="mx-auto mb-6 mt-3 max-w-2xl text-sm text-[var(--dl-muted-light)]">
          Entre na lista de espera para destravar ganho extra no Vault, prioridade no lobby e acesso premium aos coaches.
        </p>
        <DuolootButton className="mt-2 w-full sm:w-auto">Ativar Premium</DuolootButton>
      </DuolootCard>
    </div>
  );
};
