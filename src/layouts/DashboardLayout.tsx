import { Outlet, NavLink, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function DashboardLayout() {
  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Premium', path: ROUTES.PREMIUM },
    { label: 'Lobby', path: ROUTES.LOBBY },
    { label: 'Cofre', path: ROUTES.VAULT },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-content-primary md:flex-row">
      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-surface-card px-4 md:hidden">
        <Link to={ROUTES.HOME} className="text-lg font-black tracking-tighter text-brand-primary">
          DUO LOOT
        </Link>
        <button className="rounded-md bg-surface-elevated p-2 text-content-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-surface-card md:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to={ROUTES.HOME} className="text-xl font-black tracking-tighter text-brand-primary">
            DUO LOOT
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-brand-primary/10 text-brand-primary' 
                    : 'text-content-secondary hover:bg-surface-elevated hover:text-content-primary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-xl bg-surface-elevated p-3">
            <div className="h-10 w-10 rounded-full bg-brand-primary/20 flex items-center justify-center font-bold text-brand-primary">
              JD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-content-primary">Jogador Demo</p>
              <p className="truncate text-xs text-content-muted">Nível 1</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-auto bg-surface-dark/30">
        <div className="h-full p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
