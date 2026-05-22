import { redVaultIcons } from '@/assets/icons/red-vault';
import { duolootIcons } from '@/assets/icons/library';
import logoFull from '@/assets/images/logotipo-trasparente-duoloot.png';
import horizontalFrame from '@/assets/images/moudura-orizontal-1.svg';
import vaultClosed from '@/assets/images/vault/duoloot-vault-closed.webp';
import vaultOpenRewards from '@/assets/images/vault/duoloot-vault-open-rewards.webp';
import vaultKey from '@/assets/images/vault/duoloot-vault-key.webp';
import duocoins from '@/assets/images/rewards/duoloot-duocoins-stack.webp';
import lootBoxSmall from '@/assets/images/rewards/duoloot-loot-box-small.webp';
import lobbyFinder from '@/assets/images/lobby/icon-lobby-finder.webp';
import matchmakingTrust from '@/assets/images/matchmaking/icon-matchmaking-trust.png';
import missionTarget from '@/assets/images/icons/icon-mission-target.webp';
import trustScoreRating from '@/assets/images/icons/icon-trust-score-rating.webp';
import trustScoreShield from '@/assets/images/icons/icon-trust-score-shield.webp';

export const ASSETS = {
  logo: {
    mark: redVaultIcons.logoMark,
    full: logoFull,
    frame: horizontalFrame,
  },
  vault: {
    closed: vaultClosed,
    closedThumb: vaultClosed,
    openRewards: vaultOpenRewards,
    openRewardsThumb: vaultOpenRewards,
    key: vaultKey,
    keyThumb: vaultKey,
  },
  rewards: {
    duocoins,
    duocoinsThumb: duocoins,
    lootBoxSmall,
    lootBoxSmallThumb: lootBoxSmall,
  },
  icons: {
    matchmakingTrust: matchmakingTrust,
    matchmakingTrustThumb: matchmakingTrust,
    lobbyFinder: lobbyFinder,
    lobbyFinderThumb: lobbyFinder,
    matchmaking: matchmakingTrust,
    lobby: lobbyFinder,
    trustScore: trustScoreShield,
    trustScoreRating: trustScoreRating,
    mission: missionTarget,
    ranking: redVaultIcons.ranking,
    squad: duolootIcons.users,
    vault: vaultClosed,
    vaultKey: vaultKey,
    lootReward: lootBoxSmall,
    coin: duocoins,
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
