import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { errorHandler } from '../../src/middlewares/error-handler.middleware';
import { verifyOrigin } from '../../src/middlewares/verify-origin.middleware';

const app = express();
app.use(verifyOrigin);
app.all('/test', (_req, res) => {
  res.json({ ok: true });
});
app.use(errorHandler);

describe('verifyOrigin', () => {
  it('GET 요청은 헤더가 없어도 통과한다', async () => {
    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
  });
  it('POST에서 Origin이 WEB_ORIGIN과 같으면 통과한다', async () => {
    const res = await request(app)
      .post('/test')
      .set('Origin', 'http://localhost:3000');
    expect(res.status).toBe(200);
  });
  it('POST에서 Origin이 다르면 403 FORBIDDEN_ORIGIN', async () => {
    const res = await request(app)
      .post('/test')
      .set('Origin', 'http://localhost:3003');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN_ORIGIN');
  });
  it('POST에서 비슷한 도메인(localhost:3000.evil.com)도 막는다', async () => {
    const res = await request(app)
      .post('/test')
      .set('Origin', 'http://localhost:3000.evil.com');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN_ORIGIN');
  });
  it('Origin이 없으면 Referer의 origin으로 판단한다', async () => {
    const res = await request(app)
      .post('/test')
      .set('Referer', 'http://localhost:3000?page=1');
    expect(res.status).toBe(200);
  });
  it('Origin, Referer 둘 다 없으면 403', async () => {
    const res = await request(app).post('/test');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN_ORIGIN');
  });
  it('Referer가 URL 형식이 아니면 500이 아니라 403', async () => {
    const res = await request(app).post('/test').set('Referer', 'ht/:3000');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN_ORIGIN');
  });
});
