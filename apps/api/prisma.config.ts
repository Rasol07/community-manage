import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');

export default definePrismaConfig({
  orm: ormConfig({
    contract: './prisma/contract.prisma',
  }),
  skills: {
    check: false,
  },
});
