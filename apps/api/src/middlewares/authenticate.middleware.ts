// 검증 관련 미들웨어

import type { RequestHandler } from 'express';
import {
  ACCESS_COOKIE,
  type TokenProvider,
} from '../modules/auth/token.provider';
import { UnauthorizedError } from '../errors';

export const createAuthenticate = (
  tokenProvider: TokenProvider,
): RequestHandler => {
  return async (req, _res, next) => {
    const token = req.cookies[ACCESS_COOKIE];
    if (!token) {
      throw new UnauthorizedError();
    }

    const result = await tokenProvider.verifyAccess(token);
    if (result.ok === false) {
      if (result.reason === 'expired')
        throw new UnauthorizedError(
          'TOKEN_EXPIRED',
          '로그인이 만료되었습니다.',
        );
      throw new UnauthorizedError('UNAUTHENTICATED');
    }

    req.auth = {
      userId: result.payload.userId,
      role: result.payload.role,
    };
    next();
  };
};
