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
import { initMobileDebugConsole } from "@/lib/mobileDebugConsole";
import AppErrorBoundary from "@/components/common/error/AppErrorBoundary";
import { ERROR_SCREEN_TEXT } from "@/constants/texts/common/errorScreen";

initNativeBackHandler();
// 모바일에서 console 로그를 확인하기 위한 디버그 콘솔(개발 모드 또는 ?debug 쿼리)
void initMobileDebugConsole();

import "react-datepicker/dist/react-datepicker.css";
import "./components/main/plan/calendar.css";

/**
 * 최후의 폴백.
 * React 트리를 마운트조차 못 한 경우(root 엘리먼트 부재 등) 흰 화면 대신 정적 안내를 띄운다.
 * ErrorBoundary 는 React 트리 **안**의 예외만 잡으므로 이 경로가 따로 필요하다.
 */
const renderBootFailure = (): void => {
  const { TITLE, DESCRIPTION } = ERROR_SCREEN_TEXT.render;
  document.body.innerHTML = `
    <div class="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 class="typo-title-02 text-gray-black">${TITLE}</h1>
      <p class="typo-body text-gray-60 mt-3 whitespace-pre-line">${DESCRIPTION}</p>
    </div>`;
};

// 토큰 cache hydration 완료 후 React 트리 마운트.
// 라우트 가드(PrivateRoute, RootRedirect)와 axios 인터셉터가 동기적으로 토큰을 읽으므로,
// 부팅 시점에 cache가 채워져 있어야 잘못된 redirect/요청이 발생하지 않음.
bootstrapTokens().finally(() => {
  try {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          {/* 렌더 예외를 잡는다. BrowserRouter 가 App 내부에 있어 라우트·페이지 예외까지 커버된다 */}
          <AppErrorBoundary>
            <App />
          </AppErrorBoundary>
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            // bottom-center 토스트가 폰 하단바(제스처 바)에 가리지 않도록 safe-area 만큼 올림
            containerStyle={{
              bottom:
                "calc(24px + max(env(safe-area-inset-bottom, 0px), var(--sai-bottom, 0px)))",
            }}
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
  } catch (error) {
    console.error("[main] React 트리 마운트 실패", error);
    renderBootFailure();
  }
});
