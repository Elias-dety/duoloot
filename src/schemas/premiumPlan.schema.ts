import { z } from 'zod';

export const PremiumFeatureSchema = z.object({
  name: z.string(),
  included: z.union([z.boolean(), z.string()]),
  description: z.string().optional(),
});

export const PremiumPlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number().min(0),
  billingPeriod: z.enum(['monthly', 'yearly', 'lifetime']),
  isPopular: z.boolean().optional(),
  features: z.array(PremiumFeatureSchema),
});

export type PremiumFeature = z.infer<typeof PremiumFeatureSchema>;
export type PremiumPlan = z.infer<typeof PremiumPlanSchema>;
