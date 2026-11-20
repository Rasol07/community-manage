import type { Role } from '@community/shared';
import type { RequestHandler } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors';

// 아마도 필요한 롤 같은 거 검증하는 미들웨어 겠지요?
export const requireRole = (role: Role): RequestHandler => {
  return (req, _res, next) => {
    // req.auth가 없는 경우 : unauth
    // req.auth 있고, 그 값에서 role이 내가 원하는 값과 들어온 값이 다르면 forbidden
    if (!req.auth) throw new UnauthorizedError('UNAUTHENTICATED');
    if (req.auth.role !== role)
      throw new ForbiddenError('FORBIDDEN', '접근 권한이 없습니다.');
    next();
  };
};
