import { Outlet, NavLink, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function PublicLayout() {
  const menuItems = [
    { label: 'Scanner', path: ROUTES.HOME },
    { label: 'Lobbies', path: ROUTES.LOBBY },
    { label: 'Cofre', path: ROUTES.VAULT },
    { label: 'Coaches', path: ROUTES.COACHES },
  ];

  return (
    <div className="dl-scanlines min-h-screen flex flex-col" style={{ background: 'var(--dl-tactical-bg)' }}>
      {/* Top Strip */}
      <div className="dl-top-strip">
        <span>
          Underground Loot Network // <b>Vault market open</b>
        </span>
        <span>DL-042 // Contratos ativos // Matchmaking sync</span>
      </div>

      {/* Header Command Center */}
      <header className="dl-header">
        <Link to={ROUTES.HOME} className="dl-brand no-underline">
          <span className="dl-brand-mark">DL</span>
          <span>
            Duo Loot
            <small>Underground Tactical</small>
          </span>
        </Link>

        <nav className="dl-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dl-actions">
          <button type="button" className="dl-btn">
            Entrar
          </button>
          <button type="button" className="dl-btn dl-btn-primary">
            Abrir acesso
          </button>
        </div>

        {/* Mobile menu button */}
        <button type="button" className="dl-btn md:hidden">
          Menu
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 relative z-[4]">
        <Outlet />
      </main>

      {/* Footer Underground */}
      <footer className="relative z-[4] border-t border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-panel)] backdrop-blur-[10px]">
        <div className="mx-auto max-w-[1240px] px-6 py-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link to={ROUTES.HOME} className="dl-brand no-underline text-[22px]">
                <span className="dl-brand-mark" style={{ width: 34, height: 34, fontSize: 14 }}>DL</span>
                <span>
                  Duo Loot
                  <small>Underground Tactical</small>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-[13px] leading-[1.65] text-[var(--dl-tactical-muted)]">
                Central clandestina de estatísticas, lobbies e recompensas para gamers competitivos.
              </p>
            </div>
            <div>
              <h4 className="dl-title mb-4 text-[11px] font-bold tracking-[0.18em] text-[var(--dl-tactical-yellow)]">Plataforma</h4>
              <ul className="space-y-2 text-[12px] font-bold uppercase tracking-[0.08em]">
                <li><Link to={ROUTES.LOBBY} className="text-[var(--dl-tactical-muted)] hover:text-[var(--dl-tactical-green)] transition-colors">Lobby Radar</Link></li>
                <li><Link to={ROUTES.VAULT} className="text-[var(--dl-tactical-muted)] hover:text-[var(--dl-tactical-green)] transition-colors">Cofre</Link></li>
                <li><Link to={ROUTES.COACHES} className="text-[var(--dl-tactical-muted)] hover:text-[var(--dl-tactical-green)] transition-colors">Coaches</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="dl-title mb-4 text-[11px] font-bold tracking-[0.18em] text-[var(--dl-tactical-yellow)]">Comunidade</h4>
              <ul className="space-y-2 text-[12px] font-bold uppercase tracking-[0.08em]">
                <li><a href="#" className="text-[var(--dl-tactical-muted)] hover:text-[var(--dl-tactical-green)] transition-colors">Discord</a></li>
                <li><a href="#" className="text-[var(--dl-tactical-muted)] hover:text-[var(--dl-tactical-green)] transition-colors">Twitter</a></li>
                <li><a href="#" className="text-[var(--dl-tactical-muted)] hover:text-[var(--dl-tactical-green)] transition-colors">Suporte</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between border-t border-[var(--dl-tactical-line)] pt-8 md:flex-row">
            <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--dl-tactical-muted)]">
              © 2024 Duo Loot // Underground Tactical Command Center
            </p>
            <span className="dl-stamp dl-stamp-yellow mt-4 md:mt-0">
              Sistema ativo
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
