import React from 'react';
import { AlertTriangle, Archive } from 'lucide-react';
import { VaultSeason } from '@/features/vault/vault.schema';
import { VaultSeasonCard } from './VaultSeasonCard';

interface VaultSeasonHistoryProps {
  seasons: VaultSeason[];
  isLoading: boolean;
  error?: string | null;
}

export const VaultSeasonHistory: React.FC<VaultSeasonHistoryProps> = ({ seasons, isLoading, error }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b border-[var(--dl-border)] pb-4">
        <h2 className="font-['Rajdhani'] text-xl font-bold uppercase text-[#ffffff]">Historico de temporadas</h2>
        <span
          className="dl-hud-label"
          style={{ color: 'var(--dl-function)', borderColor: 'rgba(70,183,255,0.34)', background: 'rgba(70,183,255,0.08)' }}
        >
          VAULT SEASONS // OPERATION HISTORY
        </span>
      </div>

      <div className="dl-panel p-5" style={{ borderColor: 'rgba(70,183,255,0.25)' }}>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse border border-[var(--dl-border)] bg-[var(--dl-surface)] p-4">
                <div className="mb-3 h-4 w-40 bg-white/10" />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
            <p className="font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-error)]">Falha ao carregar temporadas</p>
            <p className="mt-1 text-sm text-white/70">{error}</p>
          </div>
        ) : seasons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Archive className="mb-3 h-8 w-8 text-[var(--dl-function)]/80" />
            <p className="font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-function)]">
              Nenhuma temporada registrada ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {seasons.map((season) => (
              <VaultSeasonCard key={season.eventId} season={season} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
