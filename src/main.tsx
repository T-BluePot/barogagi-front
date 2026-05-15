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

initNativeBackHandler();

import "react-datepicker/dist/react-datepicker.css";
import "./components/main/plan/calendar.css";

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
