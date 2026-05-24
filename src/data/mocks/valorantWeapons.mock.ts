import { ValorantWeaponDefinition } from '@/types/valorant.types';

export const VALORANT_WEAPONS: Record<string, ValorantWeaponDefinition> = {
  vandal: {
    weaponId: 'vandal-id',
    name: 'Vandal',
    category: 'Rifle',
    imageUrl: '/assets/weapons/vandal.png'
  },
  phantom: {
    weaponId: 'phantom-id',
    name: 'Phantom',
    category: 'Rifle',
    imageUrl: '/assets/weapons/phantom.png'
  },
  operator: {
    weaponId: 'operator-id',
    name: 'Operator',
    category: 'Sniper',
    imageUrl: '/assets/weapons/operator.png'
  },
  marshal: {
    weaponId: 'marshal-id',
    name: 'Marshal',
    category: 'Sniper',
    imageUrl: '/assets/weapons/marshal.png'
  },
  sheriff: {
    weaponId: 'sheriff-id',
    name: 'Sheriff',
    category: 'Sidearm',
    imageUrl: '/assets/weapons/sheriff.png'
  },
  ghost: {
    weaponId: 'ghost-id',
    name: 'Ghost',
    category: 'Sidearm',
    imageUrl: '/assets/weapons/ghost.png'
  },
  spectre: {
    weaponId: 'spectre-id',
    name: 'Spectre',
    category: 'SMG',
    imageUrl: '/assets/weapons/spectre.png'
  },
  guardian: {
    weaponId: 'guardian-id',
    name: 'Guardian',
    category: 'Rifle',
    imageUrl: '/assets/weapons/guardian.png'
  }
};
