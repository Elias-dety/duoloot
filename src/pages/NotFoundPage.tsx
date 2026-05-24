import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(var(--dl-error-rgb)/0.15),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
      
      {/* Elemento de fundo sutil 404 */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
        <span className="font-['Rajdhani'] text-[24vw] font-black leading-none text-white/[0.02] drop-shadow-[0_0_30px_rgba(var(--dl-error-rgb),0.1)]">
          404
        </span>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <article className="dl-panel flex flex-col items-center justify-center p-8 text-center md:p-16 transition-all duration-500 hover:shadow-[0_0_40px_rgba(var(--dl-error-rgb),0.15)]">
          <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-[var(--dl-error)]/30 bg-[var(--dl-error)]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--dl-error)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--dl-error)]" />
            404 // SIGNAL LOST
          </div>

          <h1 className="mb-4 font-['Rajdhani'] text-4xl font-bold uppercase tracking-wide text-white md:text-5xl lg:text-6xl">
            Página não encontrada
          </h1>
          
          <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-[var(--dl-muted-light)] md:text-base">
            A rota que você tentou acessar saiu do radar do Duo Loot.
            <br />
            Volte para uma área segura e continue sua operação.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 w-full sm:flex-row sm:w-auto">
            <Link to={ROUTES.HOME} className="w-full sm:w-auto">
              <button type="button" className="dl-btn dl-btn-red w-full px-8 py-3.5">
                Voltar para Home
              </button>
            </Link>
            
            <Link to={ROUTES.LOBBY} className="w-full sm:w-auto">
              <button type="button" className="dl-btn w-full px-8 py-3.5">
                Encontrar Lobby
              </button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NotFoundPage;
