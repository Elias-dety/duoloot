import { DashboardSummary } from '@/schemas/dashboardSummary.schema';

export const mockDashboardSummary: DashboardSummary = {
  activeLobbies: 42,
  totalEarnings: 1540.50,
  completedMissions: 12,
  pendingInvites: 3,
  nextEventStartsAt: new Date('2026-05-20T18:00:00Z').toISOString(),
};
