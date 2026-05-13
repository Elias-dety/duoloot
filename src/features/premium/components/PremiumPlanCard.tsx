import React from 'react';
import { PremiumPlan } from '@/schemas/premiumPlan.schema';
import { Badge, Button, Card } from '@/components/atoms';
import { Check } from 'lucide-react';

export interface PremiumPlanCardProps {
  plan: PremiumPlan;
  highlighted?: boolean;
}

const formatPrice = (plan: PremiumPlan) => {
  if (plan.price === 0) {
    return 'Gratis';
  }

  return `R$ ${plan.price.toFixed(2).replace('.', ',')}/mes`;
};

export const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({ plan, highlighted = false }) => {
  return (
    <Card variant={highlighted ? 'premium' : 'elevated'} className="flex h-full flex-col">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-content-muted">{plan.tagline}</p>
          <h3 className="mt-2 text-2xl font-black text-content-base">{plan.name}</h3>
          <p className="mt-3 text-sm leading-6 text-content-secondary">{plan.description}</p>
        </div>
        {plan.isPopular && <Badge variant="premium">Mais escolhido</Badge>}
      </div>

      <div className="mb-6">
        <p className={highlighted ? 'text-3xl font-black text-premium' : 'text-3xl font-black text-content-base'}>
          {formatPrice(plan)}
        </p>
      </div>

      <div className="mb-6 space-y-3">
        {plan.benefits.map((benefit) => (
          <div key={benefit} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-success/25 bg-success/10">
              <Check className="h-4 w-4 text-success" />
            </div>
            <p className="text-sm text-content-secondary">{benefit}</p>
          </div>
        ))}
      </div>

      <Button variant={highlighted ? 'primary' : 'secondary'} className="mt-auto w-full">
        {plan.ctaLabel}
      </Button>
    </Card>
  );
};
