import React from 'react';
import { Player } from '@/schemas/player.schema';
import { CalendarClock, Headphones, Swords } from 'lucide-react';

export interface ProfilePreferencesPanelProps {
  player: Player;
}

export const ProfilePreferencesPanel: React.FC<ProfilePreferencesPanelProps> = ({ player }) => {
  const preferences = player?.preferences || {};
  const playStyle = preferences.playStyle || 'NÃO CONFIGURADO';
  const sessionFocus = preferences.sessionFocus || 'Não informado';
  const micRequired = !!preferences.micRequired;
  const availability = preferences.availability || 'Não informado';

  return (
    <article className="dl-panel h-full p-6">
      <h3 className="dl-hud-label mb-6"><span className="text-[var(--dl-string)]">■</span> Preferências</h3>

      <div className="space-y-4">
        <div className="border border-[var(--dl-border)] bg-white/[0.02] p-4 rounded-[1rem]">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-muted)]">Estilo de jogo</p>
          <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wide text-[13px]">
            <Swords className="h-4 w-4 text-[var(--dl-string)]" />
            <span>{playStyle}</span>
          </div>
        </div>

        <div className="border border-[var(--dl-border)] bg-white/[0.02] p-4 rounded-[1rem]">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-muted)]">Foco da sessão</p>
          <p className="font-bold text-white uppercase tracking-wide text-[13px]">{sessionFocus}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="dl-chip border border-[var(--dl-string)] bg-[var(--dl-string)]/10 text-[var(--dl-string)] gap-2">
            <Headphones className="h-3.5 w-3.5" />
            {micRequired ? 'Mic obrigatório' : 'Mic opcional'}
          </span>
          <span className="dl-chip gap-2">
            <CalendarClock className="h-3.5 w-3.5" />
            {availability}
          </span>
        </div>
      </div>
    </article>
  );
};
