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
      return <span className={isPremium ? 'text-[12px] font-bold uppercase text-[var(--dl-tactical-purple)]' : 'text-[12px] font-bold uppercase text-[var(--dl-tactical-muted)]'}>{value}</span>;
    }

    return value ? (
      <Check className={isPremium ? 'h-5 w-5 text-[var(--dl-tactical-purple)]' : 'h-5 w-5 text-[var(--dl-tactical-green)]'} />
    ) : (
      <X className="h-5 w-5 text-white/20" />
    );
  };

  return (
    <section className="mb-12">
      <h2 className="mb-6 font-['Rajdhani'] text-3xl font-bold uppercase text-white">Comparativo</h2>

      <div className="dl-panel hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead className="bg-white/[0.02] border-b border-[var(--dl-tactical-line)]">
            <tr>
              <th className="w-1/2 p-4 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">Benefício</th>
              <th className="w-1/4 p-4 text-center text-[12px] font-bold uppercase text-white">{freePlan.name}</th>
              <th className="w-1/4 bg-[rgba(168,85,247,0.08)] p-4 text-center text-[12px] font-bold uppercase text-[var(--dl-tactical-purple)] border-l border-[rgba(168,85,247,0.2)]">
                {premiumPlan.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.name} className="border-b border-[var(--dl-tactical-line)] last:border-0">
                <td className="p-4 text-white">
                  <div className="font-bold text-[13px] uppercase tracking-wide">{feature.name}</div>
                  {feature.premiumDesc && <div className="mt-1 text-[11px] uppercase tracking-wide text-[var(--dl-tactical-purple)]">{feature.premiumDesc}</div>}
                </td>
                <td className="p-4">
                  <div className="flex justify-center">{renderValue(feature.free)}</div>
                </td>
                <td className="bg-[rgba(168,85,247,0.05)] p-4 border-l border-[rgba(168,85,247,0.1)]">
                  <div className="flex justify-center">{renderValue(feature.premium, true)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {features.map((feature) => (
          <article key={feature.name} className="dl-panel p-4">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-[13px] uppercase tracking-wide text-white">{feature.name}</p>
                {feature.premiumDesc && <p className="mt-1 text-[11px] uppercase tracking-wide text-[var(--dl-tactical-purple)]">{feature.premiumDesc}</p>}
              </div>
              <span className="dl-stamp dl-stamp-purple">Premium</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="border border-[var(--dl-tactical-line)] bg-white/[0.02] p-3 [clip-path:var(--dl-cut-button)]">
                <p className="mb-2 text-[11px] font-bold uppercase text-[var(--dl-tactical-muted)]">{freePlan.name}</p>
                {renderValue(feature.free)}
              </div>
              <div className="border border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.08)] p-3 [clip-path:var(--dl-cut-button)]">
                <p className="mb-2 text-[11px] font-bold uppercase text-[var(--dl-tactical-purple)]">{premiumPlan.name}</p>
                {renderValue(feature.premium, true)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
