import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { server } from './mocks/server';
import { db } from '../src/lib/db';

// 테스트 시작 전: 가로채기 시작.
// 가짜 응답을 정하지 않은 바깥 요청이 나가면 에러로 만들어서, 실수로 진짜 Discord를 부르는 걸 막는다.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));

// 테스트 하기 전에, 모든 테이블 비워서 다시 실험
beforeEach(async () => {
  await db.execute(
    db.raw.sql`TRUNCATE TABLE "public"."RoleChangeLog", "public"."User" CASCADE`
      .affectedCount()
      .build(),
  );
});

// 테스트 하나 끝날 때마다: 그 테스트가 임시로 바꾼 가짜 응답을 원래대로 되돌린다.
afterEach(() => server.resetHandlers());

// 전부 끝나면: 가로채기 종료.
afterAll(async () => {
  await db.close();
  server.close();
});
