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
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? '',
    },
  },
});
