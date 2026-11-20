import { describe, expect, it } from 'vitest';

describe('테스트 환경', () => {
  it('Vitest가 동작', () => {
    expect(1 + 1).toBe(2);
  });
  //   it('가짜 응답 없는 경우 바깥 요청 막히기', async () => {
  //     await expect(
  //       fetch('https://discord.com/api/v10/users/@me'),
  //     ).rejects.toThrow();
  //   });
});

// 예견되는 상황들을 다 적고 유닛테스트 하는 용도구나.
