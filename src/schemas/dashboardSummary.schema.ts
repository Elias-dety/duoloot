import { z } from 'zod';

const DashboardSummarySchema = z.object({
  activeLobbies: z.number().int().min(0),
  totalEarnings: z.number().min(0),
  completedMissions: z.number().int().min(0),
  pendingInvites: z.number().int().min(0),
  nextEventStartsAt: z.string().datetime().optional(),
});

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
