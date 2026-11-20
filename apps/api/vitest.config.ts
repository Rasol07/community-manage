import { existsSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

// .env 파일 있을 때만 불러와서 할 수 있게 진행
if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    globalSetup: ['./tests/global-setup.ts'],
    fileParallelism: false,
    // 테스트는 .env의 진짜 Discord·비밀키 값과 무관하게 돌아야 한다.
    // 아래는 env.ts 검사를 통과하는 가짜 값 (git에 커밋되므로 진짜 값을 넣지 말 것).
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? '',
      NODE_ENV: 'test',
      PORT: '4000',
      WEB_ORIGIN: 'http://localhost:3000',
      DISCORD_CLIENT_ID: '100000000000000001',
      DISCORD_CLIENT_SECRET: 'test-discord-client-secret',
      DISCORD_REDIRECT_URI: 'http://localhost:3000/api/auth/discord/callback',
      DISCORD_BOT_TOKEN: 'test-discord-bot-token',
      DISCORD_GUILD_ID: '100000000000000002',
      DISCORD_ADMIN_ROLE_IDS: '100000000000000003,100000000000000004',
      DISCORD_INVITE_URL: 'https://discord.gg/test',
      JWT_ACCESS_SECRET: 'test-jwt-access-secret-0123456789abcdef',
      JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-0123456789abcdef',
      COOKIE_SIGNING_SECRET: 'test-cookie-signing-secret-0123456789ab',
    },
  },
});
