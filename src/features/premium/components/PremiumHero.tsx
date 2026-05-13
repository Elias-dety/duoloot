import React from 'react';
import { Button, Badge } from '@/components/atoms';
import { Crown, Sparkles } from 'lucide-react';

export const PremiumHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-surface-dark border border-premium/30 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8 mb-12">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-premium/10 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="flex-1 space-y-6 z-10">
        <Badge variant="premium" className="mb-2">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Duo Loot Premium
        </Badge>
        <h1 className="text-4xl md:text-5xl font-black text-content-base tracking-tight">
          Destrave o seu <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium to-yellow-300">Potencial Máximo</span>
        </h1>
        <p className="text-lg text-content-muted max-w-xl mx-auto md:mx-0">
          Obtenha mais ganhos nos cofres, destaque absoluto no Lobby, e acesso a coaches exclusivos. Jogue como um Pro, ganhe como um Pro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
          <Button variant="primary" size="lg" className="bg-gradient-to-r from-premium to-yellow-600 hover:from-yellow-600 hover:to-premium text-black font-bold border-none">
            Assinar Agora
          </Button>
          <Button variant="outline" size="lg">
            Ver Benefícios
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-sm relative z-10 flex justify-center">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-surface-highlight to-surface-base border-4 border-premium/40 flex items-center justify-center shadow-2xl shadow-premium/20">
          <Crown className="w-24 h-24 md:w-32 md:h-32 text-premium drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
        </div>
      </div>
    </section>
  );
};
