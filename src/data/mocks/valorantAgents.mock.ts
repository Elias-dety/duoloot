import { ValorantAgentDefinition } from '@/types/valorant.types';

export const VALORANT_AGENTS: Record<string, ValorantAgentDefinition> = {
  sage: {
    agentId: 'sage-id',
    name: 'Sage',
    role: 'Sentinel',
    imageUrl: '/assets/agents/sage.png'
  },
  omen: {
    agentId: 'omen-id',
    name: 'Omen',
    role: 'Controller',
    imageUrl: '/assets/agents/omen.png'
  },
  brimstone: {
    agentId: 'brimstone-id',
    name: 'Brimstone',
    role: 'Controller',
    imageUrl: '/assets/agents/brimstone.png'
  },
  jett: {
    agentId: 'jett-id',
    name: 'Jett',
    role: 'Duelist',
    imageUrl: '/assets/agents/jett.png'
  },
  reyna: {
    agentId: 'reyna-id',
    name: 'Reyna',
    role: 'Duelist',
    imageUrl: '/assets/agents/reyna.png'
  },
  raze: {
    agentId: 'raze-id',
    name: 'Raze',
    role: 'Duelist',
    imageUrl: '/assets/agents/raze.png'
  },
  phoenix: {
    agentId: 'phoenix-id',
    name: 'Phoenix',
    role: 'Duelist',
    imageUrl: '/assets/agents/phoenix.png'
  },
  chamber: {
    agentId: 'chamber-id',
    name: 'Chamber',
    role: 'Sentinel',
    imageUrl: '/assets/agents/chamber.png'
  }
};
