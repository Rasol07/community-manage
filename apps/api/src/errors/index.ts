import type { ErrorCode } from '@community/shared';

export class AppError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details: unknown;

  constructor(
    status: number,
    code: ErrorCode,
    message: string,
    details: unknown = null,
  ) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type UnauthorizedCode = Extract<
  ErrorCode,
  'UNAUTHENTICATED' | 'TOKEN_EXPIRED' | 'REFRESH_INVALID' | 'NOT_GUILD_MEMBER'
>;

export class UnauthorizedError extends AppError {
  constructor(
    code: UnauthorizedCode = 'UNAUTHENTICATED',
    message = '로그인이 필요합니다.',
  ) {
    super(401, code, message);
  }
}

type ForbiddenCode = Extract<ErrorCode, 'FORBIDDEN' | 'FORBIDDEN_ORIGIN'>;

export class ForbiddenError extends AppError {
  constructor(code: ForbiddenCode = 'FORBIDDEN', message = '권한이 없습니다.') {
    super(403, code, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = '찾을 수 없습니다.') {
    super(404, 'NOT_FOUND', message);
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown, message = '입력값이 올바르지 않습니다.') {
    super(400, 'VALIDATION_FAILED', message, details);
  }
}
