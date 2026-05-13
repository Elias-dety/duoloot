import React from 'react';
import { Divider } from '@/components/atoms';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto w-full border-t border-border bg-surface-card px-6 py-8 text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-lg font-bold text-content-primary">Duo Loot</span>
          <p className="text-sm text-content-tertiary mt-1">Conectando jogadores para grandes vitórias.</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-content-secondary hover:text-brand-primary transition-colors">Termos</a>
          <a href="#" className="text-sm text-content-secondary hover:text-brand-primary transition-colors">Privacidade</a>
          <a href="#" className="text-sm text-content-secondary hover:text-brand-primary transition-colors">Suporte</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6">
        <Divider />
        <p className="text-xs text-content-tertiary mt-6 text-center">
          © {new Date().getFullYear()} Duo Loot. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};
