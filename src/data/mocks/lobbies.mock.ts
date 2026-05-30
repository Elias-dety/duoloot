import { Lobby } from '@/schemas/lobby.schema';
import { getAvailableDuoUsers, mapValorantUserToPlayer } from './valorantUsers.mock';

const availableUsers = getAvailableDuoUsers();

const baseLobbies: Lobby[] = availableUsers.map((user, index) => {
  const player = mapValorantUserToPlayer(user);
  const slotsTotal = 5;
  const slotsFilled = index === 1 ? 5 : (index % 3) + 1;
  const status = slotsFilled === slotsTotal ? 'full' : 'open';

  return {
    id: `lobby-${user.id}`,
    owner: player as unknown as Lobby['owner'],
    slotsTotal,
    slotsFilled,
    mode: 'Competitivo',
    queue: 'Ranqueada',
    minRank: 'Ferro 1',
    maxRank: 'Radiante',
    compatibilityScore: 70 + (index * 5),
    status,
    metadata: {
      premiumOnly: index % 2 === 0,
      voiceChannel: 'https://discord.gg/duoloot-mock',
      bio: player.gameProfile?.bio,
      mainGame: player.gameProfile?.mainGame,
      riotId: player.gameProfile?.riotId,
      currentRank: player.gameProfile?.currentRank,
      mainRole: player.gameProfile?.mainRole,
      microphone: player.gameProfile?.microphone,
      region: player.gameProfile?.region
    },
    createdAt: new Date().toISOString(),
  };
});

export const mockLobbies: Lobby[] = [
  ...baseLobbies,
  ...baseLobbies.map(l => ({ ...l, id: l.id + '-2', compatibilityScore: 99, owner: { ...l.owner, name: l.owner.name + ' (Smurf)' } })),
  ...baseLobbies.map(l => ({ ...l, id: l.id + '-3', compatibilityScore: 45, owner: { ...l.owner, name: l.owner.name + ' (Tryhard)' } })),
  // 10 extra lobbies
  ...Array.from({ length: 10 }).map((_, i) => {
    const base = baseLobbies[i % baseLobbies.length];
    const slotsFilled = (i % 4) + 1;
    return {
      ...base,
      id: `lobby-extra-${i}`,
      compatibilityScore: 30 + (i * 7) % 70, // random-ish score between 30 and 100
      slotsFilled,
      status: slotsFilled === base.slotsTotal ? 'full' : 'open',
      owner: {
        ...base.owner,
        name: `${base.owner.name} (Clone ${i + 1})`
      }
    } as Lobby;
  })
];
