import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/useAuth';
import { usePlayerPresence } from '@/hooks/usePlayerPresence';
import type { PlayerGameProfile } from '@/services/auth.service';
import { ROUTES } from '../constants/routes';
import { DuolootButton, DuolootCard, DuolootLogo } from '@/components/duoloot';

export default function DashboardLayout() {
  const { profile, user, signOut } = useAuth();
  usePlayerPresence();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, code: 'DB' },
    { label: 'Premium', path: ROUTES.PREMIUM, code: 'PR' },
    { label: 'Lobby', path: ROUTES.LOBBY, code: 'LB' },
    { label: 'Vault', path: ROUTES.VAULT, code: 'VT' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.HOME);
  };

  const getNickname = () => {
    if (profile?.nickname) return profile.nickname;
    if (user?.email) return user.email.split('@')[0];
    return 'Player';
  };

  const getInitials = () => getNickname().slice(0, 2).toUpperCase();

  const getRank = () => {
    const gameProfile = profile?.game_profile as PlayerGameProfile | undefined;
    const mainGame = gameProfile?.mainGame || gameProfile?.main_game;
    const rank = gameProfile?.currentRank || gameProfile?.rank;
    return mainGame && rank ? `${mainGame.toUpperCase()} • ${rank.toUpperCase()}` : 'Perfil em configuração';
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--dl-black)] md:flex-row">
      <div className="border-b border-[var(--dl-border)] bg-[rgba(8,10,14,0.92)] md:hidden">
        <header className="flex items-center justify-between gap-3 px-3 py-3">
          <Link to={ROUTES.HOME} className="dl-brand">
            <DuolootLogo compact subtitle="Dashboard" />
          </Link>
          <div className="flex items-center gap-2">
            <DuolootButton variant="secondary" size="sm" onClick={() => navigate(ROUTES.ONBOARDING)}>Perfil</DuolootButton>
            <DuolootButton variant="secondary" size="sm" onClick={handleLogout}>
              Sair
            </DuolootButton>
          </div>
        </header>

        <nav className="grid grid-cols-2 gap-2 px-3 pb-3">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="no-underline">
              {({ isActive }) => (
                <span className={`inline-flex min-h-9 w-full items-center justify-center rounded-full border px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${isActive ? 'border-[var(--dl-red)] bg-[var(--dl-red)] text-white' : 'border-[var(--dl-border)] bg-white/[0.04] text-white'}`}>
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <aside className="hidden w-72 flex-col border-r border-[var(--dl-border)] bg-[rgba(8,10,14,0.94)] p-4 md:flex">
        <div className="border-b border-[var(--dl-border)] pb-5">
          <Link to={ROUTES.HOME} className="dl-brand">
            <DuolootLogo subtitle="Player Hub" />
          </Link>
        </div>

        <nav className="flex-1 space-y-2 py-5">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="block no-underline">
              {({ isActive }) => (
                <div className={`flex items-center gap-3 rounded-[1.2rem] border px-4 py-3 transition ${isActive ? 'border-[var(--dl-border-red)] bg-[rgba(255,0,0,0.12)] text-white' : 'border-transparent bg-transparent text-[var(--dl-muted-light)] hover:border-[var(--dl-border)] hover:bg-white/[0.04] hover:text-white'}`}>
                  <span className="grid h-10 w-10 place-items-center rounded-[0.95rem] border border-[var(--dl-border)] bg-white/[0.04] text-[0.74rem] font-bold uppercase tracking-[0.12em]">
                    {item.code}
                  </span>
                  <span className="font-semibold uppercase tracking-[0.1em]">{item.label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <DuolootCard variant="elevated" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-[1rem] border border-[var(--dl-border-red)] bg-[rgba(255,0,0,0.12)] font-['Rajdhani'] text-lg font-bold uppercase">
              {getInitials()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-['Rajdhani'] text-lg font-bold uppercase text-white">{getNickname()}</p>
              <p className="truncate text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                {profile?.is_premium ? 'Premium' : 'Standard'}
              </p>
            </div>
          </div>

          <div className="rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.12em] text-[var(--dl-muted-light)]">
            {getRank()}
          </div>

          <DuolootButton fullWidth variant="secondary" size="sm" onClick={() => navigate(ROUTES.ONBOARDING)}>Editar perfil</DuolootButton>
          <DuolootButton fullWidth variant="danger" size="sm" onClick={handleLogout}>
            Encerrar sessão
          </DuolootButton>
        </DuolootCard>
      </aside>

      <main className="relative flex-1 overflow-auto">
        <div className="relative z-[1] h-full p-3 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
