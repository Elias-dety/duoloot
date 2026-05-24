import React from 'react';
import { Player } from '@/schemas/player.schema';
import { ProgressBar } from '@/components/atoms';
import { AlertTriangle, ThumbsUp } from 'lucide-react';
import { ASSETS } from '@/constants/assets';

export interface ProfileTrustPanelProps {
  player: Player;
}

export const ProfileTrustPanel: React.FC<ProfileTrustPanelProps> = ({ player }) => {
  const isHighTrust = player.trustScore >= 80;
  const isMediumTrust = player.trustScore >= 50 && player.trustScore < 80;
  const color = isHighTrust ? 'success' : isMediumTrust ? 'warning' : 'error';
  const textColor = isHighTrust ? 'text-[var(--dl-success)]' : isMediumTrust ? 'text-[var(--dl-keyword)]' : 'text-[var(--dl-error)]';

  return (
    <article className="dl-panel flex h-full flex-col p-6">
      <div className="mb-6 flex items-start justify-between">
        <h3 className="dl-hud-label mb-2 gap-2">
          <img src={ASSETS.icons.trustScore} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
          <span className={textColor}>■</span> Trust Score
        </h3>
        <span className={`font-['Rajdhani'] text-3xl font-bold ${textColor}`}>{player.trustScore}/100</span>
      </div>

      <div className="mb-6">
        <ProgressBar value={player.trustScore} color={color} size="lg" className="mb-2" />
        <p className="text-[13px] text-[var(--dl-muted)]">
          {isHighTrust
            ? 'Jogador altamente confiável e bem avaliado.'
            : isMediumTrust
              ? 'Jogador estável, mas ainda com margem para melhorar a reputação.'
              : 'Atenção: o histórico recente pede mais consistência.'}
        </p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 border border-[rgba(var(--dl-success-rgb),0.3)] bg-[rgba(var(--dl-success-rgb),0.05)] p-3 rounded-[1rem]">
          <div className="flex h-8 w-8 items-center justify-center bg-[rgba(var(--dl-success-rgb),0.1)] rounded-[1rem]">
            <ThumbsUp className="h-4 w-4 text-[var(--dl-success)]" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--dl-muted)]">Elogios</p>
            <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-success)]">{player.stats.commendations}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-[rgba(var(--dl-error-rgb),0.3)] bg-[rgba(var(--dl-error-rgb),0.05)] p-3 rounded-[1rem]">
          <div className="flex h-8 w-8 items-center justify-center bg-[rgba(var(--dl-error-rgb),0.1)] rounded-[1rem]">
            <AlertTriangle className="h-4 w-4 text-[var(--dl-error)]" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--dl-muted)]">Abandonos</p>
            <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-error)]">{player.stats.abandons}</p>
          </div>
        </div>
      </div>
    </article>
  );
};
