import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function EventLayout() {
  return (
    <div className="dl-scanlines min-h-screen flex flex-col" style={{ background: 'var(--dl-tactical-bg)' }}>
      {/* Header Painel de Operação do Cofre */}
      <header className="sticky top-0 z-20 border-b border-[rgba(255,226,102,0.25)] bg-[rgba(13,18,27,0.92)] backdrop-blur-[14px]">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              to={ROUTES.HOME}
              className="dl-btn text-[11px] no-underline"
            >
              ← Voltar
            </Link>
            <div className="h-5 w-px bg-[var(--dl-tactical-line)]" />
            <h1 className="dl-title text-lg font-bold text-[var(--dl-tactical-yellow)] flex items-center gap-2">
              <span className="dl-brand-mark" style={{ width: 30, height: 30, fontSize: 11 }}>VLT</span>
              COFRE <span className="text-[var(--dl-tactical-muted)] text-[13px]">// OPERAÇÃO LOOT</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="dl-stamp dl-stamp-yellow hidden md:inline-flex">Evento ativo</span>
            <span className="dl-hud-label hidden lg:inline-flex">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--dl-tactical-yellow)] animate-pulse" />
              Vault online
            </span>
          </div>
        </div>
      </header>

      {/* Main com efeito de luz amarela do cofre */}
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,226,102,0.12)_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,226,102,0.015)_0_4px,transparent_4px_9px)]" />

        <div className="relative z-[4] mx-auto max-w-[1240px] px-4 py-8 md:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
