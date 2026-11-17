import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

// 레포 전체 공통 규칙. Next 전용 규칙은 3단계에서 apps/web/** 에만 추가.
export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/build/',
    '**/out/',
    '**/.next/',
    '**/coverage/',
    '**/next-env.d.ts',
  ]),

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    rules: {
      // 기본 no-unused-vars는 TS 타입을 몰라 오탐 → TS 버전으로 교체
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: 'error',
    },
  },

  // 반드시 마지막: Prettier와 겹치는 포맷 규칙 끄기
  prettier,
]);
