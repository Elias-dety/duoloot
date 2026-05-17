import { z } from 'zod';

export const ONBOARDING_MAIN_GAMES = [
  { value: 'valorant', label: 'Valorant' },
  { value: 'league-of-legends', label: 'League of Legends' },
  { value: 'teamfight-tactics', label: 'Teamfight Tactics' },
  { value: 'outros', label: 'Outros' },
] as const;

export const ONBOARDING_RANKS = [
  { value: 'ferro', label: 'Ferro' },
  { value: 'bronze', label: 'Bronze' },
  { value: 'prata', label: 'Prata' },
  { value: 'ouro', label: 'Ouro' },
  { value: 'platina', label: 'Platina' },
  { value: 'diamante', label: 'Diamante' },
  { value: 'ascendente', label: 'Ascendente' },
  { value: 'imortal', label: 'Imortal' },
  { value: 'radiante', label: 'Radiante' },
  { value: 'unranked', label: 'Sem Rank (Unranked)' },
] as const;

export const ONBOARDING_ROLES = [
  { value: 'duelista', label: 'Duelista / Carry' },
  { value: 'iniciador', label: 'Iniciador' },
  { value: 'controlador', label: 'Controlador' },
  { value: 'sentinela', label: 'Sentinela' },
  { value: 'flex', label: 'Flexível (Flex)' },
  { value: 'suporte', label: 'Suporte' },
  { value: 'entry', label: 'Entry Fragger' },
  { value: 'lurker', label: 'Lurker' },
] as const;

export const ONBOARDING_PLAY_STYLES = [
  { value: 'agressivo', label: 'Agressivo' },
  { value: 'tatico', label: 'Tático / Metódico' },
  { value: 'comunicativo', label: 'Comunicativo / IGL' },
  { value: 'casual', label: 'Casual / Relaxado' },
  { value: 'competitivo', label: 'Altamente Competitivo' },
  { value: 'suporte', label: 'Focado em Suporte' },
  { value: 'clutch', label: 'Clutch Player' },
] as const;

export const ONBOARDING_SESSION_FOCUS = [
  { value: 'subir-rank', label: 'Subir Rank / Competitivo' },
  { value: 'treinar', label: 'Treinar / Melhorar Mira' },
  { value: 'jogar-casual', label: 'Jogar Casual / For Fun' },
  { value: 'farmar-cofre', label: 'Farmar Pontos / Cofre' },
  { value: 'encontrar-duo', label: 'Encontrar Duo Parceiro' },
  { value: 'campeonato', label: 'Treinar para Campeonatos' },
] as const;

export const ONBOARDING_AVAILABILITIES = [
  { value: 'manhã', label: 'Período da Manhã' },
  { value: 'tarde', label: 'Período da Tarde' },
  { value: 'noite', label: 'Período da Noite' },
  { value: 'madrugada', label: 'Período da Madrugada' },
  { value: 'fim-de-semana', label: 'Apenas Finais de Semana' },
  { value: 'variável', label: 'Horário Variável' },
] as const;

export const ONBOARDING_MODES = [
  { value: 'ranked', label: 'Ranked / Competitivo' },
  { value: 'casual', label: 'Casual / Sem compromisso' },
  { value: 'swiftplay', label: 'Swiftplay / Partidas Rápidas' },
  { value: 'premier', label: 'Premier / Torneios' },
  { value: 'treino', label: 'Modo Treino / Personalizada' },
  { value: 'duo', label: 'Duo / Parceria' },
  { value: 'squad', label: 'Squad / Grupo Completo' },
] as const;

export const ONBOARDING_REGIONS = [
  { value: 'br', label: 'Brasil (BR)' },
  { value: 'na', label: 'América do Norte (NA)' },
  { value: 'latam', label: 'América Latina (LATAM)' },
  { value: 'eu', label: 'Europa (EU)' },
] as const;

export const OnboardingSchema = z.object({
  mainGame: z.string().min(1, 'O jogo principal é obrigatório.'),
  
  riotId: z.string().optional(),

  nickname: z.string().min(2, 'O nickname deve conter pelo menos 2 caracteres.'),

  currentRank: z.string().min(1, 'O rank atual é obrigatório.'),

  mainRole: z.string().min(1, 'A função principal é obrigatória.'),

  secondaryRole: z.string().optional(),

  playStyle: z.string().min(1, 'O estilo de jogo é obrigatório.'),

  sessionFocus: z.string().optional(),

  availability: z.string().min(1, 'A disponibilidade é obrigatória.'),

  preferredModes: z.array(z.string()).min(1, 'Selecione pelo menos um modo preferido.'),

  microphone: z.boolean().optional(),

  region: z.string().optional(),

  bio: z.string().max(180, 'A biografia deve ter no máximo 180 caracteres.').optional(),
});

export type OnboardingData = z.infer<typeof OnboardingSchema>;
