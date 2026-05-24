import type { ValorantAgentDefinition } from '@/types/valorant.types';

export const valorantAgentsMock: ValorantAgentDefinition[] = [
  {
    agentId: 'jett',
    name: 'Jett',
    role: 'Duelist',
    imageUrl: '/assets/valorant/agents/jett.png',
  },
  {
    agentId: 'raze',
    name: 'Raze',
    role: 'Duelist',
    imageUrl: '/assets/valorant/agents/raze.png',
  },
  {
    agentId: 'sova',
    name: 'Sova',
    role: 'Initiator',
    imageUrl: '/assets/valorant/agents/sova.png',
  },
  {
    agentId: 'omen',
    name: 'Omen',
    role: 'Controller',
    imageUrl: '/assets/valorant/agents/omen.png',
  },
  {
    agentId: 'killjoy',
    name: 'Killjoy',
    role: 'Sentinel',
    imageUrl: '/assets/valorant/agents/killjoy.png',
  },
  {
    agentId: 'sage',
    name: 'Sage',
    role: 'Sentinel',
    imageUrl: '/assets/valorant/agents/sage.png',
  },
  {
    agentId: 'skye',
    name: 'Skye',
    role: 'Initiator',
    imageUrl: '/assets/valorant/agents/skye.png',
  },
  {
    agentId: 'brimstone',
    name: 'Brimstone',
    role: 'Controller',
    imageUrl: '/assets/valorant/agents/brimstone.png',
  },
  {
    agentId: 'reyna',
    name: 'Reyna',
    role: 'Duelist',
    imageUrl: '/assets/valorant/agents/reyna.png',
  },
  {
    agentId: 'phoenix',
    name: 'Phoenix',
    role: 'Duelist',
    imageUrl: '/assets/valorant/agents/phoenix.png',
  },
  {
    agentId: 'cypher',
    name: 'Cypher',
    role: 'Sentinel',
    imageUrl: '/assets/valorant/agents/cypher.png',
  },
  {
    agentId: 'viper',
    name: 'Viper',
    role: 'Controller',
    imageUrl: '/assets/valorant/agents/viper.png',
  },
];

export function getValorantAgentMock(agentId: string): ValorantAgentDefinition {
  const normalizedId = agentId.trim().toLowerCase();
  return (
    valorantAgentsMock.find((agent) => agent.agentId === normalizedId) ??
    valorantAgentsMock[0]
  );
}
