import { HeroSection } from '@/components/organisms/HeroSection';
import { VaultEventSection } from '@/components/organisms/VaultEventSection';
import { WinnersList, Winner } from '@/components/organisms/WinnersList';
import { Button, Card, SectionTitle, Badge, StatValue } from '@/components/atoms';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import type { Event } from '@/schemas/event.schema';

export interface HomeTemplateProps {
  activeEvent: Event | null;
  recentWinners: Winner[];
  isLoading: boolean;
  isError: boolean;
}

export const HomeTemplate = ({ activeEvent, recentWinners, isLoading, isError }: HomeTemplateProps) => {
  const navigate = useNavigate();
  const eventStatus =
    activeEvent?.status === 'ended' ? 'completed' : activeEvent?.status === 'scheduled' ? 'upcoming' : 'active';

  return (
    <div className="mx-auto w-full max-w-7xl space-y-24 pb-20 animate-fade-in">
      <HeroSection />

      <section className="px-4 md:px-0">
        <div className="mb-8 flex flex-col items-end justify-between gap-4 md:flex-row">
          <SectionTitle title="Cofre da Semana" subtitle="Jogue, pontue e dispute uma fatia do premio comunitario." />
          <Button variant="ghost" onClick={() => navigate(ROUTES.VAULT)}>
            Ver detalhes do cofre -&gt;
          </Button>
        </div>

        {isLoading ? (
          <Card variant="elevated" className="flex h-[200px] w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
          </Card>
        ) : isError || !activeEvent ? (
          <Card variant="danger" className="p-8 text-center">
            <span className="font-bold text-danger">Erro ao carregar o evento ativo.</span>
          </Card>
        ) : (
          <VaultEventSection
            title={activeEvent.title}
            prizeAmount={activeEvent.prizePool}
            currency={activeEvent.prizeCurrency}
            endsAt={new Date(activeEvent.endsAt || new Date().toISOString())}
            currentValue={activeEvent.totalParticipants * 15}
            targetValue={100000}
            status={eventStatus}
          />
        )}
      </section>

      <section className="px-4 md:px-0">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge variant="premium">O Matchmaking Perfeito</Badge>
            <h2 className="text-3xl font-black uppercase tracking-tight text-content-primary md:text-5xl">
              Ache seu Duo. <br /> Feche o Squad.
            </h2>
            <p className="text-lg text-content-secondary">
              Chega de cair com trolls. Nosso sistema de Trust Score garante que voce jogue com players que
              levam o jogo a serio. Filtre por rank, estilo de jogo e compatibilidade.
            </p>
            <ul className="space-y-3 pb-4">
              <li className="flex items-center gap-3 font-medium text-content-primary">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20 text-sm font-bold text-success">
                  OK
                </span>
                Trust Score visivel em todos os perfis
              </li>
              <li className="flex items-center gap-3 font-medium text-content-primary">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20 text-sm font-bold text-success">
                  OK
                </span>
                Filtros estritos de Rank e Elo
              </li>
              <li className="flex items-center gap-3 font-medium text-content-primary">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20 text-sm font-bold text-success">
                  OK
                </span>
                Analise de Compatibilidade por roles
              </li>
            </ul>
            <Button variant="primary" size="lg" className="w-full font-bold uppercase sm:w-auto" onClick={() => navigate(ROUTES.LOBBY)}>
              Buscar Lobbies
            </Button>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="absolute inset-0 translate-y-10 -translate-x-10 rounded-full bg-brand-primary/20 opacity-30 blur-3xl" />
            <Card variant="interactive" className="relative mx-auto max-w-sm">
              <div className="mb-4 flex items-start justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-brand-primary bg-surface-hover"></div>
                  <div>
                    <h4 className="text-lg font-bold leading-tight text-content-base">Fnx_Pro</h4>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Radiante</span>
                  </div>
                </div>
                <Badge variant="success">Trust: 98/100</Badge>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <StatValue label="Modo" value="Competitivo" />
                <StatValue label="Vagas" value="2/5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-content-secondary">Compatibilidade</span>
                  <span className="font-bold text-success">92%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-hover">
                  <div className="h-full w-[92%] rounded-full bg-success" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-0">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="default" className="mb-4">
            Eles ja ganharam
          </Badge>
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-content-primary md:text-4xl">
            A Comunidade Esta Faturando
          </h2>
          <p className="text-lg text-content-secondary">
            Confira os vencedores dos cofres anteriores. Jogue as missoes, feche grupos e seja o proximo a
            aparecer aqui.
          </p>
        </div>

        {isLoading ? (
          <Card variant="elevated" className="flex h-[200px] w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
          </Card>
        ) : (
          <div className="mx-auto max-w-3xl">
            <WinnersList winners={recentWinners} isLoading={false} />
          </div>
        )}
      </section>

      <section className="mb-12 px-4 md:px-0">
        <Card variant="default" className="flex w-full flex-col items-center text-center md:p-12">
          <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-content-base md:text-4xl">
            Sua vez de jogar com os melhores
          </h2>
          <p className="mb-8 max-w-lg text-content-secondary">
            Crie sua conta gratuitamente, preencha seu perfil e comece a disputar as missoes hoje mesmo.
          </p>
          <Button variant="primary" size="lg" className="w-full px-10 py-4 font-bold uppercase tracking-wider sm:w-auto">
            Criar Conta Gratis
          </Button>
        </Card>
      </section>
    </div>
  );
};
