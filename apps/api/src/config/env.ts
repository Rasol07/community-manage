import { z } from 'zod';

const snowflake = z.string().regex(/^\d{17,20}$/);

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.url(),
  WEB_ORIGIN: z.url({ protocol: /^https?$/ }),
  DISCORD_CLIENT_ID: snowflake,
  DISCORD_GUILD_ID: snowflake,
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_BOT_TOKEN: z.string().min(1),
  DISCORD_REDIRECT_URI: z.url({ protocol: /^https?$/ }),
  DISCORD_INVITE_URL: z.url({ protocol: /^https?$/ }),
  DISCORD_ADMIN_ROLE_IDS: z
    .string()
    .transform((s) =>
      s
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
    )
    .pipe(z.array(snowflake).min(1)),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  COOKIE_SIGNING_SECRET: z.string().min(32),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('환경 변수 오류:\n' + z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof EnvSchema>;
