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

const makeWideLogo = () =>
  svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120" role="img" aria-label="Duoloot">
      <rect width="420" height="120" rx="24" fill="#0b0d12"/>
      <path d="M42 30h62l26 30-26 30H42L68 60 42 30Z" fill="#ff4655"/>
      <path d="M74 42h22l14 18-14 18H74l14-18-14-18Z" fill="#0b0d12"/>
      <text x="154" y="70" font-family="Arial, sans-serif" font-size="42" font-weight="900" letter-spacing="3" fill="#f8fafc">DUOLOOT</text>
      <text x="157" y="93" font-family="Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="6" fill="#ff4655">RED VAULT</text>
    </svg>
  `);

const makePanelImage = (label: string, accent = '#ff4655') =>
  svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img" aria-label="${label}">
      <rect width="640" height="480" rx="36" fill="#0b0d12"/>
      <rect x="32" y="32" width="576" height="416" rx="28" fill="#151821" stroke="${accent}" stroke-width="4"/>
      <path d="M320 96 470 176v128L320 384 170 304V176l150-80Z" fill="${accent}" opacity=".14"/>
      <path d="M320 126 438 190v100L320 354 202 290V190l118-64Z" fill="none" stroke="${accent}" stroke-width="12" stroke-linejoin="round"/>
      <circle cx="320" cy="240" r="44" fill="${accent}" opacity=".9"/>
      <text x="320" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="900" letter-spacing="3" fill="#f8fafc">${label}</text>
    </svg>
  `);

const logoFull = makeWideLogo();
const logoMark = makeIcon('DL', '#ff4655');
const horizontalFrame = makePanelImage('DUOLOOT', '#0df0ff');
const vaultClosed = makePanelImage('VAULT', '#ff4655');
const vaultOpenRewards = makePanelImage('REWARDS', '#ffd166');
const vaultKey = makeIcon('KEY', '#ffd166');
const duocoins = makeIcon('COIN', '#ffd166');
const lootBoxSmall = makeIcon('LOOT', '#0df0ff');
const lobbyFinder = makeIcon('LOBBY', '#0df0ff');
const matchmakingTrust = makeIcon('TRUST', '#3bd982');
const missionTarget = makeIcon('MIS', '#ff4655');
const trustScoreRating = makeIcon('RATE', '#b084ff');
const trustScoreShield = makeIcon('SAFE', '#3bd982');
const ranking = makeIcon('RANK', '#ffd166');
const users = makeIcon('DUO', '#0df0ff');
const wallet = makeIcon('WAL', '#3bd982');
const microphone = makeIcon('MIC', '#b084ff');
const search = makeIcon('SEA', '#0df0ff');
const filter = makeIcon('FIL', '#ff4655');
const profileBadge = makeIcon('PRO', '#ffd166');
const gamepad = makeIcon('PAD', '#b084ff');
const calendar = makeIcon('CAL', '#0df0ff');
const clock = makeIcon('CLK', '#0df0ff');
const sword = makeIcon('SWD', '#ff4655');
const user = makeIcon('USR', '#ffd166');

export const ASSETS = {
  logo: {
    mark: logoMark,
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
    matchmakingTrust,
    matchmakingTrustThumb: matchmakingTrust,
    lobbyFinder,
    lobbyFinderThumb: lobbyFinder,
    matchmaking: matchmakingTrust,
    lobby: lobbyFinder,
    trustScore: trustScoreShield,
    trustScoreRating,
    mission: missionTarget,
    ranking,
    squad: users,
    vault: vaultClosed,
    vaultKey,
    lootReward: lootBoxSmall,
    coin: duocoins,
    wallet,
    microphone,
    search,
    filter,
    profileBadge,
    gamepad,
    calendar,
    clock,
    sword,
  },
  avatars: {
    generic: profileBadge,
    player: user,
    squad: users,
  },
} as const;
