import React from 'react';
import { PremiumPlan } from '@/schemas/premiumPlan.schema';
import { Check } from 'lucide-react';

export interface PremiumPlanCardProps {
  plan: PremiumPlan;
  highlighted?: boolean;
  isActive?: boolean;
  isProcessing?: boolean;
  onSelect?: () => void;
}

const formatPrice = (plan: PremiumPlan) => {
  if (plan.price === 0) {
    return 'Grátis';
  }

  return `R$ ${plan.price.toFixed(2).replace('.', ',')}/mês`;
};

export const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({ plan, highlighted = false, isActive = false, isProcessing = false, onSelect }) => {
  return (
    <article className={`dl-panel flex h-full flex-col p-6 ${highlighted ? 'dl-card-purple' : ''} ${isActive ? 'ring-2 ring-[var(--dl-string)]' : ''}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--dl-muted)]">{plan.tagline}</p>
          <h3 className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase leading-none text-white">{plan.name}</h3>
          <p className="mt-3 text-[14px] leading-6 text-[var(--dl-muted)]">{plan.description}</p>
        </div>
        {plan.isPopular && <span className="dl-stamp dl-stamp-purple">Mais escolhido</span>}
      </div>

      <div className="mb-6">
        <p className={highlighted ? 'font-[\'Rajdhani\'] text-[44px] font-bold text-[var(--dl-string)]' : 'font-[\'Rajdhani\'] text-[44px] font-bold text-white'}>
          {formatPrice(plan)}
        </p>
      </div>

      <div className="mb-6 space-y-3">
        {plan.benefits.map((benefit) => (
          <div key={benefit} className="flex items-start gap-3">
            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-[1rem] bg-[var(--dl-string)]/[0.1] border border-[var(--dl-string)]/[0.3]">
              <Check className="h-3 w-3 text-[var(--dl-string)]" />
            </div>
            <p className="text-[14px] text-[var(--dl-muted)]">{benefit}</p>
          </div>
        ))}
      </div>

      <button 
        type="button" 
        onClick={onSelect}
        disabled={isActive || isProcessing}
        className={`dl-btn mt-auto w-full ${highlighted ? 'dl-btn-purple' : ''}`}
      >
        {isProcessing ? 'Processando...' : isActive ? 'Plano Ativo' : plan.ctaLabel}
      </button>
    </article>
  );
};
