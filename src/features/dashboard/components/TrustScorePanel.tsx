import React from 'react';
import { SectionTitle } from '@/components/atoms';

export interface TrustScorePanelProps {
  trustScore: number;
}

export const TrustScorePanel: React.FC<TrustScorePanelProps> = ({ trustScore }) => {
  // Calculate visual properties based on score
  const isHigh = trustScore >= 80;
  const isMedium = trustScore >= 50 && trustScore < 80;
  const color = isHigh ? 'text-success' : isMedium ? 'text-orange-500' : 'text-danger';
  const bgColor = isHigh ? 'bg-success' : isMedium ? 'bg-warning' : 'bg-danger';

  return (
    <section className="w-full p-6 bg-surface-dark border border-surface-highlight rounded-2xl flex flex-col h-full">
      <SectionTitle title="Trust Score" subtitle="Sua reputação na comunidade" />
      
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-surface-highlight mb-4">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="58"
              className="fill-none stroke-surface-highlight stroke-[4]"
            />
            <circle
              cx="60"
              cy="60"
              r="58"
              className={`fill-none ${color} stroke-[4] transition-all duration-1000`}
              strokeDasharray="364"
              strokeDashoffset={364 - (364 * trustScore) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${color}`}>{trustScore}</span>
            <span className="text-xs text-content-muted">/ 100</span>
          </div>
        </div>

        <p className="text-center text-sm text-content-base max-w-[200px]">
          {isHigh 
            ? 'Excelente! Você é um jogador altamente confiável.' 
            : isMedium 
            ? 'Bom, mas cuidado com abandonos e denúncias.' 
            : 'Atenção! Seu score está baixo. Evite penalidades.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto">
        <div className="p-3 bg-surface-base rounded-lg border border-surface-highlight/50 text-center">
          <p className="text-xs text-content-muted mb-1">Elogios</p>
          <p className="text-lg font-semibold text-content-base">42</p>
        </div>
        <div className="p-3 bg-surface-base rounded-lg border border-surface-highlight/50 text-center">
          <p className="text-xs text-content-muted mb-1">Abandonos</p>
          <p className="text-lg font-semibold text-content-base">0</p>
        </div>
      </div>
    </section>
  );
};
