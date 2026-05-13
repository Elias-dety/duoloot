import React from 'react';
import { Player } from '@/schemas/player.schema';
import { ProgressBar } from '@/components/atoms';
import { ShieldCheck, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';

export interface ProfileTrustPanelProps {
  player: Player;
}

export const ProfileTrustPanel: React.FC<ProfileTrustPanelProps> = ({ player }) => {
  const isHighTrust = player.trustScore >= 80;
  const isMediumTrust = player.trustScore >= 50 && player.trustScore < 80;
  const color = isHighTrust ? 'success' : isMediumTrust ? 'warning' : 'error';
  const textColor = isHighTrust ? 'text-success' : isMediumTrust ? 'text-warning' : 'text-danger';

  return (
    <section className="bg-surface-dark border border-surface-highlight p-6 rounded-2xl h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-bold text-content-base flex items-center gap-2">
          <ShieldCheck className={`w-5 h-5 ${textColor}`} />
          Trust Score
        </h3>
        <span className={`text-2xl font-black ${textColor}`}>{player.trustScore}/100</span>
      </div>

      <div className="mb-6">
        <ProgressBar value={player.trustScore} color={color} size="lg" className="mb-2" />
        <p className="text-sm text-content-muted">
          {isHighTrust ? 'Jogador altamente confiável e bem avaliado.' : 
           isMediumTrust ? 'Jogador com confiança mediana na comunidade.' : 
           'Atenção: jogador com histórico recente de denúncias ou abandonos.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-success/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <ThumbsUp className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-xs text-content-muted">Elogios</p>
            <p className="text-lg font-bold text-content-base">124</p>
          </div>
        </div>
        
        <div className="bg-danger/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>
          <div>
            <p className="text-xs text-content-muted">Abandonos</p>
            <p className="text-lg font-bold text-content-base">2</p>
          </div>
        </div>
      </div>
    </section>
  );
};
