import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { Winner } from '@/components/organisms/WinnersList';
import {
  DuolootBadge,
  DuolootButton,
  DuolootCard,
  DuolootImagePlaceholder,
  DuolootSectionTitle,
} from '@/components/duoloot';
import { ASSETS } from '@/constants/assets';
import { ROUTES } from '@/constants/routes';
import type { Event } from '@/schemas/event.schema';

export interface HomeTemplateProps {
  activeEvent: Event | null;
  recentWinners: Winner[];
  isLoading: boolean;
  isError: boolean;
}

export const HomeTemplate = ({ activeEvent, recentWinners }: HomeTemplateProps) => {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Trusted by Gamers', value: '100K+', icon: ASSETS.icons.trustScore },
    { label: 'Successful Matches', value: '2M+', icon: ASSETS.icons.matchmaking },
    { label: 'Rewards Claimed', value: '500K+', icon: ASSETS.icons.lootReward },
    { label: 'Always Secure', value: '100%', icon: ASSETS.icons.vaultKey },
  ];

  const features = [
    {
      title: 'Smart Matchmaking',
      text: 'Perfil, estilo, rank e objetivos se cruzam para sugerir o duo certo com menos ruido.',
      icon: ASSETS.icons.matchmakingTrustThumb,
    },
    {
      title: 'Lobby Finder',
      text: 'Descubra squads ao vivo, analise compatibilidade e entre no lobby certo no momento certo.',
      icon: ASSETS.icons.lobbyFinderThumb,
    },
    {
      title: 'Loot Rewards',
      text: 'Missoes, chaves e o Vault transformam partidas em progresso real dentro do ecossistema.',
      icon: ASSETS.rewards.lootBoxSmallThumb,
    },
    {
      title: 'Trust Score',
      text: 'Reputacao, historico e comportamento ficam visiveis antes de formar duo ou squad.',
      icon: ASSETS.icons.trustScore,
    },
    {
      title: 'Ranking',
      text: 'Eventos ranqueiam operadores, destacam top players e deixam a competicao mais clara.',
      icon: ASSETS.icons.ranking,
    },
    {
      title: 'Missoes',
      text: 'Objetivos semanais mantem a rotina competitiva com progresso, chaves e recompensas.',
      icon: ASSETS.icons.mission,
    },
  ];

  const heroHighlights = [
    { eyebrow: 'Match signal', title: 'Smart duo routing', icon: ASSETS.icons.matchmaking },
    { eyebrow: 'Community', title: 'Squads and chat live', icon: ASSETS.icons.squad },
    { eyebrow: 'Security', title: 'Trusted profiles and rewards', icon: ASSETS.icons.trustScore },
  ];

  const vaultChips = [
    { label: 'Missions', icon: ASSETS.icons.mission },
    { label: 'Ranking', icon: ASSETS.icons.ranking },
    { label: 'Vault Key', icon: ASSETS.icons.vaultKey },
  ];

  const recommendedLobbyPoints = [
    { label: 'Live player availability', icon: ASSETS.icons.squad },
    { label: 'Balanced teams & fair matches', icon: ASSETS.icons.trustScore },
    { label: 'Lobby finder signals', icon: ASSETS.icons.lobby },
  ];

  const winnersCount = recentWinners.length > 0 ? `${recentWinners.length}+` : '3+';
  const vaultTitle = activeEvent?.title || 'Complete Missions. Unlock the Vault.';

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-14 pt-4 md:px-6 md:pt-6">
      <section className="dl-panel overflow-hidden px-5 py-6 md:px-8 md:py-9">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="space-y-6">
            <DuolootBadge variant="accent">Play together. Earn together.</DuolootBadge>

            <div className="space-y-4">
              <h1 className="font-['Rajdhani'] text-[clamp(2.7rem,7vw,5.75rem)] font-bold uppercase leading-[0.88] text-white">
                Find your duo. Win together. Earn epic loot.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--dl-muted-light)]">
                Duoloot conecta jogadores, melhora lobbies e recompensa a comunidade com missoes, progresso e loot dentro do Vault.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <DuolootButton size="lg" onClick={() => navigate(ROUTES.REGISTER)}>
                Get Duoloot
              </DuolootButton>
              <DuolootButton variant="secondary" size="lg" onClick={() => navigate(ROUTES.LOBBY)}>
                <Play className="h-4 w-4" aria-hidden="true" />
                Ver lobbies
              </DuolootButton>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-[var(--dl-border)] bg-white/[0.03] p-4">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Vault live</p>
                <p className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">{winnersCount}</p>
                <p className="mt-1 text-sm text-[var(--dl-muted-light)]">winners recently rewarded</p>
              </div>
              <div className="rounded-[1.35rem] border border-[var(--dl-border)] bg-white/[0.03] p-4">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Current focus</p>
                <p className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">Lobby + Vault</p>
                <p className="mt-1 text-sm text-[var(--dl-muted-light)]">match faster, progress harder</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.8rem] border border-[var(--dl-border-red)] bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.18),rgba(255,255,255,0.04)_48%,rgba(8,10,14,0.98))] p-5 shadow-[0_28px_65px_rgba(255,0,0,0.16)]">
            <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1.4rem] border border-[var(--dl-border)] bg-black/25 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Red Vault</p>
                    <p className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">Operational rewards hub</p>
                  </div>
                  <img src={ASSETS.logo.mark} alt="" aria-hidden="true" className="h-12 w-12 opacity-90" />
                </div>
                <DuolootImagePlaceholder
                  label="Duo Loot hero visual"
                  src={ASSETS.vault.openRewards}
                  alt="Cofre aberto do Duo Loot com recompensas"
                  className="min-h-[250px]"
                  imageClassName="p-4 md:p-6"
                  loading="eager"
                />
              </div>

              <div className="grid gap-4">
                {heroHighlights.map(({ eyebrow, title, icon }) => (
                  <div key={title} className="flex items-center gap-4 rounded-[1.35rem] border border-[var(--dl-border)] bg-white/[0.04] p-4">
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.04]">
                      <img src={icon} alt="" aria-hidden="true" className="h-20 w-20 object-contain" />
                    </div>
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">{eyebrow}</p>
                      <p className="mt-1 font-['Rajdhani'] text-2xl font-bold uppercase text-white">{title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="relative overflow-hidden rounded-[1.35rem] border border-[var(--dl-border)] bg-white/[0.03] p-5 min-h-[120px]">
            <img src={metric.icon} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute right-4 bottom-4 h-24 w-24 object-contain opacity-85 pointer-events-none" />
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">{metric.label}</p>
            <p className="mt-3 font-['Rajdhani'] text-4xl font-bold uppercase text-[var(--dl-text)]">{metric.value}</p>
          </div>
        ))}
      </section>

      <section id="features" className="dl-panel px-5 py-6 md:px-8 md:py-8">
        <DuolootSectionTitle
          eyebrow="Features"
          title="Competitive matchmaking, cleaner squads, stronger rewards."
          subtitle="A experiencia Red Vault organiza descoberta, decisao e recompensa em um fluxo unico."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ title, text, icon }) => (
            <DuolootCard key={title} variant="interactive" className="space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.04]">
                <img src={icon} alt="" aria-hidden="true" loading="lazy" decoding="async" className="h-20 w-20 object-contain" />
              </div>
              <h3 className="font-['Rajdhani'] text-2xl font-bold uppercase text-white">{title}</h3>
              <p className="text-sm leading-7 text-[var(--dl-muted-light)]">{text}</p>
            </DuolootCard>
          ))}
        </div>
      </section>

      <section id="vault" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <DuolootCard variant="interactive" className="space-y-6">
          <DuolootSectionTitle
            eyebrow="Vault"
            title={vaultTitle}
            subtitle="Aceite missoes, ganhe chaves do Vault e desbloqueie recompensas premium que acompanham sua rotina competitiva."
          />
          <div className="flex flex-wrap gap-3">
            <DuolootButton onClick={() => navigate(ROUTES.VAULT)}>Explore Vault</DuolootButton>
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="grid gap-4">
              <DuolootImagePlaceholder
                label="Vault reward image"
                src={ASSETS.vault.openRewards}
                alt="Cofre aberto com recompensas do Duo Loot"
                className="min-h-[240px]"
                imageClassName="p-4 md:p-5"
              />
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                {vaultChips.map(({ label, icon }) => (
                  <div key={label} className="flex items-center gap-3 rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.03] px-4 py-3">
                    <img src={icon} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
                    <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-[var(--dl-border)] bg-white/[0.03] p-5">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">How it works</p>
              <ol className="mt-4 space-y-4 text-sm text-[var(--dl-muted-light)]">
                <li><span className="font-semibold text-white">1.</span> Accept Missions</li>
                <li><span className="font-semibold text-white">2.</span> Earn Vault Keys</li>
                <li><span className="font-semibold text-white">3.</span> Unlock Rewards</li>
              </ol>
            </div>
          </div>
        </DuolootCard>

        <DuolootCard variant="accent" className="space-y-6">
          <DuolootSectionTitle
            eyebrow="Recommended Lobby"
            title="The right players. Right when you need them."
            subtitle="Disponibilidade ao vivo, equilibrio de time e melhor conexao para entrar sem perder tempo."
          />
          <ul className="space-y-3 text-sm text-[var(--dl-muted-light)]">
            {recommendedLobbyPoints.map(({ label, icon }) => (
              <li key={label} className="flex items-center gap-3 rounded-[1rem] border border-[var(--dl-border)] bg-black/20 px-4 py-3">
                <img src={icon} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-[1.35rem] border border-[var(--dl-border)] bg-black/20 p-5">
            <div className="mb-4 flex justify-center">
              <img
                src={ASSETS.icons.lobbyFinderThumb}
                alt="Icone de busca de lobby"
                loading="lazy"
                decoding="async"
                className="h-24 w-24 object-contain drop-shadow-[0_0_24px_rgba(255,0,0,0.2)]"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-['Rajdhani'] text-2xl font-bold uppercase text-white">Lobby recomendado</p>
                <p className="mt-1 text-sm text-[var(--dl-muted-light)]">Valorant • Diamond+ • Sao Paulo</p>
              </div>
              <DuolootBadge variant="accent">92% match</DuolootBadge>
            </div>
            <div className="mt-5 space-y-3 text-sm text-[var(--dl-muted-light)]">
              <div className="flex items-center justify-between rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.03] px-4 py-3">
                <span>Nyra#777</span>
                <span>Controller</span>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.03] px-4 py-3">
                <span>Vexon#101</span>
                <span>Duelist</span>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.03] px-4 py-3">
                <span>Locke#515</span>
                <span>Initiator</span>
              </div>
            </div>
            <DuolootButton className="mt-5 w-full" onClick={() => navigate(ROUTES.LOBBY)}>
              Join Lobby
            </DuolootButton>
          </div>
        </DuolootCard>
      </section>

      <section className="dl-panel px-5 py-8 text-center md:px-8 md:py-10">
        <DuolootSectionTitle
          align="center"
          eyebrow="Final CTA"
          title="Squad up. Play hard. Get rewarded."
          subtitle="Entre no ecossistema Red Vault e transforme matchmaking, lobby e recompensa em um fluxo so."
        />
        <DuolootButton className="mt-8" size="lg" onClick={() => navigate(ROUTES.REGISTER)}>
          Get Duoloot
        </DuolootButton>
      </section>
    </div>
  );
};
