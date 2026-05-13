import React from 'react';
import { Player } from '@/schemas/player.schema';
import { StatValue } from '@/components/atoms';

export interface ProfileStatsGridProps {
  player: Player;
}

export const ProfileStatsGrid: React.FC<ProfileStatsGridProps> = ({ player }) => {
  return (
    <section className="bg-surface-dark border border-surface-highlight p-6 rounded-2xl">
      <h3 className="text-lg font-bold text-content-base mb-6">Estatísticas Gerais</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-base/50 p-4 rounded-xl border border-surface-highlight">
          <p className="text-sm text-content-muted mb-1">Partidas</p>
          <p className="text-2xl font-black text-content-base">{player.stats.matchesPlayed}</p>
        </div>
        
        <div className="bg-surface-base/50 p-4 rounded-xl border border-surface-highlight">
          <p className="text-sm text-content-muted mb-1">Win Rate</p>
          <p className="text-2xl font-black text-success">{player.stats.winRate}%</p>
        </div>
        
        <div className="bg-surface-base/50 p-4 rounded-xl border border-surface-highlight">
          <p className="text-sm text-content-muted mb-1">K/D/A Médio</p>
          <p className="text-2xl font-black text-content-base">1.45</p>
        </div>
        
        <div className="bg-surface-base/50 p-4 rounded-xl border border-surface-highlight">
          <p className="text-sm text-content-muted mb-1">Horas Jogadas</p>
          <p className="text-2xl font-black text-content-base">324h</p>
        </div>
      </div>
    </section>
  );
};
