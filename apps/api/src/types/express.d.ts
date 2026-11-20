import type { Role } from '@community/shared';

// Express 내의 typexs 지원에는 Request 쪽에 내가 원하는 방향의 auth 같은 거 없어서
// 이걸 내 입맛대로 조절했다.
declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; role: Role };
    }
  }
}
