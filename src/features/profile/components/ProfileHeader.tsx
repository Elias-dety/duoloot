import React from 'react';
import { Player } from '@/schemas/player.schema';
import { Avatar } from '@/components/atoms';
import { MessageCircle } from 'lucide-react';
import { ASSETS } from '@/constants/assets';

export interface ProfileHeaderProps {
  player: Player;
}

const statusMap = {
  online: { label: 'Online', tone: 'bg-success' },
  'in-game': { label: 'Em partida', tone: 'bg-warning' },
  offline: { label: 'Offline', tone: 'bg-content-muted' },
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ player }) => {
  const status = statusMap[player.status];
  const playerRank = player.gameProfile?.currentRank || player.gameProfile?.rank || 'Sem Rank';

  return (
    <article className={`dl-panel p-6 ${player.isPremium ? 'dl-card-purple' : ''}`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar src={player.avatarUrl} alt={player.nickname} fallback={player.nickname} size="xl" />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-['Rajdhani'] text-4xl font-bold uppercase leading-none text-white">{player.nickname}</h1>
              {player.isPremium && <span className="dl-stamp dl-stamp-purple">Premium</span>}
            </div>
            <p className="mt-1 text-[13px] uppercase tracking-wide text-[var(--dl-muted)]">{player.name}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-muted)]">
              <span className="flex items-center gap-2 text-white/70">
                <span className={`h-2.5 w-2.5 rounded-[1rem] ${status.tone}`} />
                {status.label}
              </span>
              <span className="hidden h-1 w-1 bg-[var(--dl-border)] sm:block" />
              <span className="flex items-center gap-2 text-[var(--dl-keyword)]">
                <img src={ASSETS.icons.ranking} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
                {playerRank}
              </span>
              <span className="hidden h-1 w-1 bg-[var(--dl-border)] sm:block" />
              <span>Membro desde {new Date(player.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:w-auto">
          <button type="button" className="dl-btn gap-2 border border-[var(--dl-border)] opacity-70 hover:opacity-100" disabled>
            <MessageCircle className="h-4 w-4" />
            Ver compatibilidade
          </button>
          <button type="button" className="dl-btn dl-btn-red gap-2" disabled>
            <img src={ASSETS.icons.squad} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
            Convidar para lobby
          </button>
        </div>
      </div>
    </article>
  );
};
