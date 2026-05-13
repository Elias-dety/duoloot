import React from 'react';
import { Button, Card } from '@/components/atoms';
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
      <PageState
        type="error"
        title="Erro ao carregar planos"
        description="Nao foi possivel carregar os planos premium neste momento."
        className="max-w-6xl"
      />
    );
  }

  if (isPremiumLocked) {
    return (
      <PageState
        type="locked"
        title="Assinatura temporariamente indisponivel"
        description="O acesso premium esta bloqueado para esta conta enquanto finalizamos a validacao."
        actionText="Entender beneficios"
        className="max-w-6xl"
      />
    );
  }

  if (!plans.length || !freePlan || !premiumPlan) {
    return (
      <PageState
        type="empty"
        title="Nenhum plano disponivel"
        description="Os planos ainda nao foram configurados para exibicao."
        className="max-w-6xl"
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <PremiumHero />

      <section className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PremiumPlanCard plan={freePlan} />
        <PremiumPlanCard plan={premiumPlan} highlighted />
      </section>

      <PremiumComparison freePlan={freePlan} premiumPlan={premiumPlan} />

      <Card variant="premium" className="text-center">
        <h3 className="text-2xl font-black text-content-base">Pronto para subir de nivel?</h3>
        <p className="mx-auto mt-3 max-w-2xl text-content-muted">
          Assine para destravar ganho extra no cofre, prioridade no lobby e acesso completo aos coaches premium.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-6 w-full sm:w-auto"
        >
          {premiumPlan.ctaLabel}
        </Button>
      </Card>
    </div>
  );
};
