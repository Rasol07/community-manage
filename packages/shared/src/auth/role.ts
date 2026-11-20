import { z } from 'zod';

export const Role = z.enum(['ADMIN', 'MEMBER']);

export type Role = z.infer<typeof Role>;
