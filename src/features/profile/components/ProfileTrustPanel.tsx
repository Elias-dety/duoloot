import React from 'react';
import { Player } from '@/schemas/player.schema';
import { ProgressBar } from '@/components/atoms';
import { AlertTriangle, ThumbsUp } from 'lucide-react';

export interface ProfileTrustPanelProps {
  player: Player;
}

export const ProfileTrustPanel: React.FC<ProfileTrustPanelProps> = ({ player }) => {
  const isHighTrust = player.trustScore >= 80;
  const isMediumTrust = player.trustScore >= 50 && player.trustScore < 80;
  const color = isHighTrust ? 'success' : isMediumTrust ? 'warning' : 'error';
  const textColor = isHighTrust ? 'text-[var(--dl-tactical-green)]' : isMediumTrust ? 'text-[var(--dl-tactical-yellow)]' : 'text-[var(--dl-tactical-red)]';

  return (
    <article className="dl-panel flex h-full flex-col p-6">
      <div className="mb-6 flex items-start justify-between">
        <h3 className="dl-hud-label mb-2">
          <span className={textColor}>■</span> Trust Score
        </h3>
        <span className={`font-['Rajdhani'] text-3xl font-bold ${textColor}`}>{player.trustScore}/100</span>
      </div>

      <div className="mb-6">
        <ProgressBar value={player.trustScore} color={color} size="lg" className="mb-2" />
        <p className="text-[13px] text-[var(--dl-tactical-muted)]">
          {isHighTrust
            ? 'Jogador altamente confiável e bem avaliado.'
            : isMediumTrust
              ? 'Jogador estável, mas ainda com margem para melhorar a reputação.'
              : 'Atenção: o histórico recente pede mais consistência.'}
        </p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.05)] p-3 [clip-path:var(--dl-cut-button)]">
          <div className="flex h-8 w-8 items-center justify-center bg-[rgba(34,197,94,0.1)] [clip-path:var(--dl-cut-button)]">
            <ThumbsUp className="h-4 w-4 text-[var(--dl-tactical-green)]" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">Elogios</p>
            <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-tactical-green)]">{player.stats.commendations}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)] p-3 [clip-path:var(--dl-cut-button)]">
          <div className="flex h-8 w-8 items-center justify-center bg-[rgba(239,68,68,0.1)] [clip-path:var(--dl-cut-button)]">
            <AlertTriangle className="h-4 w-4 text-[var(--dl-tactical-red)]" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">Abandonos</p>
            <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-tactical-red)]">{player.stats.abandons}</p>
          </div>
        </div>
      </div>
    </article>
  );
};
