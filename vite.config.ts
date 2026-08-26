import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // 프록시 대상은 앱이 쓰는 API 주소와 반드시 같아야 한다 → .env 에서 그대로 읽는다.
  // (vite.config 는 Node 에서 실행되므로 import.meta.env 가 아니라 loadEnv 를 쓴다)
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const apiTarget = env.VITE_API_BASE_URL || "http://localhost:8080";

  return {
    server: {
      port: 8080,
      /**
       * 실기기(폰) 테스트용 API 프록시.
       *
       * API 서버의 CORS 허용 목록에는 `http://localhost:8080` 만 있어, 폰에서
       * `http://<PC IP>:8080` 으로 접속하면 모든 API 가 preflight 에서 차단된다.
       * 이 프록시를 거치면 브라우저에는 같은 출처 요청이 되고, 실제 호출은
       * dev 서버가 서버 대 서버로 중계하므로 CORS 가 개입하지 않는다.
       *
       * `changeOrigin: true` — 대상 서버가 보는 Host/Origin 을 target 기준으로 바꾼다.
       * localhost 접속 시에는 `API_BASE_URL` 이 절대 URL 이라 이 프록시를 타지 않는다
       * (`src/api/endpoints.ts` 참고).
       */
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          // 브라우저가 붙인 Origin(`http://<PC IP>:8080`)이 그대로 넘어가면 서버가 403 으로 막는다.
          // 중계 요청은 서버 대 서버이므로 Origin/Referer 를 대상 도메인 기준으로 바꿔 보낸다.
          headers: {
            Origin: apiTarget,
            Referer: `${apiTarget}/`,
          },
        },
      },
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    css: {
      postcss: "./postcss.config.js",
    },
  };
});
