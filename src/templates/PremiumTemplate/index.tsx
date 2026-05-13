import React from 'react';
import { Button } from '@/components/atoms';
import { PremiumHero } from '@/features/premium/components/PremiumHero';
import { PremiumComparison } from '@/features/premium/components/PremiumComparison';

export const PremiumTemplate: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PremiumHero />
      <PremiumComparison />
      
      {/* Botão Fixo Mobile / CTA Fim da página */}
      <div className="text-center bg-surface-dark border border-surface-highlight p-8 rounded-2xl flex flex-col items-center justify-center gap-4">
        <h3 className="text-2xl font-bold text-content-base">Pronto para subir de nível?</h3>
        <p className="text-content-muted mb-4 max-w-md">Junte-se a milhares de jogadores que já maximizaram seus ganhos e experiência no Duo Loot.</p>
        <Button variant="primary" size="lg" className="w-full sm:w-auto bg-gradient-to-r from-premium to-yellow-600 hover:from-yellow-600 hover:to-premium text-black font-bold border-none px-12">
          Assinar o Duo Loot Premium
        </Button>
        <p className="text-xs text-content-muted mt-2">Cancele quando quiser. Pagamento seguro.</p>
      </div>
    </div>
  );
};
