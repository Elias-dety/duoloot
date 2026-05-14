import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import type { Event } from '@/schemas/event.schema';
import type { Winner } from '@/components/organisms/WinnersList';

export interface HomeTemplateProps {
  activeEvent: Event | null;
  recentWinners: Winner[];
  isLoading: boolean;
  isError: boolean;
}

const formatCurrency = (value: number, currency = 'R$') => {
  return `${currency} ${value.toLocaleString('pt-BR')}`;
};

export const HomeTemplate = ({ activeEvent, recentWinners, isLoading, isError }: HomeTemplateProps) => {
  const navigate = useNavigate();

  const vaultPrize = activeEvent?.prizePool ?? 2500;
  const vaultCurrency = activeEvent?.prizeCurrency ?? 'R$';
  const vaultTitle = activeEvent?.title ?? 'Cofre clandestino';
  const winnersCount = recentWinners.length || 3;

  const vaultProgress = useMemo(() => {
    if (!activeEvent?.totalParticipants) return 72;
    return Math.min(Math.round((activeEvent.totalParticipants / 1000) * 100), 100);
  }, [activeEvent?.totalParticipants]);

  return (
    <div className="mx-auto max-w-[1240px] px-3 md:px-6">
      {/* Hero Scanner */}
      <section
        id="scanner"
        className="relative z-[4] grid gap-[18px] py-4 md:py-8 lg:grid-cols-[minmax(0,1fr)_350px]"
      >
        <div className="dl-panel relative min-h-[492px] overflow-hidden p-[18px] md:p-[34px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,rgba(255,226,102,0.14),transparent_20rem),radial-gradient(circle_at_68%_96%,rgba(56,242,139,0.12),transparent_19rem),linear-gradient(120deg,transparent,rgba(255,255,255,0.035),transparent)]" />

          <div className="relative z-[2]">
            <div className="dl-hud-label mb-6">ALPHA Underground Loot Command</div>

            <h1 className="dl-title mb-5 max-w-[790px] text-[clamp(45px,7.2vw,88px)] leading-[0.86]">
              Escaneie jogadores. Feche contratos.{' '}
              <span className="text-[var(--dl-tactical-yellow)] drop-shadow-[0_0_30px_rgba(255,226,102,0.34)]">
                Abra o cofre.
              </span>
            </h1>

            <p className="dl-muted mb-7 max-w-[670px] text-[15px] leading-[1.65]">
              Uma central clandestina de estatísticas, lobbies e recompensas. Analise perfis, detecte risco de troll,
              encontre duos compatíveis e entre nos eventos do cofre antes que a janela feche.
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              <span className="dl-stamp dl-stamp-green">Verified player</span>
              <span className="dl-stamp dl-stamp-yellow">Cofre ativo</span>
              <span className="dl-stamp dl-stamp-red">Risco detectável</span>
            </div>

            <div className="max-w-[780px]">
              <div className="mb-2 flex justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-white/60 max-sm:flex-col max-sm:gap-1">
                <span>Scanner de alvo</span>
                <span>Nick // ID // Perfil</span>
              </div>

              <form className="dl-search-box" onSubmit={(event) => event.preventDefault()}>
                <div className="dl-search-icon">SRCH</div>
                <input className="dl-search-input" type="text" placeholder="Buscar estatísticas" />
                <button type="submit" className="dl-btn dl-btn-green h-[52px] px-6">
                  Escanear
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="dl-chip dl-chip-green">Trust Score</span>
                <span className="dl-chip dl-chip-blue">Histórico</span>
                <span className="dl-chip dl-chip-purple">Ranking elite</span>
                <span className="dl-chip dl-chip-yellow">Cofre</span>
                <span className="dl-chip">Compatibilidade</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="dl-panel relative grid gap-4 overflow-hidden p-[18px] md:p-[22px]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,226,102,0.10),transparent_35%),repeating-linear-gradient(45deg,rgba(255,255,255,0.025)_0_4px,transparent_4px_9px)]" />

          <div className="relative z-[2] flex items-start justify-between gap-3">
            <h2 className="font-['Rajdhani'] text-[34px] font-bold uppercase leading-[0.94]">{vaultTitle}</h2>
            <span className="dl-stamp dl-stamp-yellow">Ativo</span>
          </div>

          <div className="relative z-[2] grid h-[120px] place-items-center border border-[rgba(255,226,102,0.18)] bg-[rgba(5,8,11,0.52)] text-center font-['Rajdhani'] text-[44px] font-bold text-[var(--dl-tactical-yellow)] [clip-path:var(--dl-cut-card)] drop-shadow-[0_0_28px_rgba(255,226,102,0.36)]">
            {isLoading ? 'SYNC...' : isError ? 'OFFLINE' : formatCurrency(vaultPrize, vaultCurrency)}
          </div>

          <p className="dl-muted relative z-[2] text-[13px] leading-[1.5]">
            Prêmio acumulado por inscrições, metas da comunidade e contratos concluídos.
          </p>

          <div className="relative z-[2]">
            <div className="mb-2 flex justify-between text-[11px] font-bold uppercase text-[var(--dl-tactical-muted)]">
              <span>Meta para bônus</span>
              <span>{vaultProgress}%</span>
            </div>
            <div className="dl-progress">
              <span style={{ width: `${vaultProgress}%` }} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.VAULT)}
            className="dl-btn dl-btn-primary relative z-[2]"
          >
            Abrir cofre
          </button>
        </aside>
      </section>

      {/* Cards de Acesso */}
      <section className="relative z-[4] grid gap-4 pb-7 lg:grid-cols-4">
        <article className="dl-panel dl-access-card dl-card-green">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-['Rajdhani'] text-[27px] font-bold uppercase leading-[0.94]">Scanner</h3>
              <p className="dl-muted mt-2 text-[13px] leading-[1.48]">
                Analise Trust Score, K/D, win rate, consistência e histórico recente.
              </p>
            </div>
            <div className="dl-icon-box">SCN</div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[var(--dl-tactical-muted)]">
            <span>Ação principal</span>
            <b className="text-[var(--card-color)]">Buscar</b>
          </div>
        </article>

        <article className="dl-panel dl-access-card dl-card-blue">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-['Rajdhani'] text-[27px] font-bold uppercase leading-[0.94]">Lobby radar</h3>
              <p className="dl-muted mt-2 text-[13px] leading-[1.48]">
                Encontre squads por rank, função, horário, estilo e compatibilidade.
              </p>
            </div>
            <div className="dl-icon-box">LBR</div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[var(--dl-tactical-muted)]">
            <span>Lobbies ativos</span>
            <b className="text-[var(--card-color)]">247</b>
          </div>
        </article>

        <article className="dl-panel dl-access-card dl-card-yellow">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-['Rajdhani'] text-[27px] font-bold uppercase leading-[0.94]">Vault run</h3>
              <p className="dl-muted mt-2 text-[13px] leading-[1.48]">
                Entre nos desafios do cofre e dispute recompensas da comunidade.
              </p>
            </div>
            <div className="dl-icon-box">VLT</div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[var(--dl-tactical-muted)]">
            <span>Bônus atual</span>
            <b className="text-[var(--card-color)]">+10%</b>
          </div>
        </article>

        <article id="ranking" className="dl-panel dl-access-card dl-card-purple">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-['Rajdhani'] text-[27px] font-bold uppercase leading-[0.94]">Elite board</h3>
              <p className="dl-muted mt-2 text-[13px] leading-[1.48]">
                Veja jogadores em destaque, perfis valiosos e squads dominantes.
              </p>
            </div>
            <div className="dl-icon-box">ELT</div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[var(--dl-tactical-muted)]">
            <span>Ranking</span>
            <b className="text-[var(--card-color)]">Top 100</b>
          </div>
        </article>
      </section>

      {/* Contratos e Risco */}
      <section className="relative z-[4] grid gap-[18px] pb-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="dl-panel p-[18px] md:p-[22px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-['Rajdhani'] text-[29px] font-bold uppercase">Contratos recentes</h3>
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--dl-tactical-muted)]">
              Alvos analisados
            </span>
          </div>

          {[
            ['DETY_FPS', 'Trust 92', 'Duelista', 'Seguro', 'dl-good'],
            ['RUSH_KING', 'Trust 61', 'Entry', 'Médio', 'dl-mid'],
            ['TILT_MODE', 'Trust 28', 'Flex', 'Risco', 'dl-bad'],
          ].map(([name, trust, role, risk, tone]) => (
            <div
              key={name}
              className="mb-2 grid items-center gap-3 border border-[var(--dl-tactical-line)] bg-white/[0.025] p-3 text-[12px] font-bold text-[var(--dl-tactical-muted)] [clip-path:var(--dl-cut-button)] md:grid-cols-[1fr_78px_86px_92px]"
            >
              <b className="text-[var(--dl-tactical-text)]">{name}</b>
              <span className={tone}>{trust}</span>
              <span className="dl-info">{role}</span>
              <span className={tone}>{risk}</span>
            </div>
          ))}
        </div>

        <aside className="dl-panel dl-card-red p-[18px] md:p-[22px]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-['Rajdhani'] text-[29px] font-bold uppercase">Risco de lobby</h3>
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--dl-tactical-muted)]">
              Detecção ativa
            </span>
          </div>

          <span className="dl-stamp dl-stamp-red mb-4 inline-flex">Risco de tilt monitorado</span>

          <div className="grid gap-3">
            <div className="flex justify-between border border-[var(--dl-tactical-line)] bg-white/[0.035] p-3 text-[12px] font-bold uppercase text-[var(--dl-tactical-muted)] [clip-path:var(--dl-cut-button)]">
              <span>Abandono recente</span>
              <b className="dl-good">baixo</b>
            </div>

            <div className="flex justify-between border border-[var(--dl-tactical-line)] bg-white/[0.035] p-3 text-[12px] font-bold uppercase text-[var(--dl-tactical-muted)] [clip-path:var(--dl-cut-button)]">
              <span>Histórico tóxico</span>
              <b className="dl-mid">médio</b>
            </div>

            <div className="flex justify-between border border-[var(--dl-tactical-line)] bg-white/[0.035] p-3 text-[12px] font-bold uppercase text-[var(--dl-tactical-muted)] [clip-path:var(--dl-cut-button)]">
              <span>Compatibilidade</span>
              <b className="dl-good">alta</b>
            </div>

            <div className="flex justify-between border border-[var(--dl-tactical-line)] bg-white/[0.035] p-3 text-[12px] font-bold uppercase text-[var(--dl-tactical-muted)] [clip-path:var(--dl-cut-button)]">
              <span>Vencedores recentes</span>
              <b className="dl-info">{winnersCount}</b>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
