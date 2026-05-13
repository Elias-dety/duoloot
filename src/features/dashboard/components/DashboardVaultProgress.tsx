import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ProgressBar, SectionTitle } from '@/components/atoms';

export const DashboardVaultProgress: React.FC = () => {
  return (
    <Card variant="prize" className="flex h-full w-full flex-col">
      <SectionTitle title="Cofre Ativo" subtitle="Seu progresso no evento atual" accent="prize" />

      <div className="mt-4 flex flex-1 flex-col justify-center">
        <div className="mb-4 rounded-xl border border-prize/25 bg-surface-card p-4">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-sm text-content-muted">Missoes concluidas</p>
              <p className="text-xl font-black text-content-base">
                2 <span className="text-sm font-normal text-content-muted">/ 5</span>
              </p>
            </div>
            <p className="text-lg font-black text-prize">R$ 500,00</p>
          </div>
          <ProgressBar value={40} color="warning" className="mb-2" />
          <p className="text-center text-xs text-content-muted">Faltam 3 missoes para qualificar-se ao sorteio</p>
        </div>

        <Link to="/cofre" className="w-full">
          <Button variant="primary" className="w-full">Acessar o Cofre</Button>
        </Link>
      </div>
    </Card>
  );
};
