import { Role } from '@community/shared';
import { errors, jwtVerify, SignJWT } from 'jose';
import { z } from 'zod';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
export const ACCESS_TTL_SECONDS = 15 * 60;
export const REFRESH_TTL_SECONDS = 14 * 24 * 60 * 60;
export const accessCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
} as const;
export const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/api/auth',
} as const;

export type AccessClaims = {
  userId: string;
  role: Role;
  tokenVersion: number;
};
export type RefreshClaims = {
  userId: string;
  tokenVersion: number;
  iat0: number;
};
export type VerifyResult<T> =
  { ok: true; payload: T } | { ok: false; reason: 'expired' | 'invalid' };

const AccessPayload = z.object({
  sub: z.string(),
  role: Role,
  tokenVersion: z.number().int(),
});
const RefreshPayload = z.object({
  sub: z.string(),
  tokenVersion: z.number().int(),
  iat0: z.number(),
});

export class TokenProvider {
  private readonly accessKey: Uint8Array;
  private readonly refreshKey: Uint8Array;

  // string으로 받아서 1바이트 짜리로 변환하는 과정을 가짐

  constructor(config: { accessKey: string; refreshKey: string }) {
    this.accessKey = new TextEncoder().encode(config.accessKey);
    this.refreshKey = new TextEncoder().encode(config.refreshKey);
  }

  async signAccess({ userId, role, tokenVersion }: AccessClaims) {
    return await new SignJWT({ role, tokenVersion })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(this.accessKey);
  }

  async signRefresh({ userId, tokenVersion, iat0 }: RefreshClaims) {
    return await new SignJWT({ tokenVersion, iat0 })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(iat0 + REFRESH_TTL_SECONDS)
      .sign(this.refreshKey);
  }

  async verifyAccess(token: string): Promise<VerifyResult<AccessClaims>> {
    let result;
    try {
      ({ payload: result } = await jwtVerify(token, this.accessKey, {
        algorithms: ['HS256'],
      }));
    } catch (error) {
      if (error instanceof errors.JWTExpired)
        return { ok: false, reason: 'expired' };
      return { ok: false, reason: 'invalid' };
    }

    // 모양 맞추기
    const parsed = AccessPayload.safeParse(result);
    if (!parsed.success) return { ok: false, reason: 'invalid' };
    return {
      ok: true,
      payload: {
        userId: parsed.data.sub,
        role: parsed.data.role,
        tokenVersion: parsed.data.tokenVersion,
      },
    };
  }

  async verifyRefresh(token: string): Promise<VerifyResult<RefreshClaims>> {
    let result;
    try {
      ({ payload: result } = await jwtVerify(token, this.refreshKey, {
        algorithms: ['HS256'],
      }));
    } catch (error) {
      if (error instanceof errors.JWTExpired)
        return { ok: false, reason: 'expired' };
      return { ok: false, reason: 'invalid' };
    }

    const parsed = RefreshPayload.safeParse(result);
    if (!parsed.success) return { ok: false, reason: 'invalid' };
    return {
      ok: true,
      payload: {
        userId: parsed.data.sub,
        iat0: parsed.data.iat0,
        tokenVersion: parsed.data.tokenVersion,
      },
    };
  }
}
