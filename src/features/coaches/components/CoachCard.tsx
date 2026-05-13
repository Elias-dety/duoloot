import React from 'react';
import { Avatar, Badge, Button, Card } from '@/components/atoms';
import { Coach } from '@/schemas/coach.schema';
import { Clock3, Lock, Star } from 'lucide-react';

export interface CoachCardProps {
  coach: Coach;
}

export const CoachCard: React.FC<CoachCardProps> = ({ coach }) => {
  return (
    <Card variant={coach.premiumOnly ? 'premium' : 'interactive'} className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar src={coach.avatarUrl} fallback={coach.name} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-black text-content-base">{coach.name}</h3>
              {coach.premiumOnly && <Badge variant="premium">PRO</Badge>}
            </div>
            <p className="text-sm text-content-muted">{coach.game}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1 font-bold text-prize">
            <Star className="h-4 w-4 fill-current" />
            {coach.rating.toFixed(1)}
          </div>
          <p className="text-xs text-content-muted">({coach.reviews})</p>
        </div>
      </div>

      <p className="text-sm leading-6 text-content-secondary">{coach.headline}</p>

      <div className="flex flex-wrap gap-2">
        {coach.specialty.map((item) => (
          <Badge key={item} variant="muted">
            {item}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface-elevated p-4 text-sm">
        <div>
          <p className="text-content-muted">Foco</p>
          <p className="mt-1 font-medium text-content-base">{coach.focusAreas[0]}</p>
        </div>
        <div>
          <p className="text-content-muted">Idiomas</p>
          <p className="mt-1 font-medium text-content-base">{coach.languages.join(', ')}</p>
        </div>
      </div>

      <div className="mt-auto border-t border-border pt-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-lg font-black text-content-base">R$ {coach.pricePerHour}</span>
            <span className="text-xs text-content-muted">/hora</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-content-muted">
            <Clock3 className="h-3.5 w-3.5" />
            {coach.responseTime}
          </div>
        </div>

        <Button variant={coach.isAvailable ? 'primary' : 'secondary'} className="w-full gap-2" disabled={!coach.isAvailable}>
          {coach.premiumOnly ? <Lock className="h-4 w-4" /> : null}
          {coach.isAvailable ? 'Agendar sessao' : 'Agenda fechada'}
        </Button>
      </div>
    </Card>
  );
};
