import React from 'react';
import { SectionTitle, ProgressBar, Button } from '@/components/atoms';
import { Link } from 'react-router-dom';

export const DashboardVaultProgress: React.FC = () => {
  return (
    <section className="w-full p-6 bg-surface-dark border border-surface-highlight rounded-2xl flex flex-col h-full">
      <SectionTitle title="Cofre Ativo" subtitle="Seu progresso no evento atual" />
      
      <div className="flex-1 flex flex-col justify-center mt-4">
        <div className="p-4 bg-surface-base rounded-xl border border-surface-highlight/50 mb-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm text-content-muted">Missões Concluídas</p>
              <p className="text-xl font-bold text-content-base">2 <span className="text-sm font-normal text-content-muted">/ 5</span></p>
            </div>
            <p className="text-accent-base font-bold text-lg">R$ 500,00</p>
          </div>
          <ProgressBar value={40} className="mb-2" />
          <p className="text-xs text-content-muted text-center">Faltam 3 missões para qualificar-se ao sorteio</p>
        </div>

        <Link to="/cofre" className="w-full">
          <Button variant="primary" className="w-full">Acessar o Cofre</Button>
        </Link>
      </div>
    </section>
  );
};
