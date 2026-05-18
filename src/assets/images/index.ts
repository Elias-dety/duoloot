// Brand Assets
import logoFull from './logotipo-trasparente-duoloot.png';
import horizontalFrame from './moudura-orizontal-1.svg';

// Vault Assets
import vaultClosedPng from './vault/duoloot-vault-closed.png';
import vaultClosedWebp from './vault/duoloot-vault-closed.webp';

import vaultKeyPng from './vault/duoloot-vault-key.png';
import vaultKeyWebp from './vault/duoloot-vault-key.webp';

import vaultOpenRewardsPng from './vault/duoloot-vault-open-rewards.png';
import vaultOpenRewardsWebp from './vault/duoloot-vault-open-rewards.webp';

// Reward Assets
import duocoinsStackPng from './rewards/duoloot-duocoins-stack.png';
import duocoinsStackWebp from './rewards/duoloot-duocoins-stack.webp';

import lootBoxSmallPng from './rewards/duoloot-loot-box-small.png';
import lootBoxSmallWebp from './rewards/duoloot-loot-box-small.webp';

// Lobby Assets
import lobbyFinderPng from './lobby/icon-lobby-finder.png';
import lobbyFinderWebp from './lobby/icon-lobby-finder.webp';

// Matchmaking Assets
import matchmakingTrustPng from './matchmaking/icon-matchmaking-trust.png';

// Transparent v2 Icon Assets
import missionTargetPng from './icons/icon-mission-target.png';
import missionTargetWebp from './icons/icon-mission-target.webp';
import trustScoreRatingPng from './icons/icon-trust-score-rating.png';
import trustScoreRatingWebp from './icons/icon-trust-score-rating.webp';
import trustScoreShieldPng from './icons/icon-trust-score-shield.png';
import trustScoreShieldWebp from './icons/icon-trust-score-shield.webp';

// Export all elos from the sub-module
export * from './elos';

export const brandAssets = {
  logoFull,
  horizontalFrame,
} as const;

export const vaultAssets = {
  closed: {
    png: vaultClosedPng,
    webp: vaultClosedWebp,
    thumb: vaultClosedWebp,
  },
  key: {
    png: vaultKeyPng,
    webp: vaultKeyWebp,
    thumb: vaultKeyWebp,
  },
  openRewards: {
    png: vaultOpenRewardsPng,
    webp: vaultOpenRewardsWebp,
    thumb: vaultOpenRewardsWebp,
  },
} as const;

export const rewardAssets = {
  duocoinsStack: {
    png: duocoinsStackPng,
    webp: duocoinsStackWebp,
    thumb: duocoinsStackWebp,
  },
  lootBoxSmall: {
    png: lootBoxSmallPng,
    webp: lootBoxSmallWebp,
    thumb: lootBoxSmallWebp,
  },
} as const;

export const lobbyAssets = {
  finder: {
    png: lobbyFinderPng,
    webp: lobbyFinderWebp,
    thumb: lobbyFinderWebp,
  },
} as const;

export const matchmakingAssets = {
  trust: {
    png: matchmakingTrustPng,
    // The transparent v2 WEBP for this asset is empty, so keep PNG as the safe source.
    webp: matchmakingTrustPng,
    thumb: matchmakingTrustPng,
  },
} as const;

export const transparentIconAssets = {
  missionTarget: {
    png: missionTargetPng,
    webp: missionTargetWebp,
    thumb: missionTargetWebp,
  },
  trustScoreRating: {
    png: trustScoreRatingPng,
    webp: trustScoreRatingWebp,
    thumb: trustScoreRatingWebp,
  },
  trustScoreShield: {
    png: trustScoreShieldPng,
    webp: trustScoreShieldWebp,
    thumb: trustScoreShieldWebp,
  },
} as const;

// Unified Export Object
export const duolootAssets = {
  brand: brandAssets,
  vault: vaultAssets,
  rewards: rewardAssets,
  lobby: lobbyAssets,
  matchmaking: matchmakingAssets,
  icons: transparentIconAssets,
} as const;
