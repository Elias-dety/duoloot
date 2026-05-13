import { Mission } from '@/schemas/mission.schema';

export const mockMissions: Mission[] = [
  {
    id: 'f87ac10b-58cc-4372-a567-0e02b2c3d471',
    title: 'Primeira Vitória do Dia',
    description: 'Vença sua primeira partida em qualquer modo competitivo formando um lobby pelo Duo Loot.',
    rules: [
      'O lobby deve ter sido criado no Duo Loot.',
      'Apenas partidas no modo competitivo são válidas.',
      'O resultado deve ser uma vitória.'
    ],
    progress: 0,
    isCompleted: false,
    reward: {
      amount: 50,
      currency: 'DuoCoins',
    },
    validationType: 'automatic',
  },
  {
    id: 'd2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a',
    title: 'Especialista em Headshots',
    description: 'Consiga 20 headshots em partidas ranqueadas hoje.',
    rules: [
      'Apenas válido em partidas do modo competitivo.',
      'Kills devem ser marcadas como headshot no histórico oficial.'
    ],
    progress: 85,
    isCompleted: false,
    reward: {
      amount: 150,
      currency: 'DuoCoins',
    },
    validationType: 'automatic',
  },
  {
    id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    title: 'Guia da Comunidade',
    description: 'Receba 3 avaliações positivas de companheiros de equipe diferentes.',
    rules: [
      'As avaliações devem ser de partidas diferentes.',
      'As avaliações devem ter classificação 4 estrelas ou superior.'
    ],
    progress: 100,
    isCompleted: true,
    reward: {
      amount: 300,
      currency: 'DuoCoins',
    },
    validationType: 'manual',
  }
];
