/**
 * Logger utilitário para a aplicação Duo Loot.
 * Em produção, logs de debug/info são suprimidos para não poluir o console.
 * console.warn e console.error permanecem sempre ativos.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /** Logs detalhados de desenvolvimento — silenciados em produção. */
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.log('[DEBUG]', ...args);
    }
  },

  /** Logs informativos de fluxo — silenciados em produção. */
  info: (...args: unknown[]): void => {
    if (isDev) {
      console.log('[INFO]', ...args);
    }
  },

  /** Avisos — sempre exibidos. */
  warn: (...args: unknown[]): void => {
    console.warn('[WARN]', ...args);
  },

  /** Erros — sempre exibidos. */
  error: (...args: unknown[]): void => {
    console.error('[ERROR]', ...args);
  },
};

export default logger;
