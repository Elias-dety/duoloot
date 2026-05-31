import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/useAuth';
import { usePlayerPresence } from '@/hooks/usePlayerPresence';
import type { PlayerGameProfile } from '@/services/auth.service';
import { ROUTES } from '../constants/routes';
import { Button, Card, Logo } from '@/components/atoms';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import { useLanguage } from '@/i18n';
import { getMyWalletAccount } from '@/services/wallet.service';
import type { WalletAccount } from '@/features/wallet/wallet.schema';

import duoCoinIcon16 from '@/assets/icons/duoloot_pontos_token_check_16px.png';
import duoCoinIcon32 from '@/assets/icons/duoloot_pontos_token_check_32px.png';

export default function DashboardLayout() {
  const { profile, user, signOut } = useAuth();
  const { messages: copy } = useLanguage();
  usePlayerPresence();
  const navigate = useNavigate();
  const profilePath = user?.id ? ROUTES.PLAYER_PROFILE.replace(':playerId', user.id) : ROUTES.ONBOARDING;

  const [wallet, setWallet] = useState<WalletAccount | null>(null);

  useEffect(() => {
    if (user?.id) {
      getMyWalletAccount()
        .then(setWallet)
        .catch(console.error);
    }
  }, [user?.id]);

  const navItems = [
    { label: copy.common.dashboard, path: ROUTES.DASHBOARD, code: 'DB' },
    { label: copy.common.profile, path: profilePath, code: 'PF' },
    { label: copy.common.premium, path: ROUTES.PREMIUM, code: 'PR' },
    { label: 'Lobby', path: ROUTES.LOBBY, code: 'LB' },
    { label: 'Karma', path: ROUTES.KARMA_PREVIEW, code: 'KM' },
    { label: copy.layout.nav.vault, path: ROUTES.VAULT, code: 'VT' },
    { label: 'Carteira', path: ROUTES.WALLET, code: 'WL' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.HOME);
  };

  const getNickname = () => {
    if (profile?.nickname) return profile.nickname;
    if (user?.email) return user.email.split('@')[0];
    return copy.common.playerFallback;
  };

  const getInitials = () => getNickname().slice(0, 2).toUpperCase();

  const getRank = () => {
    const gameProfile = profile?.game_profile as PlayerGameProfile | undefined;
    const mainGame = gameProfile?.mainGame || gameProfile?.main_game;
    const rank = gameProfile?.currentRank || gameProfile?.rank;
    return mainGame && rank ? `${mainGame.toUpperCase()} • ${rank.toUpperCase()}` : copy.layout.profileSetup;
  };

  return (
    <div className="dl-grid-bg flex min-h-screen flex-col md:flex-row">
      <div className="relative z-20 border-b border-white/[0.08] bg-[rgba(18,21,21,0.94)] shadow-[0_18px_42px_rgba(0,0,0,.24)] backdrop-blur-xl md:hidden">
        <header className="flex items-center justify-between gap-3 px-3 py-3">
          <Link to={ROUTES.HOME} className="dl-brand">
            <Logo compact subtitle={copy.common.dashboard} />
          </Link>
          <div className="flex items-center gap-2">
            {wallet && (
              <Link to={ROUTES.WALLET} className="flex items-center gap-1.5 rounded-full border border-[var(--dl-warning)]/25 bg-[var(--dl-warning)]/10 px-2.5 py-1 font-mono text-[11px] font-bold text-[var(--dl-warning)] no-underline shadow-[0_0_16px_rgba(255,209,102,.08)]">
                <img src={duoCoinIcon16} alt="DC" className="h-4 w-4" />
                <span>{new Intl.NumberFormat('pt-BR').format(wallet.available_balance)} DC</span>
              </Link>
            )}
            <LanguageSwitcher />
            <Button variant="secondary" size="sm" onClick={() => navigate(profilePath)}>{copy.common.profile}</Button>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              {copy.common.logout}
            </Button>
          </div>
        </header>

        <nav className="grid grid-cols-2 gap-2 px-3 pb-3">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="no-underline">
              {({ isActive }) => (
                <span className={`inline-flex min-h-9 w-full items-center justify-center rounded-full border px-3.5 text-[0.68rem] font-black uppercase tracking-[0.12em] transition ${isActive ? 'border-[var(--dl-number)] bg-[rgba(13,240,255,.12)] text-[var(--dl-number)] shadow-[0_0_18px_rgba(13,240,255,.12)]' : 'border-white/[0.08] bg-white/[0.04] text-white hover:border-[var(--dl-number)]/30 hover:bg-white/[0.06]'}`}>
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <aside className="relative z-20 hidden w-80 shrink-0 flex-col border-r border-white/[0.08] bg-[linear-gradient(180deg,rgba(20,23,24,.94),rgba(17,19,19,.88))] p-4 shadow-[24px_0_70px_rgba(0,0,0,.22)] backdrop-blur-xl md:flex">
        <div className="border-b border-white/[0.08] pb-5">
          <Link to={ROUTES.HOME} className="dl-brand">
            <Logo subtitle={copy.layout.playerHub} />
          </Link>
          <div className="dl-status-chip mt-5 px-3 py-1.5">
            Player hub online
          </div>
        </div>

        <nav className="flex-1 space-y-2 py-5">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="block no-underline">
              {({ isActive }) => (
                <div className={`group flex items-center gap-3 rounded-[1.15rem] border px-4 py-3 transition duration-200 ${isActive ? 'border-[var(--dl-number)]/40 bg-[rgba(13,240,255,.10)] text-white shadow-[0_0_24px_rgba(13,240,255,.10)]' : 'border-transparent bg-transparent text-[var(--dl-muted-light)] hover:border-white/[0.08] hover:bg-white/[0.045] hover:text-white'}`}>
                  <span className={`grid h-10 w-10 place-items-center rounded-[0.95rem] border text-[0.74rem] font-black uppercase tracking-[0.12em] transition ${isActive ? 'border-[var(--dl-number)]/40 bg-[rgba(13,240,255,.12)] text-[var(--dl-number)]' : 'border-white/[0.08] bg-white/[0.04] text-[var(--dl-muted-light)] group-hover:text-white'}`}>
                    {item.code}
                  </span>
                  <span className="font-black uppercase tracking-[0.1em]">{item.label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <Card variant="elevated" className="dl-glass space-y-4 rounded-[1.4rem] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-[1rem] border border-[var(--dl-number)]/35 bg-[rgba(13,240,255,.10)] font-mono text-lg font-black uppercase text-[var(--dl-number)] shadow-[0_0_22px_rgba(13,240,255,.12)]">
              {getInitials()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-black uppercase tracking-[-0.02em] text-white">{getNickname()}</p>
              <p className="truncate text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                {profile?.is_premium ? copy.common.premium : copy.common.standard}
              </p>
            </div>
          </div>

          <div className="rounded-[1rem] border border-white/[0.08] bg-black/20 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--dl-muted-light)]">
            {getRank()}
          </div>

          {wallet && (
            <Link to={ROUTES.WALLET} className="flex items-center justify-between rounded-[1rem] border border-[var(--dl-warning)]/25 bg-[var(--dl-warning)]/5 px-4 py-3 no-underline transition hover:border-[var(--dl-warning)]/40 hover:bg-[var(--dl-warning)]/10">
              <div className="flex items-center gap-2">
                <img src={duoCoinIcon32} alt="DC" className="h-6 w-6 shrink-0 drop-shadow-[0_0_6px_rgba(255,209,102,0.4)]" />
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--dl-muted-light)]">DuoCoins</span>
              </div>
              <strong className="font-mono text-sm font-bold text-[var(--dl-warning)]">
                {new Intl.NumberFormat('pt-BR').format(wallet.available_balance)} DC
              </strong>
            </Link>
          )}

          <LanguageSwitcher fullWidth />
          <Button fullWidth variant="secondary" size="sm" onClick={() => navigate(profilePath)}>{copy.common.profile}</Button>
          <Button fullWidth variant="secondary" size="sm" onClick={() => navigate(ROUTES.ONBOARDING)}>{copy.common.editProfile}</Button>
          <Button fullWidth variant="danger" size="sm" onClick={handleLogout}>
            {copy.common.endSession}
          </Button>
        </Card>
      </aside>

      <main className="relative flex-1 overflow-auto">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(13,240,255,.08),transparent_72%)]" />
        <div className="relative z-[1] h-full p-3 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
