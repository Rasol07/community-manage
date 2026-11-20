import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import rootConfig from '../../eslint.config.mjs';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...rootConfig,
  {
    // App router는 페이지 개념으로 작동되지 않아 해당 옵션 제거
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
