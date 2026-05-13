import React from 'react';
import { Coach } from '@/schemas/coach.schema';
import { Avatar, Badge, Button } from '@/components/atoms';
import { Star, Lock } from 'lucide-react';

export interface CoachCardProps {
  coach: Coach;
}

export const CoachCard: React.FC<CoachCardProps> = ({ coach }) => {
  return (
    <div className="bg-surface-dark border border-surface-highlight p-6 rounded-2xl flex flex-col gap-4 group hover:border-brand-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex gap-4 items-center">
          <Avatar src={coach.avatarUrl} fallback={coach.name} size="lg" />
          <div>
            <h3 className="font-bold text-lg text-content-base flex items-center gap-2">
              {coach.name}
              {coach.premiumOnly && <Badge variant="premium" className="px-1.5 py-0 text-[10px]">PRO</Badge>}
            </h3>
            <p className="text-sm text-content-muted">{coach.game}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end text-amber-400 font-bold">
            <Star className="w-4 h-4 fill-current" />
            {coach.rating.toFixed(1)}
          </div>
          <p className="text-xs text-content-muted">({coach.reviews} avaliações)</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {coach.specialty.map(spec => (
          <Badge key={spec} variant="default" className="text-xs bg-surface-highlight">{spec}</Badge>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-surface-highlight flex items-center justify-between">
        <div>
          <span className="text-lg font-black text-content-base">R$ {coach.pricePerHour}</span>
          <span className="text-xs text-content-muted">/hora</span>
        </div>
        <Button 
          variant={coach.isAvailable ? 'primary' : 'secondary'} 
          className="gap-2"
          disabled={!coach.isAvailable}
        >
          {coach.premiumOnly ? <Lock className="w-4 h-4" /> : null}
          {coach.isAvailable ? 'Agendar' : 'Ocupado'}
        </Button>
      </div>
    </div>
  );
};
