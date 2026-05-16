import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ProgressBar, SectionTitle } from '@/components/atoms';

export const DashboardVaultProgress: React.FC = () => {
  return (
    <article className="dl-panel dl-card-yellow flex h-full w-full flex-col p-6">
      <div className="mb-6">
        <h3 className="dl-hud-label mb-2"><span className="text-[var(--dl-tactical-yellow)]">■</span> Cofre Ativo</h3>
        <p className="text-[13px] text-[var(--dl-tactical-muted)]">Seu progresso no evento atual</p>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-center">
        <div className="mb-4 border border-[var(--dl-tactical-yellow)]/[0.3] bg-[var(--dl-tactical-yellow)]/[0.05] p-4 [clip-path:var(--dl-cut-card)]">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">Missões concluídas</p>
              <p className="font-['Rajdhani'] text-2xl font-bold text-white">
                2 <span className="text-sm font-normal text-white/50">/ 5</span>
              </p>
            </div>
            <p className="font-['Rajdhani'] text-2xl font-bold text-[var(--dl-tactical-yellow)]">R$ 500,00</p>
          </div>
          <ProgressBar value={40} color="warning" className="mb-2" />
          <p className="text-center text-[11px] uppercase tracking-wide text-[var(--dl-tactical-muted)]">Faltam 3 missões para qualificar-se ao sorteio</p>
        </div>

        <Link to="/cofre" className="w-full">
          <button type="button" className="dl-btn dl-btn-yellow w-full">Acessar o Cofre</button>
        </Link>
      </div>
    </article>
  );
};
