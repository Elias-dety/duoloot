import { Outlet, NavLink, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function PublicLayout() {
  const menuItems = [
    { label: 'Início', path: ROUTES.HOME },
    { label: 'Lobby', path: ROUTES.LOBBY },
    { label: 'Cofre', path: ROUTES.VAULT },
    { label: 'Coaches', path: ROUTES.COACHES },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-content-primary">
      {/* Header Fixo com efeito Glass */}
      <header className="sticky top-0 z-sticky border-b border-border bg-surface-dark/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to={ROUTES.HOME} className="text-xl font-black tracking-tighter text-brand-primary">
              DUO LOOT
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden items-center gap-6 md:flex">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-brand-primary ${
                      isActive ? 'text-brand-primary' : 'text-content-secondary'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden text-sm font-medium text-content-secondary hover:text-content-primary md:block">
              Entrar
            </button>
            <button className="rounded-md bg-brand-primary px-4 py-2 text-sm font-bold text-background transition-transform active:scale-95">
              Criar conta
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1">
        <div className="container py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-card py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="col-span-2">
              <Link to={ROUTES.HOME} className="text-xl font-black tracking-tighter text-brand-primary">
                DUO LOOT
              </Link>
              <p className="mt-4 max-w-xs text-sm text-content-muted">
                A plataforma definitiva para gamers competitivos encontrarem seus duos e evoluírem no ranking.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-content-primary">Plataforma</h4>
              <ul className="space-y-2 text-sm text-content-secondary">
                <li><Link to={ROUTES.LOBBY} className="hover:text-brand-primary">Lobby</Link></li>
                <li><Link to={ROUTES.VAULT} className="hover:text-brand-primary">Cofre</Link></li>
                <li><Link to={ROUTES.COACHES} className="hover:text-brand-primary">Coaches</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-content-primary">Comunidade</h4>
              <ul className="space-y-2 text-sm text-content-secondary">
                <li><a href="#" className="hover:text-brand-primary">Discord</a></li>
                <li><a href="#" className="hover:text-brand-primary">Twitter</a></li>
                <li><a href="#" className="hover:text-brand-primary">Suporte</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-8 md:flex-row">
            <p className="text-xs text-content-muted">
              © 2024 Duo Loot. Todos os direitos reservados.
            </p>
            <span className="mt-4 rounded-full bg-surface-elevated px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary md:mt-0">
              MVP em produção
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
