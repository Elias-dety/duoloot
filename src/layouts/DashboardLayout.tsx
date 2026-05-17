import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '@/features/auth/useAuth';
import { usePlayerPresence } from '@/hooks/usePlayerPresence';

export default function DashboardLayout() {
  const { profile, user, signOut } = useAuth();
  usePlayerPresence(); // Inicializa a presença online tática do operador no terminal
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, code: 'CMD' },
    { label: 'Premium', path: ROUTES.PREMIUM, code: 'PRE' },
    { label: 'Lobby', path: ROUTES.LOBBY, code: 'LBR' },
    { label: 'Cofre', path: ROUTES.VAULT, code: 'VLT' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.HOME);
  };

  const getOperatorNickname = () => {
    if (profile?.nickname) return profile.nickname;
    if (user?.email) return user.email.split('@')[0];
    return 'Operador';
  };

  const getOperatorInitials = () => {
    const nick = getOperatorNickname();
    return nick.slice(0, 2).toUpperCase();
  };

  const getOperatorRank = () => {
    const gameProfile = profile?.game_profile;
    if (gameProfile && gameProfile.main_game && gameProfile.rank) {
      return `${gameProfile.main_game.toUpperCase()} // ${gameProfile.rank.toUpperCase()}`;
    }
    return 'SEM PERFIL GAMER';
  };

  return (
    <div className="dl-scanlines flex min-h-screen flex-col md:flex-row" style={{ background: 'var(--dl-tactical-bg)' }}>
      {/* Mobile Header */}
      <header className="flex h-14 items-center justify-between border-b border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-panel)] backdrop-blur-[10px] px-4 md:hidden">
        <Link to={ROUTES.HOME} className="dl-brand no-underline text-[18px]">
          <span className="dl-brand-mark" style={{ width: 32, height: 32, fontSize: 12 }}>DL</span>
          <span>Duo Loot</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to={ROUTES.ONBOARDING} className="dl-btn text-[10px] font-bold tracking-wider font-[Chakra_Petch] uppercase no-underline">
            Perfil
          </Link>
          <button type="button" onClick={handleLogout} className="dl-btn text-[10px] font-bold tracking-wider font-[Chakra_Petch] uppercase">
            Sair
          </button>
        </div>
      </header>

      {/* Sidebar Painel de Comando */}
      <aside className="hidden w-64 flex-col border-r border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-panel)] backdrop-blur-[10px] md:flex">
        {/* Brand */}
        <div className="flex h-16 items-center border-b border-[var(--dl-tactical-line)] px-5">
          <Link to={ROUTES.HOME} className="dl-brand no-underline text-[20px]">
            <span className="dl-brand-mark" style={{ width: 36, height: 36, fontSize: 13 }}>DL</span>
            <span>
              Duo Loot
              <small>Command Panel</small>
            </span>
          </Link>
        </div>

        {/* System Label */}
        <div className="px-5 py-3 border-b border-[var(--dl-tactical-line)]">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--dl-tactical-muted)]">
            Painel do jogador // Acesso interno
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-[12px] font-bold uppercase tracking-[0.08em] transition-all [clip-path:var(--dl-cut-button)] ${
                  isActive
                    ? 'bg-[rgba(255,226,102,0.08)] text-[var(--dl-tactical-yellow)] border border-[rgba(255,226,102,0.3)]'
                    : 'text-[var(--dl-tactical-muted)] border border-transparent hover:text-[var(--dl-tactical-green)] hover:bg-[rgba(56,242,139,0.08)] hover:border-[rgba(56,242,139,0.28)]'
                }`
              }
            >
              <span className="w-8 h-8 grid place-items-center border border-[var(--dl-tactical-line)] bg-[rgba(255,255,255,0.04)] [clip-path:var(--dl-cut-button)] text-[10px] shrink-0">
                {item.code}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Player Card */}
        <div className="border-t border-[var(--dl-tactical-line)] p-4 space-y-3">
          <div className="flex items-center gap-3 p-3 border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] [clip-path:var(--dl-cut-card)]">
            <div className="w-10 h-10 grid place-items-center bg-[rgba(255,226,102,0.1)] border border-[rgba(255,226,102,0.3)] [clip-path:var(--dl-cut-button)] text-[var(--dl-tactical-yellow)] font-bold text-[13px] shrink-0 font-[Chakra_Petch]">
              {getOperatorInitials()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-[13px] font-bold text-[var(--dl-tactical-text)] lowercase font-[Chakra_Petch] mb-0.5">
                {getOperatorNickname()}
              </p>
              <p className="truncate text-[9px] uppercase tracking-[0.12em] text-[var(--dl-tactical-muted)]">
                Nível 1 // {profile?.is_premium ? 'PREMIUM' : 'OPERADOR'}
              </p>
              {profile?.game_profile && (
                <p className="truncate text-[9.5px] font-bold tracking-[0.12em] text-[var(--dl-tactical-green)] uppercase mt-1 font-mono">
                  {getOperatorRank()}
                </p>
              )}
            </div>
          </div>
          
          <Link
            to={ROUTES.ONBOARDING}
            className="w-full py-1.5 border border-[rgba(56,242,139,0.3)] bg-[rgba(56,242,139,0.04)] hover:bg-[rgba(56,242,139,0.1)] text-[var(--dl-tactical-green)] text-[10px] font-bold uppercase tracking-widest font-[Chakra_Petch] transition-all [clip-path:var(--dl-cut-button)] text-center no-underline block"
          >
            EDITAR PERFIL GAMER
          </Link>

          <button 
            type="button" 
            onClick={handleLogout}
            className="w-full py-1.5 border border-[var(--dl-tactical-line)] hover:border-[var(--dl-tactical-red)]/50 hover:bg-[var(--dl-tactical-red)]/5 hover:text-[var(--dl-tactical-red)] text-[var(--dl-tactical-muted)] text-[10px] font-bold uppercase tracking-widest font-[Chakra_Petch] transition-all [clip-path:var(--dl-cut-button)]"
          >
            DESCONECTAR TERMINAL
          </button>
        </div>
      </aside>

      {/* Área Principal - Console Interno */}
      <main className="flex-1 overflow-auto relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,242,139,0.06),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(141,92,255,0.05),transparent_40%)]" />
        <div className="relative z-[2] h-full p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
