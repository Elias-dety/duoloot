import React from 'react';

import { PageState, EmptyState } from '@/components/molecules';
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
  activePlanId?: string | null;
  isProcessing?: boolean;
  onSelectPlan?: (planId: string) => void;
}

export const PremiumTemplate: React.FC<PremiumTemplateProps> = ({
  plans,
  isLoading,
  isError,
  isPremiumLocked,
  activePlanId,
  isProcessing,
  onSelectPlan,
}) => {
  const freePlan = plans.find((plan) => plan.tier === 'free');
  const premiumPlan = plans.find((plan) => plan.tier === 'premium');

  if (isLoading) {
    return <PageState type="loading" loadingBlocks={4} className="max-w-6xl" />;
  }

  if (isError) {
    return (
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <EmptyState 
          icon="error"
          title="Erro ao carregar planos"
          description="Não foi possível carregar os planos premium neste momento."
        />
      </div>
    );
  }

  if (isPremiumLocked) {
    return (
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <EmptyState 
          icon="empty"
          title="Pagamento em breve"
          description="O acesso premium está temporariamente indisponível enquanto finalizamos a ativação."
          actionLabel="Entender benefícios"
          onAction={() => {}}
        />
      </div>
    );
  }

  if (!plans.length || !freePlan || !premiumPlan) {
    return (
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <EmptyState 
          icon="empty"
          title="Nenhum plano disponível"
          description="Os planos ainda não foram configurados para exibição."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      <PremiumHero />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PremiumPlanCard 
            key={plan.id}
            plan={plan} 
            highlighted={plan.isPopular}
            isActive={activePlanId === plan.id}
            isProcessing={isProcessing}
            onSelect={() => onSelectPlan?.(plan.id)}
          />
        ))}
      </section>

      <PremiumComparison freePlan={freePlan} premiumPlan={premiumPlan} />

      <Card variant="accent" className="mt-6 p-8 text-center">
        <h3 className="font-['Rajdhani'] text-2xl font-bold uppercase text-white">Pronto para ativar o modo Elite?</h3>
        <p className="mx-auto mb-6 mt-3 max-w-2xl text-sm text-[var(--dl-muted-light)]">
          Entre na lista para desbloquear prioridade no lobby, bônus no Vault e vantagens premium.
        </p>
        {/* TODO: Integrar checkout de pagamentos (ex: Stripe) */}
        <Button 
          className="mt-2 w-full sm:w-auto" 
          onClick={() => onSelectPlan?.(premiumPlan.id)}
          disabled={activePlanId === premiumPlan.id || isProcessing}
        >
          {isProcessing ? 'Processando...' : activePlanId === premiumPlan.id ? 'Premium Ativo' : 'Ativar Premium'}
        </Button>
      </Card>
    </div>
  );
};
