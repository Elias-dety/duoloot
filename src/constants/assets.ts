import { redVaultIcons } from '@/assets/icons/red-vault';
import { duolootIcons } from '@/assets/icons/library';
import horizontalFrame from '@/assets/images/moudura-orizontal-1.svg';
import vaultClosed from '@/assets/images/vault/duoloot-vault-closed.webp';
import vaultClosedThumb from '@/assets/images/vault/duoloot-vault-closed-thumb.webp';
import vaultOpenRewards from '@/assets/images/vault/duoloot-vault-open-rewards.webp';
import vaultOpenRewardsThumb from '@/assets/images/vault/duoloot-vault-open-rewards-thumb.webp';
import vaultKey from '@/assets/images/vault/duoloot-vault-key.webp';
import vaultKeyThumb from '@/assets/images/vault/duoloot-vault-key-thumb.webp';
import duocoins from '@/assets/images/rewards/duoloot-duocoins-stack.webp';
import duocoinsThumb from '@/assets/images/rewards/duoloot-duocoins-stack-thumb.webp';
import lootBoxSmall from '@/assets/images/rewards/duoloot-loot-box-small.webp';
import lootBoxSmallThumb from '@/assets/images/rewards/duoloot-loot-box-small-thumb.webp';
import lobbyFinder from '@/assets/images/lobby/icon-lobby-finder.webp';
import lobbyFinderThumb from '@/assets/images/lobby/icon-lobby-finder-thumb.webp';
import matchmakingTrust from '@/assets/images/matchmaking/icon-matchmaking-trust.webp';
import matchmakingTrustThumb from '@/assets/images/matchmaking/icon-matchmaking-trust-thumb.webp';

export const ASSETS = {
  logo: {
    mark: redVaultIcons.logoMark,
    frame: horizontalFrame,
  },
  vault: {
    closed: vaultClosed,
    closedThumb: vaultClosedThumb,
    openRewards: vaultOpenRewards,
    openRewardsThumb: vaultOpenRewardsThumb,
    key: vaultKey,
    keyThumb: vaultKeyThumb,
  },
  rewards: {
    duocoins,
    duocoinsThumb,
    lootBoxSmall,
    lootBoxSmallThumb,
  },
  icons: {
    matchmakingTrust,
    matchmakingTrustThumb,
    lobbyFinder,
    lobbyFinderThumb,
    matchmaking: redVaultIcons.matchmaking,
    lobby: redVaultIcons.lobbyFinder,
    trustScore: redVaultIcons.secureShield,
    mission: redVaultIcons.missions,
    ranking: redVaultIcons.ranking,
    squad: duolootIcons.users,
    vault: redVaultIcons.vault,
    vaultKey: redVaultIcons.vaultKey,
    lootReward: redVaultIcons.lootReward,
    coin: duolootIcons.coin,
    wallet: duolootIcons.wallet,
    microphone: duolootIcons.microphone,
    search: duolootIcons.search,
    filter: duolootIcons.filter,
    profileBadge: duolootIcons.profileBadge,
    gamepad: duolootIcons.gamepad,
    calendar: duolootIcons.calendar,
    clock: duolootIcons.clock,
    sword: duolootIcons.sword,
  },
  avatars: {
    generic: duolootIcons.profileBadge,
    player: duolootIcons.user,
    squad: duolootIcons.users,
  },
} as const;
