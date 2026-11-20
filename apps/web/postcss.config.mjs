const config = {
  // 쓴 css를 플러그인을 통해 브라우저가 실제로 받는 css로 변환시켜줌
  // 그 플러그인으로 tailwind 설정해둠
  // next 쪽은 무조건 postCSS 파일처리할 떄 거치게 되어있어서 그쪽에서 처리할 건 없음.
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
