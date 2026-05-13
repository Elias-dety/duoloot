import { Notification } from '@/schemas/notification.schema';

export const mockNotifications: Notification[] = [
  {
    id: 'c6d62a06-aed3-4a50-9f94-e79c5a340001',
    type: 'vault',
    title: 'Cofre com multiplicador ativo',
    description: 'As proximas 2 horas estao com bonus de ganho para duos fechados.',
    isRead: false,
    ctaLabel: 'Abrir cofre',
    createdAt: new Date('2026-05-13T12:00:00Z').toISOString(),
  },
  {
    id: '5a961efc-89df-4f4e-b918-cfcb3c0b0002',
    type: 'premium',
    title: 'Coach premium liberado',
    description: 'Novos horarios de coach entraram na vitrine premium.',
    isRead: true,
    ctaLabel: 'Ver coaches',
    createdAt: new Date('2026-05-12T20:30:00Z').toISOString(),
  },
];
