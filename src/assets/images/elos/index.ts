import ascendente1 from './ascendente-1.png';
import ascendente2 from './ascendente-2.png';
import ascendente3 from './ascendente-3.png';
import bronze1 from './bronze-1.png';
import bronze2 from './bronze-2.png';
import bronze3 from './bronze-3.png';
import diamante1 from './diamante-1.png';
import diamante2 from './diamante-2.png';
import diamante3 from './diamante-3.png';
import ferro1 from './ferro-1.png';
import ferro2 from './ferro-2.png';
import ferro3 from './ferro-3.png';
import imortal1 from './imortal-1.png';
import imortal2 from './imortal-2.png';
import imortal3 from './imortal-3.png';
import ouro1 from './ouro-1.png';
import ouro2 from './ouro-2.png';
import ouro3 from './ouro-3.png';
import platina1 from './platina-1.png';
import platina2 from './platina-2.png';
import platina3 from './platina-3.png';
import prata1 from './prata-1.png';
import prata2 from './prata-2.png';
import prata3 from './prata-3.png';
import radiante from './radiante.png';

export const eloImages = {
  'ascendente-1': ascendente1,
  'ascendente-2': ascendente2,
  'ascendente-3': ascendente3,
  'bronze-1': bronze1,
  'bronze-2': bronze2,
  'bronze-3': bronze3,
  'diamante-1': diamante1,
  'diamante-2': diamante2,
  'diamante-3': diamante3,
  'ferro-1': ferro1,
  'ferro-2': ferro2,
  'ferro-3': ferro3,
  'imortal-1': imortal1,
  'imortal-2': imortal2,
  'imortal-3': imortal3,
  'ouro-1': ouro1,
  'ouro-2': ouro2,
  'ouro-3': ouro3,
  'platina-1': platina1,
  'platina-2': platina2,
  'platina-3': platina3,
  'prata-1': prata1,
  'prata-2': prata2,
  'prata-3': prata3,
  'radiante': radiante,
} as const;

export type ValorantElo = keyof typeof eloImages;
