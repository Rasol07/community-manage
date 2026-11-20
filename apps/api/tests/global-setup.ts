import { execSync } from 'node:child_process';

export default function setup() {
  execSync('pnpm db:migrate:test', { stdio: 'inherit' });
}
