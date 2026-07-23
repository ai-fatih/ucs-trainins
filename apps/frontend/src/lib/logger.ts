type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levels: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = levels[(process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info'] ?? 1;

function shouldLog(level: LogLevel): boolean {
  return levels[level] >= currentLevel;
}

const isDev = process.env.NODE_ENV === 'development';

function fmt(level: LogLevel, msg: string, meta?: unknown): string {
  const prefix = `[${level.toUpperCase()}]`;
  return meta ? `${prefix} ${msg} ${JSON.stringify(meta)}` : `${prefix} ${msg}`;
}

export const logger = {
  debug: (message: string, meta?: unknown) => {
    if (shouldLog('debug') && isDev) console.debug(fmt('debug', message, meta));
  },
  info: (message: string, meta?: unknown) => {
    if (shouldLog('info') && isDev) console.info(fmt('info', message, meta));
  },
  warn: (message: string, meta?: unknown) => {
    if (shouldLog('warn')) console.warn(fmt('warn', message, meta));
  },
  error: (message: string, meta?: unknown) => {
    if (shouldLog('error')) console.error(fmt('error', message, meta));
  },
};
