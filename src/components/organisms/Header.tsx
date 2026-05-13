import React from 'react';
import { Button } from '@/components/atoms';

export interface HeaderProps {
  onLogin?: () => void;
  onSignUp?: () => void;
  isLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onLogin, onSignUp, isLoggedIn }) => {
  return (
    <header className="flex w-full items-center justify-between border-b border-border bg-surface-card px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-content-primary">Duo Loot</span>
      </div>
      
      <nav className="hidden md:flex gap-6">
        <a href="#" className="text-content-secondary hover:text-content-primary transition-colors">Lobby</a>
        <a href="#" className="text-content-secondary hover:text-content-primary transition-colors">Cofre</a>
      </nav>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <Button variant="outline" size="sm">Perfil</Button>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={onLogin}>Entrar</Button>
            <Button variant="primary" size="sm" onClick={onSignUp}>Criar Conta</Button>
          </>
        )}
      </div>
    </header>
  );
};
