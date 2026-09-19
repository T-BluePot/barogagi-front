import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  /** 배열로 넘기면 타이핑 효과로 순환한다(TypingText). 문자열이면 그대로 한 줄 표시. */
  message?: string | string[];
  /** 순환 문구를 쓸 때 스크린리더에 읽힐 고정 문구 */
  srMessage?: string;
  isDark: boolean;
  showLoading: (
    message?: string | string[],
    isDark?: boolean,
    srMessage?: string
  ) => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: undefined,
  srMessage: undefined,
  isDark: false,
  showLoading: (message, isDark = false, srMessage) =>
    set({ isLoading: true, message, isDark, srMessage }),
  hideLoading: () =>
    set({
      isLoading: false,
      message: undefined,
      srMessage: undefined,
      isDark: false,
    }),
}));
