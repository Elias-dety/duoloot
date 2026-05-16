import React from 'react';
import { Badge, Card, StatValue } from '@/components/atoms';
import { Coins } from 'lucide-react';

interface PrizeBoxProps {
  amount: number;
  currency: string;
  status: 'active' | 'scheduled' | 'ended';
  multiplier?: number;
  className?: string;
}

export const PrizeBox: React.FC<PrizeBoxProps> = ({
  amount,
  currency,
  status,
  multiplier,
  className = '',
}) => {
  const isAccumulating = status === 'active';

  return (
    <Card variant="prize" className={`flex w-full flex-col gap-4 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-prize/30 bg-prize/10">
          <Coins className="h-7 w-7 text-prize" />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Badge variant={isAccumulating ? 'success' : 'gold'}>
            {isAccumulating ? 'Acumulando' : 'Prêmio total'}
          </Badge>
          {multiplier && <Badge variant="premium">{multiplier}x bonus</Badge>}
        </div>
      </div>

      <StatValue
        label="Premiacao atual"
        value={`${amount.toLocaleString()} ${currency}`}
        description={isAccumulating ? 'O prêmio sobe conforme a comunidade joga.' : undefined}
        tone="prize"
      />

      <p className="rounded-lg border border-brand-primary/20 bg-brand-primary/10 p-3 text-xs font-medium text-content-secondary">
        [Imagem pendente: ilustracao de cofre premium com brilho laranja e moedas]
      </p>
    </Card>
  );
};
