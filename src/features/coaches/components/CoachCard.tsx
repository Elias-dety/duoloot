import React from 'react';
import { Avatar } from '@/components/atoms';
import { Coach } from '@/schemas/coach.schema';
import { Clock3, Lock, Star } from 'lucide-react';

export interface CoachCardProps {
  coach: Coach;
}

export const CoachCard: React.FC<CoachCardProps> = ({ coach }) => {
  return (
    <article className={`dl-panel flex h-full flex-col gap-4 p-4 ${coach.premiumOnly ? 'dl-card-purple' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar src={coach.avatarUrl} fallback={coach.name} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-['Rajdhani'] text-xl font-bold uppercase text-white">{coach.name}</h3>
              {coach.premiumOnly && <span className="dl-stamp dl-stamp-purple">PRO</span>}
            </div>
            <p className="text-[12px] font-bold uppercase text-[var(--dl-tactical-muted)]">{coach.game}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1 font-bold text-[var(--dl-tactical-yellow)]">
            <Star className="h-4 w-4 fill-[var(--dl-tactical-yellow)] text-[var(--dl-tactical-yellow)]" />
            {coach.rating.toFixed(1)}
          </div>
          <p className="text-[11px] uppercase text-[var(--dl-tactical-muted)]">({coach.reviews})</p>
        </div>
      </div>

      <p className="text-[13px] leading-6 text-[var(--dl-tactical-muted)]">{coach.headline}</p>

      <div className="flex flex-wrap gap-2">
        {coach.specialty.map((item) => (
          <span key={item} className="dl-chip">
            {item}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 border border-[var(--dl-tactical-line)] bg-white/[0.02] p-4 text-sm [clip-path:var(--dl-cut-button)]">
        <div>
          <p className="text-[11px] font-bold uppercase text-[var(--dl-tactical-muted)]">Foco</p>
          <p className="mt-1 font-bold text-[13px] text-white">{coach.focusAreas[0]}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase text-[var(--dl-tactical-muted)]">Idiomas</p>
          <p className="mt-1 font-bold text-[13px] text-white">{coach.languages.join(', ')}</p>
        </div>
      </div>

      <div className="mt-auto border-t border-[var(--dl-tactical-line)] pt-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <span className="font-['Rajdhani'] text-2xl font-bold text-white">R$ {coach.pricePerHour}</span>
            <span className="text-[11px] font-bold uppercase text-[var(--dl-tactical-muted)]">/hora</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-[var(--dl-tactical-muted)]">
            <Clock3 className="h-3.5 w-3.5" />
            {coach.responseTime}
          </div>
        </div>

        <button 
          className={`dl-btn w-full gap-2 ${!coach.isAvailable ? 'opacity-50 cursor-not-allowed' : coach.premiumOnly ? 'dl-btn-purple' : ''}`} 
          disabled={!coach.isAvailable}
        >
          {coach.premiumOnly ? <Lock className="h-4 w-4" /> : null}
          {coach.isAvailable ? 'Agendar sessão' : 'Agenda fechada'}
        </button>
      </div>
    </article>
  );
};
