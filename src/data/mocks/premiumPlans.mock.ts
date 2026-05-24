import { PremiumPlan } from '@/schemas/premiumPlan.schema';

export const mockPremiumPlans: PremiumPlan[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    tier: 'free',
    slug: 'free',
    name: 'Free',
    tagline: 'Entrada sem custo',
    description: 'Para quem quer testar o ecossistema, entrar no lobby e acompanhar os eventos do cofre.',
    price: 0,
    billingPeriod: 'monthly',
    billingCycle: 'monthly',
    ctaLabel: 'Continuar no Free',
    benefits: [
      'Acesso básico ao lobby e aos perfis',
      'Participação nos cofres ativos',
      'Busca inicial por coaches'
    ],
    features: [
      { name: 'Acesso aos Cofres', included: true },
      { name: 'Multiplicador de Ganhos', included: false },
      { name: 'Destaque no Lobby', included: false },
      { name: 'Prioridade na Fila', included: false },
      { name: 'Acesso a Coaches', included: 'Limitado' },
      { name: 'Suporte VIP', included: false }
    ],
    limits: {
      matches_per_day: 5,
      lobby_highlights: false,
      priority_queue: false
    }
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    tier: 'plus',
    slug: 'plus',
    name: 'Plus',
    tagline: 'Matchmaking avançado',
    description: 'Perfeito para quem joga ativamente com duo e quer estatísticas mais completas de sua conta.',
    price: 14.9,
    billingPeriod: 'monthly',
    billingCycle: 'monthly',
    ctaLabel: 'Assinar Duo Loot Plus',
    benefits: [
      'Estatísticas básicas do Riot ID',
      'Matchmaking com prioridade média',
      'Acesso ilimitado ao Lobby'
    ],
    features: [
      { name: 'Acesso aos Cofres', included: true },
      { name: 'Multiplicador de Ganhos', included: true, description: 'Até 1.5x mais recompensas' },
      { name: 'Destaque no Lobby', included: false },
      { name: 'Prioridade na Fila', included: true },
      { name: 'Acesso a Coaches', included: 'Acesso Parcial' },
      { name: 'Suporte VIP', included: false }
    ],
    limits: {
      matches_per_day: 15,
      lobby_highlights: false,
      priority_queue: true
    }
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    tier: 'premium',
    slug: 'premium',
    name: 'Premium',
    tagline: 'Foco total em progressão',
    description: 'Para quem quer ganhar mais no cofre, aparecer primeiro no lobby e abrir a camada premium de coaches.',
    price: 29.9,
    billingPeriod: 'monthly',
    billingCycle: 'monthly',
    isPopular: true,
    ctaLabel: 'Assinar Duo Loot Premium',
    benefits: [
      'Multiplicador ativo de recompensas',
      'Mais visibilidade no matchmaking',
      'Acesso completo a coaches premium',
      'Prioridade em filas e suporte'
    ],
    features: [
      { name: 'Acesso aos Cofres', included: true },
      { name: 'Multiplicador de Ganhos', included: true, description: 'Até 2x mais recompensas' },
      { name: 'Destaque no Lobby', included: true, description: 'Borda e badge premium' },
      { name: 'Prioridade na Fila', included: true },
      { name: 'Acesso a Coaches', included: 'Acesso Total' },
      { name: 'Suporte VIP', included: true }
    ],
    limits: {
      matches_per_day: 999,
      lobby_highlights: true,
      priority_queue: true
    }
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    tier: 'pro',
    slug: 'pro',
    name: 'Pro',
    tagline: 'Alta performance e torneios',
    description: 'Preparado para times amadores e pro players com perfis totalmente customizados e prioridade em torneios.',
    price: 59.9,
    billingPeriod: 'monthly',
    billingCycle: 'monthly',
    ctaLabel: 'Em Breve — Modo Pro',
    benefits: [
      'Prioridade máxima em torneios parceiros',
      'Perfil gamer 100% customizado',
      'Estatísticas profundas e telemetria',
      'Suporte dedicado 24/7'
    ],
    features: [
      { name: 'Acesso aos Cofres', included: true },
      { name: 'Multiplicador de Ganhos', included: true, description: 'Até 3x mais recompensas' },
      { name: 'Destaque no Lobby', included: true, description: 'Borda dourada brilhante' },
      { name: 'Prioridade na Fila', included: true },
      { name: 'Acesso a Coaches', included: 'Acesso Total' },
      { name: 'Suporte VIP', included: true, description: 'Canal dedicado no Discord' }
    ],
    limits: {
      matches_per_day: 9999,
      lobby_highlights: true,
      priority_queue: true
    }
  }
];
