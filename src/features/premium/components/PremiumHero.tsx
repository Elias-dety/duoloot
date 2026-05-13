import React from 'react';
import { Badge, Button, Card } from '@/components/atoms';
import { Crown, Sparkles } from 'lucide-react';

export const PremiumHero: React.FC = () => {
  return (
    <Card variant="premium" className="mb-10 overflow-hidden">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-5">
          <Badge variant="premium" className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Duo Loot Premium
          </Badge>
          <h1 className="text-4xl font-black text-content-base md:text-5xl">
            Destrave seu potencial premium
          </h1>
          <p className="max-w-xl text-lg text-content-secondary">
            Beneficios pagos usam roxo, mas a acao principal continua laranja para manter clareza de decisao.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button variant="primary" size="lg" fullWidth className="sm:w-auto">Assinar agora</Button>
            <Button variant="premium" size="lg" fullWidth className="sm:w-auto">Ver beneficios</Button>
          </div>
        </div>

        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border border-premium/30 bg-surface-card md:h-40 md:w-40">
          <Crown className="h-16 w-16 text-premium md:h-20 md:w-20" />
        </div>
      </div>
    </Card>
  );
};
