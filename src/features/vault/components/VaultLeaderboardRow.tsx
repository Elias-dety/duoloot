import React from 'react';
import { Avatar } from '@/components/atoms';
import { Crown, Shield, Target, Trophy } from 'lucide-react';
import { VaultLeaderboardEntry } from '@/features/vault/vault.schema';

interface VaultLeaderboardRowProps {
  entry: VaultLeaderboardEntry;
  isCurrentUser?: boolean;
  highlightTop?: boolean;
}

const BADGE_BY_RANK: Record<number, string> = {
  1: 'VAULT LEADER',
  2: 'ELITE RUNNER',
  3: 'HIGH VALUE',
};

export const VaultLeaderboardRow: React.FC<VaultLeaderboardRowProps> = ({
  entry,
  isCurrentUser = false,
  highlightTop = false,
}) => {
  const nickname = entry.playerNickname || entry.playerName || 'Operador';
  const currentRank = String(entry.gameProfile?.currentRank || entry.gameProfile?.rank || 'Sem rank');
  const points = entry.points || 0;
  const missionsCompleted = entry.missionsCompleted || 0;
  const totalMissions = entry.totalMissions || 0;
  const trustScore = entry.trustScore || 0;
  const rankBadge = BADGE_BY_RANK[entry.rankPosition];

  return (
    <article
      className={[
        'dl-panel relative overflow-hidden p-4 transition-all',
        highlightTop ? 'border-[rgba(168,85,247,0.34)] bg-[linear-gradient(135deg,rgba(168,85,247,0.1),rgba(255,226,102,0.06),rgba(10,17,28,0.95))]' : '',
        isCurrentUser ? 'border-[rgba(56,242,139,0.4)] shadow-[0_0_0_1px_rgba(56,242,139,0.12)]' : '',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <div className="flex min-w-[52px] flex-col items-center gap-2">
          <div
            className={[
              'flex h-11 w-11 items-center justify-center font-[Rajdhani] text-2xl font-bold rounded-[1rem]',
              entry.rankPosition <= 3
                ? 'bg-[rgba(255,226,102,0.12)] text-[var(--dl-keyword)]'
                : 'bg-[var(--dl-surface)] text-[var(--dl-function)]',
            ].join(' ')}
          >
            #{entry.rankPosition}
          </div>
          {entry.rankPosition === 1 && <Crown className="h-4 w-4 text-[var(--dl-keyword)]" />}
        </div>

        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Avatar
            src={entry.avatarUrl || undefined}
            alt={nickname}
            fallback={nickname}
            size={highlightTop ? 'lg' : 'md'}
            className="border-[rgba(70,183,255,0.28)] bg-[var(--dl-surface)]"
          />

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="truncate font-['Rajdhani'] text-lg font-bold uppercase text-white">
                {nickname}
              </h3>
              {rankBadge && <span className="dl-stamp dl-stamp-purple">{rankBadge}</span>}
              {isCurrentUser && <span className="dl-stamp dl-stamp-yellow">VOCÊ</span>}
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold uppercase tracking-wide">
              <span className="text-[var(--dl-function)]">{currentRank}</span>
              <span className="text-[var(--dl-muted)]">{entry.playerName || 'Operador Duo Loot'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
              <div className="rounded border border-[var(--dl-border)] bg-[var(--dl-surface)] px-2 py-2">
                <div className="mb-1 flex items-center gap-1 text-[var(--dl-keyword)]">
                  <Trophy className="h-3.5 w-3.5" />
                  <span className="font-bold uppercase">Pontos</span>
                </div>
                <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-keyword)]">{points}</p>
              </div>

              <div className="rounded border border-[var(--dl-border)] bg-[var(--dl-surface)] px-2 py-2">
                <div className="mb-1 flex items-center gap-1 text-[var(--dl-success)]">
                  <Target className="h-3.5 w-3.5" />
                  <span className="font-bold uppercase">Missões</span>
                </div>
                <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-success)]">
                  {missionsCompleted}
                  <span className="ml-1 text-sm text-white/50">/ {totalMissions}</span>
                </p>
              </div>

              <div className="rounded border border-[var(--dl-border)] bg-[var(--dl-surface)] px-2 py-2">
                <div className="mb-1 flex items-center gap-1 text-[var(--dl-function)]">
                  <Shield className="h-3.5 w-3.5" />
                  <span className="font-bold uppercase">Trust</span>
                </div>
                <p className="font-['Rajdhani'] text-xl font-bold text-[var(--dl-function)]">{trustScore}</p>
              </div>

              <div className="rounded border border-[var(--dl-border)] bg-[var(--dl-surface)] px-2 py-2">
                <p className="mb-1 font-bold uppercase text-[var(--dl-muted)]">Entrada</p>
                <p className="font-['Rajdhani'] text-base font-bold text-white">
                  {new Date(entry.joinedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
