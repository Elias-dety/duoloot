import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '../constants/routes';
import { Button, Logo } from '@/components/atoms';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { useLanguage } from '@/i18n';

export default function PublicLayout() {
  const { isAuthenticated, profile, user, signOut } = useAuth();
  const { messages: copy } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const profilePath = user?.id ? ROUTES.PLAYER_PROFILE.replace(':playerId', user.id) : ROUTES.ONBOARDING;

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / 180, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: copy.layout.nav.home, path: ROUTES.HOME },
    { label: copy.layout.nav.features, path: ROUTES.LOBBY },
    { label: copy.layout.nav.vault, path: ROUTES.VAULT },
    { label: copy.layout.nav.community, path: ROUTES.COACHES },
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
    return copy.common.playerFallback;
  };

  const r = Math.round(8 + (18 - 8) * scrollProgress);
  const g = Math.round(9 + (18 - 9) * scrollProgress);
  const b = Math.round(13 + (24 - 13) * scrollProgress);
  const a = (0.92 + (0.30 - 0.92) * scrollProgress).toFixed(2);
  const headerBg = `rgba(${r}, ${g}, ${b}, ${a})`;
  const borderOpacity = (0.08 - (0.04 * scrollProgress)).toFixed(2);

  return (
    <div className="dl-grid-bg flex min-h-screen flex-col bg-[var(--dl-black)]">
      <div className="dl-top-strip">
        <span>{copy.layout.topStripBrand}</span>
        <span>{copy.layout.topStripStatus}</span>
      </div>

      <header
        className="dl-header sticky top-0 z-50 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300"
        style={{
          backgroundColor: headerBg,
          borderBottom: `1px solid rgba(255,255,255,${borderOpacity})`,
        }}
      >
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
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <span className="rounded-full border border-[var(--dl-border)] bg-white/[0.04] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                {getProfileName()}
              </span>
              <Button size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
                {copy.common.dashboard}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate(profilePath)}>
                {copy.common.profile}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                {copy.common.logout}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>{copy.common.login}</Button>
              <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>{copy.layout.getDuoloot}</Button>
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
          {isMobileMenuOpen ? copy.common.close : copy.common.menu}
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

          <LanguageSwitcher fullWidth />

          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.04] px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                {copy.layout.activeProfile}: {getProfileName()}
              </div>
              <div className="dl-mobile-nav-grid">
                <Button fullWidth size="sm" onClick={() => { closeMobileMenu(); navigate(ROUTES.DASHBOARD); }}>
                  {copy.common.dashboard}
                </Button>
                <Button variant="secondary" fullWidth size="sm" onClick={() => { closeMobileMenu(); navigate(profilePath); }}>
                  {copy.common.profile}
                </Button>
                <Button variant="secondary" size="sm" fullWidth onClick={handleLogout}>
                  {copy.common.logout}
                </Button>
              </div>
            </div>
          ) : (
            <div className="dl-mobile-nav-grid">
              <Button variant="secondary" fullWidth size="sm" onClick={() => { closeMobileMenu(); navigate(ROUTES.LOGIN); }}>{copy.common.login}</Button>
              <Button fullWidth size="sm" onClick={() => { closeMobileMenu(); navigate(ROUTES.REGISTER); }}>{copy.layout.getDuoloot}</Button>
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
                {copy.layout.footerDescription}
              </p>
            </div>

            <div>
              <h4 className="font-['Rajdhani'] text-lg font-bold uppercase text-white">{copy.layout.product}</h4>
              <ul className="mt-4 space-y-3 text-sm text-[var(--dl-muted-light)]">
                <li><Link to={ROUTES.LOBBY} className="hover:text-white">Lobby</Link></li>
                <li><Link to={ROUTES.VAULT} className="hover:text-white">{copy.layout.nav.vault}</Link></li>
                <li><Link to={ROUTES.COACHES} className="hover:text-white">{copy.layout.nav.community}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Rajdhani'] text-lg font-bold uppercase text-white">{copy.layout.social}</h4>
              <ul className="mt-4 space-y-3 text-sm text-[var(--dl-muted-light)]">
                <li>Discord</li>
                <li>X / Twitter</li>
                <li>{copy.layout.support}</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[var(--dl-border)] pt-6 text-sm text-[var(--dl-muted)] md:flex-row md:items-center md:justify-between">
            <p>{copy.layout.rights}</p>
            <span>{copy.layout.experience}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
