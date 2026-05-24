import calendarIcon from './calendar.svg';
import chevronLeftIcon from './chevron-left.svg';
import chevronRightIcon from './chevron-right.svg';
import clockIcon from './clock.svg';
import closeIcon from './close.svg';
import coinIcon from './coin.svg';
import communityChatIcon from './community-chat.svg';
import crownPremiumIcon from './crown-premium.svg';
import downloadIcon from './download.svg';
import filterIcon from './filter.svg';
import gamepadIcon from './gamepad.svg';
import giftIcon from './gift.svg';
import homeIcon from './home.svg';
import imagePlaceholderIcon from './image-placeholder.svg';
import lobbyFinderIcon from './lobby-finder.svg';
import loginIcon from './login.svg';
import logoMarkIcon from './logo-mark.svg';
import logoutIcon from './logout.svg';
import lootRewardIcon from './loot-reward.svg';
import matchmakingIcon from './matchmaking.svg';
import menuIcon from './menu.svg';
import microphoneIcon from './microphone.svg';
import missionsIcon from './missions.svg';
import notificationBellIcon from './notification-bell.svg';
import pingConnectionIcon from './ping-connection.svg';
import playTrailerIcon from './play-trailer.svg';
import plusIcon from './plus.svg';
import profileBadgeIcon from './profile-badge.svg';
import rankingIcon from './ranking.svg';
import searchIcon from './search.svg';
import secureShieldIcon from './secure-shield.svg';
import settingsIcon from './settings.svg';
import starFavoriteIcon from './star-favorite.svg';
import swordIcon from './sword.svg';
import uploadIcon from './upload.svg';
import userIcon from './user.svg';
import usersIcon from './users.svg';
import vaultKeyIcon from './vault-key.svg';
import vaultIcon from './vault.svg';
import walletIcon from './wallet.svg';

export const duolootIcons = {
  calendar: calendarIcon,
  chevronLeft: chevronLeftIcon,
  chevronRight: chevronRightIcon,
  clock: clockIcon,
  close: closeIcon,
  coin: coinIcon,
  communityChat: communityChatIcon,
  crownPremium: crownPremiumIcon,
  download: downloadIcon,
  filter: filterIcon,
  gamepad: gamepadIcon,
  gift: giftIcon,
  home: homeIcon,
  imagePlaceholder: imagePlaceholderIcon,
  lobbyFinder: lobbyFinderIcon,
  login: loginIcon,
  logoMark: logoMarkIcon,
  logout: logoutIcon,
  lootReward: lootRewardIcon,
  matchmaking: matchmakingIcon,
  menu: menuIcon,
  microphone: microphoneIcon,
  missions: missionsIcon,
  notificationBell: notificationBellIcon,
  pingConnection: pingConnectionIcon,
  playTrailer: playTrailerIcon,
  plus: plusIcon,
  profileBadge: profileBadgeIcon,
  ranking: rankingIcon,
  search: searchIcon,
  secureShield: secureShieldIcon,
  settings: settingsIcon,
  starFavorite: starFavoriteIcon,
  sword: swordIcon,
  upload: uploadIcon,
  user: userIcon,
  users: usersIcon,
  vaultKey: vaultKeyIcon,
  vault: vaultIcon,
  wallet: walletIcon,
} as const;

type DuolootIconName = keyof typeof duolootIcons;
