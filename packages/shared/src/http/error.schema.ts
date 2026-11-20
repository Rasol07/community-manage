import { z } from 'zod';

export const ErrorCode = z.enum([
  'UNAUTHENTICATED',
  'TOKEN_EXPIRED',
  'REFRESH_INVALID',
  'NOT_GUILD_MEMBER',
  'FORBIDDEN',
  'FORBIDDEN_ORIGIN',
  'NOT_FOUND',
  'VALIDATION_FAILED',
  'INTERNAL',
]);

export const ErrorResponse = z.object({
  error: z.object({
    code: ErrorCode,
    message: z.string().min(1),
    details: z.unknown().nullable(),
  }),
});

export type ErrorCode = z.infer<typeof ErrorCode>;
export type ErrorResponse = z.infer<typeof ErrorResponse>;
