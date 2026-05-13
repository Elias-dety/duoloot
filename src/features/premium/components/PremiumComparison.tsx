import React from 'react';
import { Check, X } from 'lucide-react';
import { Badge, Card } from '@/components/atoms';
import { PremiumPlan } from '@/schemas/premiumPlan.schema';

export interface PremiumComparisonProps {
  freePlan: PremiumPlan;
  premiumPlan: PremiumPlan;
}

export const PremiumComparison: React.FC<PremiumComparisonProps> = ({ freePlan, premiumPlan }) => {
  const features = premiumPlan.features.map((premiumFeature) => {
    const freeFeature = freePlan.features.find((feature) => feature.name === premiumFeature.name);

    return {
      name: premiumFeature.name,
      free: freeFeature?.included ?? false,
      premium: premiumFeature.included,
      premiumDesc: premiumFeature.description,
    };
  });

  const renderValue = (value: boolean | string, isPremium = false) => {
    if (typeof value !== 'boolean') {
      return <span className={isPremium ? 'text-sm font-bold text-premium' : 'text-sm text-content-muted'}>{value}</span>;
    }

    return value ? (
      <Check className={isPremium ? 'h-5 w-5 text-premium' : 'h-5 w-5 text-success'} />
    ) : (
      <X className="h-5 w-5 text-content-muted" />
    );
  };

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-black text-content-base">Comparativo</h2>

      <div className="hidden overflow-hidden rounded-2xl border border-brand-primary/20 bg-surface-card md:block">
        <table className="w-full border-collapse text-left">
          <thead className="bg-surface-elevated">
            <tr>
              <th className="w-1/2 border-b border-border p-4 text-content-muted">Beneficio</th>
              <th className="w-1/4 border-b border-border p-4 text-center text-content-primary">{freePlan.name}</th>
              <th className="w-1/4 border-b border-premium/30 bg-premium/10 p-4 text-center text-premium">
                {premiumPlan.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.name}>
                <td className="border-b border-border p-4 text-content-base">
                  <div className="font-medium">{feature.name}</div>
                  {feature.premiumDesc && <div className="mt-1 text-xs text-premium">{feature.premiumDesc}</div>}
                </td>
                <td className="border-b border-border p-4">
                  <div className="flex justify-center">{renderValue(feature.free)}</div>
                </td>
                <td className="border-b border-premium/20 bg-premium/5 p-4">
                  <div className="flex justify-center">{renderValue(feature.premium, true)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {features.map((feature) => (
          <Card key={feature.name} variant="elevated" className="p-4">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-content-base">{feature.name}</p>
                {feature.premiumDesc && <p className="mt-1 text-xs text-premium">{feature.premiumDesc}</p>}
              </div>
              <Badge variant="premium">Premium</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border bg-surface-card p-3">
                <p className="mb-2 text-content-muted">{freePlan.name}</p>
                {renderValue(feature.free)}
              </div>
              <div className="rounded-lg border border-premium/25 bg-premium/10 p-3">
                <p className="mb-2 text-premium">{premiumPlan.name}</p>
                {renderValue(feature.premium, true)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
