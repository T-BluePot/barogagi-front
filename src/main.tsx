import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./globals.css";
import App from "./App.tsx";
// === http & interceptor ===
import "@/api/http.ts";
import { queryClient } from "./lib/queryClient";
import { initNativeBackHandler } from "@/utils/nativeBackHandler";
import { bootstrapTokens } from "@/lib/auth/tokenCache";

initNativeBackHandler();

import "react-datepicker/dist/react-datepicker.css";
import "./components/main/plan/calendar.css";

// 토큰 cache hydration 완료 후 React 트리 마운트.
// 라우트 가드(PrivateRoute, RootRedirect)와 axios 인터셉터가 동기적으로 토큰을 읽으므로,
// 부팅 시점에 cache가 채워져 있어야 잘못된 redirect/요청이 발생하지 않음.
bootstrapTokens().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              fontFamily:
                "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
              borderRadius: "20px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
});
