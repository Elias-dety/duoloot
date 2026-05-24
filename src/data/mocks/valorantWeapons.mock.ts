import type { ValorantWeaponDefinition } from '@/types/valorant.types';

export const valorantWeaponsMock: ValorantWeaponDefinition[] = [
  {
    weaponId: 'vandal',
    name: 'Vandal',
    category: 'Rifle',
    imageUrl: '/assets/valorant/weapons/vandal.png',
  },
  {
    weaponId: 'phantom',
    name: 'Phantom',
    category: 'Rifle',
    imageUrl: '/assets/valorant/weapons/phantom.png',
  },
  {
    weaponId: 'operator',
    name: 'Operator',
    category: 'Sniper',
    imageUrl: '/assets/valorant/weapons/operator.png',
  },
  {
    weaponId: 'sheriff',
    name: 'Sheriff',
    category: 'Sidearm',
    imageUrl: '/assets/valorant/weapons/sheriff.png',
  },
  {
    weaponId: 'spectre',
    name: 'Spectre',
    category: 'SMG',
    imageUrl: '/assets/valorant/weapons/spectre.png',
  },
  {
    weaponId: 'odin',
    name: 'Odin',
    category: 'Heavy',
    imageUrl: '/assets/valorant/weapons/odin.png',
  },
  {
    weaponId: 'ghost',
    name: 'Ghost',
    category: 'Sidearm',
    imageUrl: '/assets/valorant/weapons/ghost.png',
  },
  {
    weaponId: 'guardian',
    name: 'Guardian',
    category: 'Rifle',
    imageUrl: '/assets/valorant/weapons/guardian.png',
  },
  {
    weaponId: 'marshal',
    name: 'Marshal',
    category: 'Sniper',
    imageUrl: '/assets/valorant/weapons/marshal.png',
  },
];

export function getValorantWeaponMock(weaponId: string): ValorantWeaponDefinition {
  const normalizedId = weaponId.trim().toLowerCase();
  return (
    valorantWeaponsMock.find((weapon) => weapon.weaponId === normalizedId) ??
    valorantWeaponsMock[0]
  );
}
