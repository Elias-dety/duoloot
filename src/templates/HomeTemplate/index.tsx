import { HeroSection } from '@/components/organisms/HeroSection';
import { VaultEventSection } from '@/components/organisms/VaultEventSection';
import { WinnersList, Winner } from '@/components/organisms/WinnersList';
import { Button, SectionTitle, Badge, StatValue } from '@/components/atoms';
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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-24 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero */}
      <HeroSection />

      {/* Destaque do Cofre */}
      <section className="px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <SectionTitle 
            title="Cofre da Semana" 
            subtitle="Jogue, pontue e dispute uma fatia do prêmio comunitário." 
          />
          <Button variant="ghost" onClick={() => navigate(ROUTES.VAULT)}>
            Ver detalhes do cofre →
          </Button>
        </div>

        {isLoading ? (
          <div className="h-[200px] w-full bg-surface-dark/50 border border-surface-highlight rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isError || !activeEvent ? (
          <div className="p-8 text-center bg-surface-dark border border-surface-highlight rounded-xl">
            <span className="text-red-400 font-bold">Erro ao carregar o evento ativo.</span>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-surface-dark border border-brand-primary/20 p-1">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 bg-surface-base rounded-xl p-6 md:p-8">
              <VaultEventSection 
                title={activeEvent.title}
                prizeAmount={activeEvent.prizePool}
                currency={activeEvent.prizeCurrency}
                endsAt={new Date(activeEvent.endsAt || new Date().toISOString())}
                currentValue={activeEvent.totalParticipants * 15} 
                targetValue={100000}
                status={activeEvent.status as any}
              />
            </div>
          </div>
        )}
      </section>

      {/* Destaque Lobby */}
      <section className="px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="premium">O Matchmaking Perfeito</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-content-primary uppercase tracking-tight">
              Ache seu Duo. <br/> Feche o Squad.
            </h2>
            <p className="text-content-secondary text-lg">
              Chega de cair com trolls. Nosso sistema de Trust Score garante que você jogue com players que levam o jogo a sério. Filtre por rank, estilo de jogo e compatibilidade.
            </p>
            <ul className="space-y-3 pb-4">
              <li className="flex items-center gap-3 text-content-primary font-medium">
                <span className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center text-sm font-bold shrink-0">✓</span>
                Trust Score visível em todos os perfis
              </li>
              <li className="flex items-center gap-3 text-content-primary font-medium">
                <span className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center text-sm font-bold shrink-0">✓</span>
                Filtros estritos de Rank e Elo
              </li>
              <li className="flex items-center gap-3 text-content-primary font-medium">
                <span className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center text-sm font-bold shrink-0">✓</span>
                Análise de Compatibilidade (Agentes / Roles)
              </li>
            </ul>
            <Button variant="primary" size="lg" className="w-full sm:w-auto uppercase font-bold" onClick={() => navigate(ROUTES.LOBBY)}>
              Buscar Lobbies
            </Button>
          </div>
          
          {/* Ilustração/Preview do Card de Lobby */}
          <div className="relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full opacity-30 transform -translate-x-10 translate-y-10" />
            <div className="relative bg-surface-dark border border-surface-highlight p-6 rounded-2xl shadow-xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500 max-w-sm mx-auto">
              <div className="flex justify-between items-start border-b border-surface-highlight pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-highlight border-2 border-brand-primary overflow-hidden shrink-0">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg leading-tight">Fnx_Pro</h4>
                    <span className="text-xs text-brand-primary uppercase font-bold tracking-wider">Radiante</span>
                  </div>
                </div>
                <Badge variant="success">Trust: 98/100</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatValue label="Modo" value="Competitivo" />
                <StatValue label="Vagas" value="2/5" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-content-secondary font-medium">Compatibilidade</span>
                  <span className="text-success font-bold">92%</span>
                </div>
                <div className="h-2 w-full bg-surface-base rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[92%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social (Winners) */}
      <section className="px-4 md:px-0">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="default" className="mb-4">Eles já ganharam</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-content-primary uppercase tracking-tight mb-4">
            A Comunidade Está Faturando
          </h2>
          <p className="text-content-secondary text-lg">
            Confira os vencedores dos cofres anteriores. Jogue as missões, feche grupos e seja o próximo a aparecer aqui.
          </p>
        </div>

        {isLoading ? (
          <div className="h-[200px] w-full bg-surface-dark/50 border border-surface-highlight rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-surface-dark border border-surface-highlight p-6 md:p-8 rounded-2xl max-w-3xl mx-auto">
            <WinnersList winners={recentWinners} isLoading={false} />
          </div>
        )}
      </section>
      
      {/* Footer CTA */}
      <section className="px-4 md:px-0 mb-12">
        <div className="w-full bg-surface-dark border border-surface-highlight rounded-2xl p-8 md:p-12 text-center flex flex-col items-center">
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            Sua vez de jogar com os melhores
          </h2>
          <p className="text-content-secondary mb-8 max-w-lg">
            Crie sua conta gratuitamente, preencha seu perfil e comece a disputar as missões hoje mesmo.
          </p>
          <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold uppercase tracking-wider px-10 py-4">
            Criar Conta Grátis
          </Button>
        </div>
      </section>
    </div>
  );
};
