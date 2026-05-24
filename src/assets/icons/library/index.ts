const svgDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const makeIcon = (label: string, accent = '#ff4655') =>
  svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${label}">
      <rect width="96" height="96" rx="22" fill="#111318"/>
      <rect x="8" y="8" width="80" height="80" rx="18" fill="#181b22" stroke="${accent}" stroke-width="3"/>
      <path d="M48 18 72 32v32L48 78 24 64V32l24-14Z" fill="${accent}" opacity=".16"/>
      <path d="M48 25 66 36v24L48 71 30 60V36l18-11Z" fill="none" stroke="${accent}" stroke-width="5" stroke-linejoin="round"/>
      <text x="48" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#f8fafc">${label}</text>
    </svg>
  `);

export const duolootIcons = {
  arrowRight: makeIcon('GO', '#0df0ff'),
  bell: makeIcon('BEL', '#ffd166'),
  calendar: makeIcon('CAL', '#0df0ff'),
  chat: makeIcon('MSG', '#0df0ff'),
  check: makeIcon('OK', '#3bd982'),
  clock: makeIcon('CLK', '#0df0ff'),
  coin: makeIcon('COIN', '#ffd166'),
  coins: makeIcon('COIN', '#ffd166'),
  crown: makeIcon('CRN', '#ffd166'),
  filter: makeIcon('FIL', '#ff4655'),
  gamepad: makeIcon('PAD', '#b084ff'),
  gift: makeIcon('GFT', '#ffd166'),
  home: makeIcon('HOME', '#0df0ff'),
  key: makeIcon('KEY', '#ffd166'),
  lobby: makeIcon('LOBBY', '#0df0ff'),
  lobbyFinder: makeIcon('LOBBY', '#0df0ff'),
  lock: makeIcon('LOCK', '#ff4655'),
  lootReward: makeIcon('LOOT', '#0df0ff'),
  matchmaking: makeIcon('TRUST', '#3bd982'),
  matchmakingTrust: makeIcon('TRUST', '#3bd982'),
  microphone: makeIcon('MIC', '#b084ff'),
  mission: makeIcon('MIS', '#ff4655'),
  plus: makeIcon('ADD', '#3bd982'),
  profileBadge: makeIcon('PRO', '#ffd166'),
  ranking: makeIcon('RANK', '#ffd166'),
  search: makeIcon('SEA', '#0df0ff'),
  settings: makeIcon('SET', '#b084ff'),
  shield: makeIcon('SAFE', '#3bd982'),
  squad: makeIcon('DUO', '#0df0ff'),
  star: makeIcon('STAR', '#ffd166'),
  sword: makeIcon('SWD', '#ff4655'),
  target: makeIcon('MIS', '#ff4655'),
  trophy: makeIcon('WIN', '#ffd166'),
  trustScore: makeIcon('SAFE', '#3bd982'),
  trustScoreRating: makeIcon('RATE', '#b084ff'),
  unlock: makeIcon('OPEN', '#3bd982'),
  user: makeIcon('USR', '#ffd166'),
  users: makeIcon('DUO', '#0df0ff'),
  vault: makeIcon('VAULT', '#ff4655'),
  vaultKey: makeIcon('KEY', '#ffd166'),
  wallet: makeIcon('WAL', '#3bd982'),
  x: makeIcon('X', '#ff4655'),
} as const;

export type DuolootIconName = keyof typeof duolootIcons;
export type DuolootIconLibrary = typeof duolootIcons;

export const iconLibrary = duolootIcons;
export const ICON_LIBRARY = duolootIcons;

export default duolootIcons;
