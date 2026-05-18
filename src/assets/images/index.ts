// Brand Assets
import logoFull from './logotipo-duoloot.png';
import horizontalFrame from './moudura-orizontal-1.svg';

// Vault Assets
import vaultClosedPng from './vault/duoloot-vault-closed.png';
import vaultClosedWebp from './vault/duoloot-vault-closed.webp';
import vaultClosedThumb from './vault/duoloot-vault-closed-thumb.webp';

import vaultKeyPng from './vault/duoloot-vault-key.png';
import vaultKeyWebp from './vault/duoloot-vault-key.webp';
import vaultKeyThumb from './vault/duoloot-vault-key-thumb.webp';

import vaultOpenRewardsPng from './vault/duoloot-vault-open-rewards.png';
import vaultOpenRewardsWebp from './vault/duoloot-vault-open-rewards.webp';
import vaultOpenRewardsThumb from './vault/duoloot-vault-open-rewards-thumb.webp';

// Reward Assets
import duocoinsStackPng from './rewards/duoloot-duocoins-stack.png';
import duocoinsStackWebp from './rewards/duoloot-duocoins-stack.webp';
import duocoinsStackThumb from './rewards/duoloot-duocoins-stack-thumb.webp';

import lootBoxSmallPng from './rewards/duoloot-loot-box-small.png';
import lootBoxSmallWebp from './rewards/duoloot-loot-box-small.webp';
import lootBoxSmallThumb from './rewards/duoloot-loot-box-small-thumb.webp';

// Lobby Assets
import lobbyFinderPng from './lobby/icon-lobby-finder.png';
import lobbyFinderWebp from './lobby/icon-lobby-finder.webp';
import lobbyFinderThumb from './lobby/icon-lobby-finder-thumb.webp';

// Matchmaking Assets
import matchmakingTrustPng from './matchmaking/icon-matchmaking-trust.png';
import matchmakingTrustWebp from './matchmaking/icon-matchmaking-trust.webp';
import matchmakingTrustThumb from './matchmaking/icon-matchmaking-trust-thumb.webp';

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
    thumb: vaultClosedThumb,
  },
  key: {
    png: vaultKeyPng,
    webp: vaultKeyWebp,
    thumb: vaultKeyThumb,
  },
  openRewards: {
    png: vaultOpenRewardsPng,
    webp: vaultOpenRewardsWebp,
    thumb: vaultOpenRewardsThumb,
  },
} as const;

export const rewardAssets = {
  duocoinsStack: {
    png: duocoinsStackPng,
    webp: duocoinsStackWebp,
    thumb: duocoinsStackThumb,
  },
  lootBoxSmall: {
    png: lootBoxSmallPng,
    webp: lootBoxSmallWebp,
    thumb: lootBoxSmallThumb,
  },
} as const;

export const lobbyAssets = {
  finder: {
    png: lobbyFinderPng,
    webp: lobbyFinderWebp,
    thumb: lobbyFinderThumb,
  },
} as const;

export const matchmakingAssets = {
  trust: {
    png: matchmakingTrustPng,
    webp: matchmakingTrustWebp,
    thumb: matchmakingTrustThumb,
  },
} as const;

// Unified Export Object
export const duolootAssets = {
  brand: brandAssets,
  vault: vaultAssets,
  rewards: rewardAssets,
  lobby: lobbyAssets,
  matchmaking: matchmakingAssets,
} as const;
