import React from 'react';
import { Player } from '@/schemas/player.schema';
import { Badge, Card } from '@/components/atoms';
import { CalendarClock, Headphones, Swords } from 'lucide-react';

export interface ProfilePreferencesPanelProps {
  player: Player;
}

export const ProfilePreferencesPanel: React.FC<ProfilePreferencesPanelProps> = ({ player }) => {
  return (
    <Card variant="elevated" className="h-full">
      <h3 className="text-lg font-bold text-content-base mb-6">Preferencias</h3>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-surface-card p-4">
          <p className="text-xs uppercase tracking-wide text-content-muted mb-2">Estilo de jogo</p>
          <div className="flex items-center gap-2 text-content-base font-semibold">
            <Swords className="w-4 h-4 text-brand-primary" />
            <span>{player.preferences.playStyle}</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-card p-4">
          <p className="text-xs uppercase tracking-wide text-content-muted mb-2">Foco da sessao</p>
          <p className="text-content-base font-semibold">{player.preferences.sessionFocus}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge variant="info" className="gap-2 px-3 py-1.5">
            <Headphones className="w-3.5 h-3.5" />
            {player.preferences.micRequired ? 'Mic obrigatorio' : 'Mic opcional'}
          </Badge>
          <Badge variant="default" className="gap-2 px-3 py-1.5">
            <CalendarClock className="w-3.5 h-3.5" />
            {player.preferences.availability}
          </Badge>
        </div>
      </div>
    </Card>
  );
};
