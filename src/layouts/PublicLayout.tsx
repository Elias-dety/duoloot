import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '../constants/routes';
import { Button, Logo } from '@/components/atoms';

export default function PublicLayout() {
  const { isAuthenticated, profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Features', path: ROUTES.LOBBY },
    { label: 'Vault', path: ROUTES.VAULT },
    { label: 'Community', path: ROUTES.COACHES },
  ];

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getProfileName = () => {
    if (profile?.nickname) return profile.nickname;
    if (user?.email) return user.email.split('@')[0];
    return 'Player';
  };

  return (
    <div className="dl-grid-bg flex min-h-screen flex-col bg-[var(--dl-black)]">
      <div className="dl-top-strip">
        <span>Duoloot Red Vault</span>
        <span>Matchmaking live • Vault rewards active</span>
      </div>

      <header className="dl-header">
        <Link to={ROUTES.HOME} className="dl-brand">
          <Logo subtitle="Red Vault" />
        </Link>

        <nav className="dl-nav">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dl-actions">
          {isAuthenticated ? (
            <>
              <span className="rounded-full border border-[var(--dl-border)] bg-white/[0.04] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                {getProfileName()}
              </span>
              <Button size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
                Dashboard
              </Button>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>Login</Button>
              <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>Get Duoloot</Button>
            </>
          )}
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="public-mobile-nav"
        >
          {isMobileMenuOpen ? 'Fechar' : 'Menu'}
        </Button>
      </header>

      {isMobileMenuOpen && (
        <div id="public-mobile-nav" className="dl-mobile-nav md:hidden">
          <div className="dl-mobile-nav-grid">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="no-underline"
                onClick={closeMobileMenu}
              >
                <span className="inline-flex min-h-9 w-full items-center justify-center rounded-full border border-[var(--dl-border)] bg-white/[0.04] px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.04] px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                Perfil ativo: {getProfileName()}
              </div>
              <div className="dl-mobile-nav-grid">
                <Button fullWidth size="sm" onClick={() => { closeMobileMenu(); navigate(ROUTES.DASHBOARD); }}>
                  Dashboard
                </Button>
                <Button variant="secondary" size="sm" fullWidth onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </div>
          ) : (
            <div className="dl-mobile-nav-grid">
              <Button variant="secondary" fullWidth size="sm" onClick={() => { closeMobileMenu(); navigate(ROUTES.LOGIN); }}>Login</Button>
              <Button fullWidth size="sm" onClick={() => { closeMobileMenu(); navigate(ROUTES.REGISTER); }}>Get Duoloot</Button>
            </div>
          )}
        </div>
      )}

      <main className="relative z-[1] flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--dl-border)] bg-[rgba(15,15,18,0.86)]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-4 py-10 md:px-6">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <Link to={ROUTES.HOME} className="dl-brand">
                <Logo compact subtitle="Red Vault" />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--dl-muted-light)]">
                Plataforma para encontrar duos, melhorar lobbies e destravar recompensas do Vault com uma identidade única.
              </p>
            </div>

            <div>
              <h4 className="font-['Rajdhani'] text-lg font-bold uppercase text-white">Produto</h4>
              <ul className="mt-4 space-y-3 text-sm text-[var(--dl-muted-light)]">
                <li><Link to={ROUTES.LOBBY} className="hover:text-white">Lobby</Link></li>
                <li><Link to={ROUTES.VAULT} className="hover:text-white">Vault</Link></li>
                <li><Link to={ROUTES.COACHES} className="hover:text-white">Community</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Rajdhani'] text-lg font-bold uppercase text-white">Social</h4>
              <ul className="mt-4 space-y-3 text-sm text-[var(--dl-muted-light)]">
                <li>Discord</li>
                <li>X / Twitter</li>
                <li>Support</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[var(--dl-border)] pt-6 text-sm text-[var(--dl-muted)] md:flex-row md:items-center md:justify-between">
            <p>© 2026 Duoloot. All rights reserved.</p>
            <span>Red Vault experience</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
