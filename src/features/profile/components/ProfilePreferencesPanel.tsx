import React from 'react';
import { Player } from '@/schemas/player.schema';
import { Badge, Card } from '@/components/atoms';
import { CalendarClock, Headphones, Swords } from 'lucide-react';

export interface ProfilePreferencesPanelProps {
  player: Player;
}

export const ProfilePreferencesPanel: React.FC<ProfilePreferencesPanelProps> = ({ player }) => {
  return (
    <article className="dl-panel h-full p-6">
      <h3 className="dl-hud-label mb-6"><span className="text-[var(--dl-tactical-purple)]">■</span> Preferências</h3>

      <div className="space-y-4">
        <div className="border border-[var(--dl-tactical-line)] bg-white/[0.02] p-4 [clip-path:var(--dl-cut-button)]">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">Estilo de jogo</p>
          <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wide text-[13px]">
            <Swords className="h-4 w-4 text-[var(--dl-tactical-purple)]" />
            <span>{player.preferences.playStyle}</span>
          </div>
        </div>

        <div className="border border-[var(--dl-tactical-line)] bg-white/[0.02] p-4 [clip-path:var(--dl-cut-button)]">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">Foco da sessão</p>
          <p className="font-bold text-white uppercase tracking-wide text-[13px]">{player.preferences.sessionFocus}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="dl-chip dl-chip-purple gap-2">
            <Headphones className="h-3.5 w-3.5" />
            {player.preferences.micRequired ? 'Mic obrigatório' : 'Mic opcional'}
          </span>
          <span className="dl-chip gap-2">
            <CalendarClock className="h-3.5 w-3.5" />
            {player.preferences.availability}
          </span>
        </div>
      </div>
    </article>
  );
};
