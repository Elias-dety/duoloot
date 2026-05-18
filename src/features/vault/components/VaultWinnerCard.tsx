import React from 'react';
import { Avatar } from '@/components/atoms';
import { Gift, Shield, Trophy } from 'lucide-react';
import { VaultWinner } from '@/features/vault/vault.schema';

interface VaultWinnerCardProps {
  winner: VaultWinner;
}

const rankBadges: Record<number, string> = {
  1: 'CHAMPION',
  2: 'RUNNER',
  3: 'ELITE',
};

const rewardTone: Record<VaultWinner['rewardStatus'], string> = {
  pending: 'text-[var(--dl-tactical-yellow)]',
  approved: 'text-[var(--dl-tactical-green)]',
  paid: 'text-[var(--dl-tactical-green)]',
  cancelled: 'text-[var(--dl-tactical-red)]',
};

export const VaultWinnerCard: React.FC<VaultWinnerCardProps> = ({ winner }) => {
  const nickname = winner.playerNickname || winner.playerName || 'Operador';
  const badge = rankBadges[winner.rankPosition];

  return (
    <article
      className={[
        'dl-panel p-4',
        winner.rankPosition <= 3 ? 'border-[rgba(168,85,247,0.28)] bg-[linear-gradient(135deg,rgba(168,85,247,0.08),rgba(255,226,102,0.05),transparent)]' : '',
      ].join(' ')}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center bg-[var(--dl-tactical-metal)] font-['Rajdhani'] text-2xl font-bold text-[var(--dl-tactical-yellow)] [clip-path:var(--dl-cut-button)]">
          #{winner.rankPosition}
        </div>
        <Avatar
          src={winner.avatarUrl || undefined}
          alt={nickname}
          fallback={nickname}
          size="md"
          className="border-[rgba(70,183,255,0.28)] bg-[var(--dl-tactical-metal)]"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-['Rajdhani'] text-lg font-bold uppercase text-white">{nickname}</h3>
            {badge && <span className="dl-stamp dl-stamp-purple">{badge}</span>}
          </div>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[var(--dl-tactical-muted)]">
            {winner.eventTitle || 'Operacao do Cofre'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3">
          <div className="mb-1 flex items-center gap-1 text-[var(--dl-tactical-yellow)]">
            <Trophy className="h-3.5 w-3.5" />
            <span className="font-bold uppercase">Pontos</span>
          </div>
          <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-tactical-yellow)]">{winner.points || 0}</p>
        </div>

        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3">
          <div className="mb-1 flex items-center gap-1 text-[var(--dl-tactical-yellow)]">
            <Gift className="h-3.5 w-3.5" />
            <span className="font-bold uppercase">Premio</span>
          </div>
          <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-tactical-yellow)]">
            {winner.prizeValue || 0}
          </p>
          <p className="text-[10px] uppercase text-white/60">{winner.prizeLabel || 'Loot'}</p>
        </div>

        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3">
          <div className="mb-1 flex items-center gap-1 text-[var(--dl-tactical-blue)]">
            <Shield className="h-3.5 w-3.5" />
            <span className="font-bold uppercase">Trust</span>
          </div>
          <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-tactical-blue)]">{winner.trustScore || 0}</p>
        </div>

        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3">
          <p className="mb-1 font-bold uppercase text-[var(--dl-tactical-muted)]">Recompensa</p>
          <p className={`font-['Rajdhani'] text-lg font-bold uppercase ${rewardTone[winner.rewardStatus]}`}>
            {winner.rewardStatus}
          </p>
        </div>
      </div>
    </article>
  );
};
