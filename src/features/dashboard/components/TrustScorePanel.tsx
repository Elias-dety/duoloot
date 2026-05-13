import React from 'react';
import { Card, SectionTitle } from '@/components/atoms';

export interface TrustScorePanelProps {
  trustScore: number;
}

export const TrustScorePanel: React.FC<TrustScorePanelProps> = ({ trustScore }) => {
  const isHigh = trustScore >= 80;
  const isMedium = trustScore >= 50 && trustScore < 80;
  const color = isHigh ? 'text-success' : isMedium ? 'text-prize' : 'text-danger';

  return (
    <Card variant="default" className="flex h-full w-full flex-col">
      <SectionTitle title="Trust Score" subtitle="Sua reputacao na comunidade" accent="green" />

      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <div className="relative mb-4 flex h-32 w-32 items-center justify-center rounded-full border-4 border-border">
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="58" className="fill-none stroke-surface-hover stroke-[4]" />
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
            <span className={`text-4xl font-black ${color}`}>{trustScore}</span>
            <span className="text-xs text-content-muted">/ 100</span>
          </div>
        </div>

        <p className="max-w-[220px] text-center text-sm text-content-base">
          {isHigh
            ? 'Excelente reputacao para formar duo.'
            : isMedium
              ? 'Bom historico, com margem para subir.'
              : 'Score baixo. Evite abandonos e penalidades.'}
        </p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border bg-surface-elevated p-3 text-center">
          <p className="mb-1 text-xs text-content-muted">Elogios</p>
          <p className="text-lg font-semibold text-success">42</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-elevated p-3 text-center">
          <p className="mb-1 text-xs text-content-muted">Abandonos</p>
          <p className="text-lg font-semibold text-content-base">0</p>
        </div>
      </div>
    </Card>
  );
};
