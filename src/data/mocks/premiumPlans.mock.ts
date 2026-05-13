import { PremiumPlan } from '@/schemas/premiumPlan.schema';

export const mockPremiumPlans: PremiumPlan[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    tier: 'free',
    name: 'Free',
    tagline: 'Entrada sem custo',
    description:
      'Para quem quer testar o ecossistema, entrar no lobby e acompanhar os eventos do cofre.',
    price: 0,
    billingPeriod: 'monthly',
    ctaLabel: 'Continuar no Free',
    benefits: [
      'Acesso basico ao lobby e aos perfis',
      'Participacao nos cofres ativos',
      'Busca inicial por coaches',
    ],
    features: [
      { name: 'Acesso aos Cofres', included: true },
      { name: 'Multiplicador de Ganhos', included: false },
      { name: 'Destaque no Lobby', included: false },
      { name: 'Prioridade na Fila', included: false },
      { name: 'Acesso a Coaches', included: 'Limitado' },
      { name: 'Suporte VIP', included: false },
    ],
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    tier: 'premium',
    name: 'Premium',
    tagline: 'Foco total em progressao',
    description:
      'Para quem quer ganhar mais no cofre, aparecer primeiro no lobby e abrir a camada premium de coaches.',
    price: 29.9,
    billingPeriod: 'monthly',
    isPopular: true,
    ctaLabel: 'Assinar Duo Loot Premium',
    benefits: [
      'Multiplicador ativo de recompensas',
      'Mais visibilidade no matchmaking',
      'Acesso completo a coaches premium',
      'Prioridade em filas e suporte',
    ],
    features: [
      { name: 'Acesso aos Cofres', included: true },
      { name: 'Multiplicador de Ganhos', included: true, description: 'Ate 2x mais recompensas' },
      { name: 'Destaque no Lobby', included: true, description: 'Borda e badge premium' },
      { name: 'Prioridade na Fila', included: true },
      { name: 'Acesso a Coaches', included: 'Acesso Total' },
      { name: 'Suporte VIP', included: true },
    ],
  },
];
