import React from 'react';
import { AlertTriangle, Trophy } from 'lucide-react';
import { VaultLeaderboardEntry } from '@/features/vault/vault.schema';
import { VaultLeaderboardRow } from './VaultLeaderboardRow';

interface VaultLeaderboardProps {
  entries: VaultLeaderboardEntry[];
  isLoading: boolean;
  error?: string | null;
  currentUserId?: string | null;
}

export const VaultLeaderboard: React.FC<VaultLeaderboardProps> = ({
  entries,
  isLoading,
  error,
  currentUserId,
}) => {
  const topThree = entries.slice(0, 3);
  const remainingEntries = entries.slice(3);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b border-[var(--dl-tactical-line)] pb-4">
        <h2 className="font-['Rajdhani'] text-xl font-bold uppercase text-[var(--dl-tactical-text)]">
          Vault Ranking
        </h2>
        <span
          className="dl-hud-label"
          style={{ color: 'var(--dl-tactical-purple)', borderColor: 'rgba(168,85,247,0.34)', background: 'rgba(168,85,247,0.08)' }}
        >
          VAULT RANKING // TOP OPERATORS
        </span>
      </div>

      <div className="dl-panel overflow-hidden p-5" style={{ borderColor: 'rgba(168,85,247,0.25)' }}>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-4">
                <div className="mb-3 h-4 w-40 rounded bg-white/10" />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="h-16 rounded bg-white/10" />
                  <div className="h-16 rounded bg-white/10" />
                  <div className="h-16 rounded bg-white/10" />
                  <div className="h-16 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded border border-[rgba(255,51,102,0.35)] bg-[rgba(255,51,102,0.08)] p-5 text-center">
            <AlertTriangle className="mx-auto mb-3 h-6 w-6 text-[var(--dl-tactical-red)]" />
            <p className="font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-tactical-red)]">Falha ao carregar o ranking</p>
            <p className="mt-1 text-sm text-white/70">{error}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Trophy className="mb-3 h-8 w-8 text-[var(--dl-tactical-yellow)]/80" />
            <p className="font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-tactical-yellow)]">
              Nenhum operador ranqueado ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topThree.length > 0 && (
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                {topThree.map((entry) => (
                  <VaultLeaderboardRow
                    key={entry.participantId}
                    entry={entry}
                    isCurrentUser={entry.playerId === currentUserId}
                    highlightTop
                  />
                ))}
              </div>
            )}

            {remainingEntries.length > 0 && (
              <div className="space-y-3">
                {remainingEntries.map((entry) => (
                  <VaultLeaderboardRow
                    key={entry.participantId}
                    entry={entry}
                    isCurrentUser={entry.playerId === currentUserId}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
