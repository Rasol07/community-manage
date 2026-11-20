import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');

// test DB 에서만 작동되야 하는 거나 url 변경을 용이하게 하기 위해 작성
const connection =
  process.env['PRISMA_DB'] === 'test'
    ? process.env['TEST_DATABASE_URL']
    : process.env['DATABASE_URL'];

export default definePrismaConfig({
  orm: ormConfig({
    contract: './prisma/contract.prisma',
    db: {
      connection: connection!,
    },
  }),
  skills: {
    check: false,
  },
});
