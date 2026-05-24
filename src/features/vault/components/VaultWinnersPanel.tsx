import React from 'react';
import { AlertTriangle, Trophy } from 'lucide-react';
import { VaultWinner } from '@/features/vault/vault.schema';
import { VaultWinnerCard } from './VaultWinnerCard';

interface VaultWinnersPanelProps {
  winners: VaultWinner[];
  isLoading: boolean;
  error?: string | null;
}

export const VaultWinnersPanel: React.FC<VaultWinnersPanelProps> = ({ winners, isLoading, error }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b border-[var(--dl-border)] pb-4">
        <h2 className="font-['Rajdhani'] text-xl font-bold uppercase text-[#ffffff]">Arquivo de vencedores</h2>
        <span
          className="dl-hud-label"
          style={{ color: 'var(--dl-string)', borderColor: 'rgba(168,85,247,0.34)', background: 'rgba(168,85,247,0.08)' }}
        >
          VAULT ARCHIVE // RECENT WINNERS
        </span>
      </div>

      <div className="dl-panel p-5" style={{ borderColor: 'rgba(168,85,247,0.25)' }}>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse border border-[var(--dl-border)] bg-[var(--dl-surface)] p-4">
                <div className="mb-3 h-4 w-32 bg-white/10" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 bg-white/10" />
                  <div className="h-16 bg-white/10" />
                  <div className="h-16 bg-white/10" />
                  <div className="h-16 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded border border-[rgba(255,51,102,0.35)] bg-[rgba(255,51,102,0.08)] p-5 text-center">
            <AlertTriangle className="mx-auto mb-3 h-6 w-6 text-[var(--dl-error)]" />
            <p className="font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-error)]">Falha ao carregar vencedores</p>
            <p className="mt-1 text-sm text-white/70">{error}</p>
          </div>
        ) : winners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Trophy className="mb-3 h-8 w-8 text-[var(--dl-keyword)]/80" />
            <p className="font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-keyword)]">
              Nenhum vencedor registrado ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
            {winners.map((winner) => (
              <VaultWinnerCard key={winner.winnerId} winner={winner} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
