import type { ValorantRecentMatch, ValorantWeaponStats } from '@/types/valorant.types';
import { percent } from './shared';

type WeaponAccumulator = Omit<
  ValorantWeaponStats,
  'headshotPercent' | 'bodyshotPercent' | 'legshotPercent' | 'usageRate'
>;

export function calculateWeaponStats(matches: ValorantRecentMatch[]): ValorantWeaponStats[] {
  const grouped = new Map<string, WeaponAccumulator>();

  matches.forEach((match) => {
    match.weapons.forEach((weapon) => {
      const current = grouped.get(weapon.weaponId) ?? {
        weapon: weapon.weapon,
        weaponId: weapon.weaponId,
        category: weapon.category,
        imageUrl: weapon.imageUrl,
        kills: 0,
        headshots: 0,
        bodyshots: 0,
        legshots: 0,
        damage: 0,
      };

      grouped.set(weapon.weaponId, {
        ...current,
        kills: current.kills + weapon.kills,
        headshots: current.headshots + weapon.headshots,
        bodyshots: current.bodyshots + weapon.bodyshots,
        legshots: current.legshots + weapon.legshots,
        damage: current.damage + weapon.damage,
      });
    });
  });

  const totalKills = [...grouped.values()].reduce((total, weapon) => total + weapon.kills, 0);

  return [...grouped.values()]
    .map((weapon) => {
      const shots = weapon.headshots + weapon.bodyshots + weapon.legshots;

      return {
        ...weapon,
        headshotPercent: percent(weapon.headshots, shots),
        bodyshotPercent: percent(weapon.bodyshots, shots),
        legshotPercent: percent(weapon.legshots, shots),
        usageRate: percent(weapon.kills, totalKills),
      };
    })
    .sort((a, b) => b.kills - a.kills || b.damage - a.damage);
}
