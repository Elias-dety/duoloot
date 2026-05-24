import React from 'react';
import { Crosshair, Shield, Trophy } from 'lucide-react';
import { MyVaultRank, VaultLeaderboardEntry } from '@/features/vault/vault.schema';

interface VaultUserRankPanelProps {
  myRank: MyVaultRank | null;
  leaderboard: VaultLeaderboardEntry[];
  isLoggedIn: boolean;
  isParticipant: boolean;
}

export const VaultUserRankPanel: React.FC<VaultUserRankPanelProps> = ({
  myRank,
  leaderboard,
  isLoggedIn,
  isParticipant,
}) => {
  if (!isLoggedIn) {
    return (
      <div className="dl-panel p-5" style={{ borderColor: 'rgba(70,183,255,0.25)' }}>
        <h3 className="mb-2 font-['Rajdhani'] text-xl font-bold uppercase text-[var(--dl-function)]">Sua posição tática</h3>
        <p className="text-sm text-[var(--dl-muted)]">Entre para registrar sua posição.</p>
      </div>
    );
  }

  if (!isParticipant || !myRank) {
    return (
      <div className="dl-panel p-5" style={{ borderColor: 'rgba(255,226,102,0.25)' }}>
        <h3 className="mb-2 font-['Rajdhani'] text-xl font-bold uppercase text-[var(--dl-keyword)]">Sua posição tática</h3>
        <p className="text-sm text-[var(--dl-muted)]">Participe do Cofre para entrar no ranking.</p>
      </div>
    );
  }

  const topEntry = leaderboard[0];
  const pointsGap = Math.max(0, (topEntry?.points || 0) - (myRank.points || 0));

  return (
    <div className="dl-panel p-5" style={{ borderColor: 'rgba(56,242,139,0.25)' }}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-['Rajdhani'] text-xl font-bold uppercase text-[var(--dl-success)]">Sua posição tática</h3>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--dl-muted)]">
            Monitoramento individual no ranking do cofre
          </p>
        </div>
        <span className="dl-stamp dl-stamp-green">#{myRank.rankPosition}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded border border-[var(--dl-border)] bg-[var(--dl-surface)] p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--dl-keyword)]">
            <Trophy className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wide">Pontos</span>
          </div>
          <p className="font-['Rajdhani'] text-3xl font-bold text-[var(--dl-keyword)]">{myRank.points || 0}</p>
        </div>

        <div className="rounded border border-[var(--dl-border)] bg-[var(--dl-surface)] p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--dl-success)]">
            <Crosshair className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wide">Missões</span>
          </div>
          <p className="font-['Rajdhani'] text-3xl font-bold text-[var(--dl-success)]">
            {myRank.missionsCompleted || 0}
            <span className="ml-1 text-lg text-white/60">/ {myRank.totalMissions || 0}</span>
          </p>
        </div>

        <div className="rounded border border-[var(--dl-border)] bg-[var(--dl-surface)] p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--dl-function)]">
            <Shield className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wide">Trust score</span>
          </div>
          <p className="font-['Rajdhani'] text-3xl font-bold text-[var(--dl-function)]">{myRank.trustScore || 0}</p>
        </div>

        <div className="rounded border border-[var(--dl-border)] bg-[var(--dl-surface)] p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-string)]">Diferença p/ topo</p>
          <p className="font-['Rajdhani'] text-3xl font-bold text-[var(--dl-string)]">{pointsGap} pts</p>
        </div>
      </div>

      <a
        href="#vault-missions"
        className="dl-btn mt-5 flex h-10 w-full items-center justify-center border border-[var(--dl-keyword)] text-[var(--dl-keyword)] hover:bg-[var(--dl-keyword)] hover:text-black"
      >
        Completar missões
      </a>
    </div>
  );
};
