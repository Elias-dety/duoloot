import { Message } from '@/schemas/message.schema';

export const mockMessages: Message[] = [
  {
    id: '2f1dff2c-e89c-4b5d-8d4e-6b630f8a0001',
    conversationId: '1f3a5614-9fdf-4f24-a27d-f9d049a40011',
    senderNickname: 'FalleN',
    recipientNickname: 'DuoRush',
    content: 'Fechamos duo no horario das 22h?',
    status: 'read',
    createdAt: new Date('2026-05-13T19:10:00Z').toISOString(),
  },
  {
    id: '38e17c2d-173e-4b8b-aeec-7409ba870002',
    conversationId: '1f3a5614-9fdf-4f24-a27d-f9d049a40011',
    senderNickname: 'DuoRush',
    recipientNickname: 'FalleN',
    content: 'Fechou. Vou entrar no lobby premium antes.',
    status: 'delivered',
    createdAt: new Date('2026-05-13T19:12:00Z').toISOString(),
  },
];
