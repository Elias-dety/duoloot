import { z } from 'zod';

const PremiumFeatureSchema = z.object({
  name: z.string(),
  included: z.union([z.boolean(), z.string()]),
  description: z.string().optional(),
});

export const PremiumPlanSchema = z.object({
  id: z.string().uuid(),
  tier: z.enum(['free', 'plus', 'premium', 'pro', 'enterprise']),
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  price: z.number().min(0),
  billingPeriod: z.enum(['monthly', 'yearly', 'lifetime']).optional(),
  billingCycle: z.enum(['monthly', 'yearly', 'lifetime']),
  isPopular: z.boolean().optional(),
  ctaLabel: z.string(),
  benefits: z.array(z.string()).min(1),
  features: z.array(PremiumFeatureSchema),
  limits: z.record(z.string(), z.union([z.number(), z.string(), z.boolean()])),
});

export type PremiumPlan = z.infer<typeof PremiumPlanSchema>;

// ==========================================
// MAPA DE FEATURES PREMIUM
// ==========================================

export const PREMIUM_FEATURES = {
  RIOT_PROFILE_BASIC: 'riot_profile_basic',
  RIOT_PROFILE_ADVANCED: 'riot_profile_advanced',
  ADVANCED_STATS: 'advanced_stats',
  DUO_MATCHMAKING: 'duo_matchmaking',
  PREMIUM_BADGES: 'premium_badges',
  PRIORITY_SUPPORT: 'priority_support',
  TOURNAMENT_PRIORITY: 'tournament_priority',
  CUSTOM_PROFILE: 'custom_profile',
} as const;

export type PremiumFeatureKey = typeof PREMIUM_FEATURES[keyof typeof PREMIUM_FEATURES];

// Matriz de permissão de features por plano
const PLAN_FEATURE_MATRIX: Record<string, PremiumFeatureKey[]> = {
  free: [
    'riot_profile_basic',
  ],
  plus: [
    'riot_profile_basic',
    'riot_profile_advanced',
    'duo_matchmaking',
  ],
  premium: [
    'riot_profile_basic',
    'riot_profile_advanced',
    'advanced_stats',
    'duo_matchmaking',
    'premium_badges',
    'priority_support',
  ],
  pro: [
    'riot_profile_basic',
    'riot_profile_advanced',
    'advanced_stats',
    'duo_matchmaking',
    'premium_badges',
    'priority_support',
    'tournament_priority',
    'custom_profile',
  ],
  enterprise: [
    'riot_profile_basic',
    'riot_profile_advanced',
    'advanced_stats',
    'duo_matchmaking',
    'premium_badges',
    'priority_support',
    'tournament_priority',
    'custom_profile',
  ]
};

/**
 * Helper para verificar se um determinado plano possui acesso a uma funcionalidade.
 */
export function canUseFeature(
  plan: PremiumPlan | string | null | undefined,
  featureKey: string
): boolean {
  if (!plan) return false;
  const slug = typeof plan === 'string' ? plan : plan.slug || plan.tier;
  const allowedFeatures = PLAN_FEATURE_MATRIX[slug.toLowerCase().trim()] || [];
  return allowedFeatures.includes(featureKey as PremiumFeatureKey);
}
