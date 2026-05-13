import { PremiumPlan } from '@/schemas/premiumPlan.schema';

export const mockPremiumPlans: PremiumPlan[] = [
  {
    id: 'plan-1',
    name: 'Free',
    price: 0,
    billingPeriod: 'monthly',
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
    id: 'plan-2',
    name: 'Premium',
    price: 29.90,
    billingPeriod: 'monthly',
    isPopular: true,
    features: [
      { name: 'Acesso aos Cofres', included: true },
      { name: 'Multiplicador de Ganhos', included: true, description: 'Até 2x mais recompensas' },
      { name: 'Destaque no Lobby', included: true, description: 'Borda e Badge Premium' },
      { name: 'Prioridade na Fila', included: true },
      { name: 'Acesso a Coaches', included: 'Acesso Total' },
      { name: 'Suporte VIP', included: true },
    ],
  }
];
