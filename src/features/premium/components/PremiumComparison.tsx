import React from 'react';
import { Check, X } from 'lucide-react';

export const PremiumComparison: React.FC = () => {
  const features = [
    { name: 'Acesso aos Cofres', free: true, premium: true },
    { name: 'Multiplicador de Ganhos', free: false, premium: true, premiumDesc: 'Até 2x mais recompensas' },
    { name: 'Destaque no Lobby', free: false, premium: true, premiumDesc: 'Borda e Badge Premium' },
    { name: 'Prioridade na Fila', free: false, premium: true },
    { name: 'Acesso a Coaches', free: 'Limitado', premium: 'Acesso Total' },
    { name: 'Suporte VIP', free: false, premium: true },
  ];

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-center text-content-base mb-8">Compare os Planos</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-surface-highlight text-content-muted font-medium w-1/2">Benefício</th>
              <th className="p-4 border-b border-surface-highlight text-center text-content-primary font-bold w-1/4">Free</th>
              <th className="p-4 border-b border-surface-highlight text-center text-premium font-black w-1/4 bg-premium/5 rounded-t-xl border-premium/30">Premium</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, i) => (
              <tr key={i} className="hover:bg-surface-highlight/30 transition-colors">
                <td className="p-4 border-b border-surface-highlight text-content-base font-medium">
                  {feature.name}
                  {feature.premiumDesc && <span className="block text-xs text-premium mt-1">{feature.premiumDesc}</span>}
                </td>
                
                <td className="p-4 border-b border-surface-highlight text-center">
                  {typeof feature.free === 'boolean' ? (
                    feature.free ? (
                      <Check className="w-5 h-5 text-content-muted mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-surface-highlight mx-auto" />
                    )
                  ) : (
                    <span className="text-sm text-content-muted">{feature.free}</span>
                  )}
                </td>
                
                <td className="p-4 border-b border-surface-highlight text-center bg-premium/5 border-x border-premium/30">
                  {typeof feature.premium === 'boolean' ? (
                    feature.premium ? (
                      <Check className="w-5 h-5 text-premium mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-surface-highlight mx-auto" />
                    )
                  ) : (
                    <span className="text-sm font-bold text-premium">{feature.premium}</span>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td className="p-4 text-content-muted text-sm border-t border-surface-highlight">Preços podem variar conforme a região.</td>
              <td className="p-4 text-center border-t border-surface-highlight font-bold text-content-muted">Grátis</td>
              <td className="p-4 text-center border-t border-surface-highlight bg-premium/5 border-x border-b border-premium/30 rounded-b-xl">
                <span className="text-2xl font-black text-premium">R$ 29<span className="text-sm font-medium text-content-muted">/mês</span></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
