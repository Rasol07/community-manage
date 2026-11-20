// 오 인자 4개짜리 미들웨어는 무조건 에러 핸들러구나
// 그래서 next(error)하면 뭘하든 여기로 바로 오는구낭

import type { ErrorRequestHandler } from 'express';
import { AppError, ValidationError } from '../errors';
import { type ErrorResponse } from '@community/shared';
import { z, ZodError } from 'zod';
import { logger } from '../lib/logger';

// 에러 종류가
// prisma
// zod schema
// http exception
// 500 짜리 뭐 이상한거

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    const body: ErrorResponse = {
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    return res.status(err.status).json(body);
  }

  if (err instanceof ZodError) {
    const validation = new ValidationError(z.treeifyError(err));

    const body: ErrorResponse = {
      error: {
        code: validation.code,
        message: validation.message,
        details: validation.details,
      },
    };
    return res.status(validation.status).json(body);
  }

  // 그 외의 에러들
  logger.error({ err }, '처리되지 않은 에러');

  // 이거는 사용자에게 보여져야할 것
  const body: ErrorResponse = {
    error: {
      code: 'INTERNAL',
      message: '서버 오류가 발생했습니다.',
      details: null,
    },
  };

  res.status(500).json(body);
};
