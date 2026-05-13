import React from 'react';
import { Badge, StatValue } from '@/components/atoms';

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
    <div className={`flex flex-col p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl gap-3 ${className}`}>
      <div className="flex justify-between items-center">
        <Badge variant={isAccumulating ? 'success' : 'default'}>
          {isAccumulating ? 'Acumulando' : 'Prêmio Total'}
        </Badge>
        {multiplier && (
          <Badge variant="premium">
            {multiplier}x Bônus
          </Badge>
        )}
      </div>

      <StatValue
        label="Premiação Atual"
        value={`${amount.toLocaleString()} ${currency}`}
        description={isAccumulating ? 'O prêmio sobe conforme novos inscritos entram!' : undefined}
      />
    </div>
  );
};
