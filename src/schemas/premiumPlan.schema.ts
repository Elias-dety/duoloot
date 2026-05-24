import { z } from 'zod';

const PremiumFeatureSchema = z.object({
  name: z.string(),
  included: z.union([z.boolean(), z.string()]),
  description: z.string().optional(),
});

export const PremiumPlanSchema = z.object({
  id: z.string().uuid(),
  tier: z.enum(['free', 'premium']),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  price: z.number().min(0),
  billingPeriod: z.enum(['monthly', 'yearly', 'lifetime']),
  isPopular: z.boolean().optional(),
  ctaLabel: z.string(),
  benefits: z.array(z.string()).min(1),
  features: z.array(PremiumFeatureSchema),
});


export type PremiumPlan = z.infer<typeof PremiumPlanSchema>;
