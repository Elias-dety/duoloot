import React from 'react';


export interface TrustScorePanelProps {
  trustScore: number;
}

export const TrustScorePanel: React.FC<TrustScorePanelProps> = ({ trustScore }) => {
  const isHigh = trustScore >= 80;
  const isMedium = trustScore >= 50 && trustScore < 80;
  const color = isHigh ? 'text-[var(--dl-tactical-green)]' : isMedium ? 'text-[var(--dl-tactical-yellow)]' : 'text-[var(--dl-tactical-red)]';

  return (
    <article className="dl-panel flex h-full w-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-6">
        <h3 className="dl-hud-label mb-2"><span className="text-[var(--dl-tactical-green)]">■</span> Trust Score</h3>
        <p className="text-[13px] text-[var(--dl-tactical-muted)]">Sua reputação na comunidade</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <div className="relative mb-4 flex h-32 w-32 items-center justify-center border-4 border-white/[0.05] [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]">
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="58" className="fill-none stroke-white/[0.05] stroke-[4]" />
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
          <div className="flex flex-col items-center justify-center z-10">
            <span className={`font-['Rajdhani'] text-4xl font-bold ${color}`}>{trustScore}</span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/40">/ 100</span>
          </div>
        </div>

        <p className="max-w-[220px] text-center text-[13px] text-[var(--dl-tactical-muted)]">
          {isHigh
            ? 'Excelente reputação para formar duo.'
            : isMedium
              ? 'Bom histórico, com margem para subir.'
              : 'Score baixo. Evite abandonos e penalidades.'}
        </p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2">
        <div className="border border-[var(--dl-tactical-line)] bg-white/[0.02] p-3 text-center [clip-path:var(--dl-cut-button)]">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">Elogios</p>
          <p className="font-['Rajdhani'] text-2xl font-bold text-[var(--dl-tactical-green)]">42</p>
        </div>
        <div className="border border-[var(--dl-tactical-line)] bg-white/[0.02] p-3 text-center [clip-path:var(--dl-cut-button)]">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">Abandonos</p>
          <p className="font-['Rajdhani'] text-2xl font-bold text-white">0</p>
        </div>
      </div>
    </article>
  );
};
