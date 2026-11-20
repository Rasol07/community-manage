import { pino } from 'pino';
import { env } from '../config/env';

const isDev = env.NODE_ENV === 'development';

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  redact: {
    paths: [
      'req.headers.cookie',
      'req.headers.authorization',
      'res.headers["set-cookie"]',
      'code',
      'accessToken',
      'access_token',
      'refresh_token',
      'refreshToken',
      '*.code',
      '*.access_token',
      '*.refresh_token',
      '*.accessToken',
      '*.refreshToken',
    ],
    censor: '[Redacted]',
  },
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { translateTime: 'SYS:HH:MM:ss' },
        },
      }
    : {}),
});
