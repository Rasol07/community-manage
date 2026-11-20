import { http, passthrough } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  http.all('http://127.0.0.1:*/*', () => passthrough()),
);
