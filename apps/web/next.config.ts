import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // nginx 가 없는 상태에서 분리해서 보내주는 역할
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return [];

    return [
      {
        source: '/api/:path*', // 들어온 요청 방향
        destination: 'http://localhost:4000/api/:path*', // 그 요청을 어디서 처리할 지 도착지
      },
    ];
  },
};

export default nextConfig;
