// CSRF 잡는 용도로 있나보다.
// Origin이 내가 작성한 WEB_ORIGIN이랑 다르면 나가라 하는거

import type { RequestHandler } from 'express';
import { env } from '../config/env';
import { ForbiddenError } from '../errors';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// WEB_ORIGIN 끝에 '/'가 붙어 있어도 브라우저 Origin("http://host:port")과 비교되도록 정규화
const allowedOrigin = new URL(env.WEB_ORIGIN).origin;

export const verifyOrigin: RequestHandler = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  let origin = req.get('origin');

  if (!origin) {
    const referer = req.get('referer'); // 주소 전체 다 가져오기
    if (!referer) throw new ForbiddenError('FORBIDDEN_ORIGIN');

    // 엉터리 Referer면 new URL()이 TypeError를 던짐 → 500이 아니라 403으로 바꿔서 던진다
    try {
      origin = new URL(referer).origin;
    } catch {
      throw new ForbiddenError('FORBIDDEN_ORIGIN');
    }
  }

  if (origin !== allowedOrigin) throw new ForbiddenError('FORBIDDEN_ORIGIN');
  next();
};
