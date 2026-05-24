import React from 'react';
import { CalendarDays, Trophy, Users } from 'lucide-react';
import { VaultSeason } from '@/features/vault/vault.schema';

interface VaultSeasonCardProps {
  season: VaultSeason;
}

const seasonStatusTone: Record<VaultSeason['status'], string> = {
  draft: 'text-white/60',
  scheduled: 'text-[var(--dl-function)]',
  active: 'text-[var(--dl-success)]',
  ended: 'text-[var(--dl-keyword)]',
  cancelled: 'text-[var(--dl-error)]',
};

export const VaultSeasonCard: React.FC<VaultSeasonCardProps> = ({ season }) => {
  const progress = season.goalPoints > 0 ? Math.min(100, Math.round((season.currentPoints / season.goalPoints) * 100)) : 0;

  return (
    <article className="dl-panel p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-['Rajdhani'] text-lg font-bold uppercase text-white">{season.title}</h3>
          <p className={`mt-1 text-[11px] font-bold uppercase tracking-wider ${seasonStatusTone[season.status]}`}>
            {season.status}
          </p>
        </div>
        <span className="dl-stamp dl-stamp-yellow">{season.winnersCount} winners</span>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide">
          <span className="text-[var(--dl-muted)]">Progresso</span>
          <span className="text-[var(--dl-keyword)]">{season.currentPoints} / {season.goalPoints}</span>
        </div>
        <div className="dl-progress h-2">
          <div className="dl-progress-bar bg-[var(--dl-keyword)]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
        <div className="border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3">
          <div className="mb-1 flex items-center gap-1 text-[var(--dl-function)]">
            <Users className="h-3.5 w-3.5" />
            <span className="font-bold uppercase">Participantes</span>
          </div>
          <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-function)]">{season.participantCount}</p>
        </div>

        <div className="border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3">
          <div className="mb-1 flex items-center gap-1 text-[var(--dl-keyword)]">
            <Trophy className="h-3.5 w-3.5" />
            <span className="font-bold uppercase">Premio</span>
          </div>
          <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-keyword)]">{season.prizeValue}</p>
          <p className="text-[10px] uppercase text-white/60">{season.prizeLabel || 'Loot'}</p>
        </div>

        <div className="border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3">
          <p className="mb-1 font-bold uppercase text-[var(--dl-muted)]">Top winner</p>
          <p className="font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-string)]">
            {season.topWinnerNickname || 'Sem vencedor'}
          </p>
        </div>

        <div className="border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3">
          <div className="mb-1 flex items-center gap-1 text-[var(--dl-muted)]">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="font-bold uppercase">Periodo</span>
          </div>
          <p className="font-['Rajdhani'] text-sm font-bold text-white">
            {season.startsAt ? new Date(season.startsAt).toLocaleDateString('pt-BR') : '--'}
          </p>
          <p className="font-['Rajdhani'] text-sm font-bold text-white/60">
            {season.endsAt ? new Date(season.endsAt).toLocaleDateString('pt-BR') : '--'}
          </p>
        </div>
      </div>
    </article>
  );
};
