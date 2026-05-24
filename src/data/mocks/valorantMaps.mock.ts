import type { ValorantMapDefinition } from '@/types/valorant.types';

export const valorantMapsMock: ValorantMapDefinition[] = [
  {
    mapId: 'ascent',
    name: 'Ascent',
    imageUrl: '/assets/valorant/maps/ascent.png',
  },
  {
    mapId: 'bind',
    name: 'Bind',
    imageUrl: '/assets/valorant/maps/bind.png',
  },
  {
    mapId: 'haven',
    name: 'Haven',
    imageUrl: '/assets/valorant/maps/haven.png',
  },
  {
    mapId: 'split',
    name: 'Split',
    imageUrl: '/assets/valorant/maps/split.png',
  },
  {
    mapId: 'lotus',
    name: 'Lotus',
    imageUrl: '/assets/valorant/maps/lotus.png',
  },
  {
    mapId: 'sunset',
    name: 'Sunset',
    imageUrl: '/assets/valorant/maps/sunset.png',
  },
  {
    mapId: 'icebox',
    name: 'Icebox',
    imageUrl: '/assets/valorant/maps/icebox.png',
  },
  {
    mapId: 'breeze',
    name: 'Breeze',
    imageUrl: '/assets/valorant/maps/breeze.png',
  },
];

export function getValorantMapMock(mapId: string): ValorantMapDefinition {
  const normalizedId = mapId.trim().toLowerCase();
  return valorantMapsMock.find((map) => map.mapId === normalizedId) ?? valorantMapsMock[0];
}
