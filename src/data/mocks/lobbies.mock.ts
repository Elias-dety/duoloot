import { Lobby } from '@/schemas/lobby.schema';
import { getAvailableDuoUsers, mapValorantUserToPlayer } from './valorantUsers.mock';

const availableUsers = getAvailableDuoUsers();

export const mockLobbies: Lobby[] = availableUsers.map((user, index) => {
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
