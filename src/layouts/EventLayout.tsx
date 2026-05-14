import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function EventLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-dark text-content-primary">
      {/* Header especial do Cofre */}
      <header className="border-b border-prize/30 bg-surface-card/50 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to={ROUTES.HOME} 
              className="text-sm font-bold text-content-secondary transition-colors hover:text-content-primary"
            >
              ← Voltar ao site
            </Link>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-lg font-black tracking-tight text-prize">
              COFRE <span className="text-content-muted">/ EVENTO</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden h-8 items-center rounded-full bg-prize/10 px-3 text-[10px] font-bold uppercase tracking-widest text-prize md:flex">
              Destaque Semanal
            </div>
          </div>
        </div>
      </header>

      {/* Main com fundo imersivo */}
      <main className="relative flex-1 overflow-hidden">
        {/* Efeito de luz de fundo */}
        <div className="absolute left-1/2 top-0 -z-base h-[500px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(255,191,0,0.15)_0%,transparent_70%)]" />
        
        <div className="container py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
