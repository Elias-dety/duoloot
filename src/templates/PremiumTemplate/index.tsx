import React from 'react';

import { PageState } from '@/components/molecules';
import { PremiumComparison } from '@/features/premium/components/PremiumComparison';
import { PremiumHero } from '@/features/premium/components/PremiumHero';
import { PremiumPlanCard } from '@/features/premium/components/PremiumPlanCard';
import { PremiumPlan } from '@/schemas/premiumPlan.schema';
import { Button, Card } from '@/components/atoms';

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
      <Card variant="danger" className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-white">Erro ao carregar planos</p>
        <p className="mb-6 text-sm text-[var(--dl-muted-light)]">Não foi possível carregar os planos premium neste momento.</p>
      </Card>
    );
  }

  if (isPremiumLocked) {
    return (
      <Card variant="muted" className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-white">Pagamento em breve</p>
        <p className="mb-6 text-sm text-[var(--dl-muted-light)]">O acesso premium está temporariamente indisponível enquanto finalizamos a ativação.</p>
        <Button variant="secondary">Entender benefícios</Button>
      </Card>
    );
  }

  if (!plans.length || !freePlan || !premiumPlan) {
    return (
      <Card variant="muted" className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-muted-light)]">Nenhum plano disponível</p>
        <p className="mb-6 text-sm text-[var(--dl-muted-light)]">Os planos ainda não foram configurados para exibição.</p>
      </Card>
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

      <Card variant="accent" className="mt-6 p-8 text-center">
        <h3 className="font-['Rajdhani'] text-2xl font-bold uppercase text-white">Pronto para ativar o modo Elite?</h3>
        <p className="mx-auto mb-6 mt-3 max-w-2xl text-sm text-[var(--dl-muted-light)]">
          Entre na lista para desbloquear prioridade no lobby, bônus no Vault e vantagens premium.
        </p>
        <Button className="mt-2 w-full sm:w-auto">Ativar Premium</Button>
      </Card>
    </div>
  );
};
