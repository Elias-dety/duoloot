import React from 'react';
import { Badge, Button, Card } from '@/components/atoms';
import { Sparkles, Trophy } from 'lucide-react';

export interface CoachesHeroProps {
  totalCoaches: number;
  premiumCount: number;
}

export const CoachesHero: React.FC<CoachesHeroProps> = ({ totalCoaches, premiumCount }) => {
  return (
    <Card variant="default" className="overflow-hidden md:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Badge variant="premium" className="mb-4 gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Coaching curado
          </Badge>
          <h1 className="text-3xl font-black tracking-tight text-content-base md:text-4xl">
            Coaches para subir seu nivel com direcionamento real.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-content-secondary">
            Selecione por jogo, disponibilidade e acesso premium. Sem foto final inventada: o foco aqui e
            clareza de especialidade, agenda e valor.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-surface-elevated p-4">
            <p className="text-xs uppercase tracking-wide text-content-muted">Coaches ativos</p>
            <p className="mt-2 text-2xl font-black text-content-base">{totalCoaches}</p>
          </div>
          <div className="rounded-xl border border-premium/25 bg-premium/10 p-4">
            <p className="text-xs uppercase tracking-wide text-content-muted">Premium</p>
            <p className="mt-2 text-2xl font-black text-premium">{premiumCount}</p>
          </div>
        </div>
      </div>
      <Button variant="ghost" className="mt-6 gap-2 px-0 text-content-secondary hover:bg-transparent">
        <Trophy className="h-4 w-4" />
        Sessao focada em rank, macro e leitura de jogo
      </Button>
    </Card>
  );
};
