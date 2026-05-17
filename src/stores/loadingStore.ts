import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  message?: string;
  isDark: boolean;
  showLoading: (message?: string, isDark?: boolean) => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: undefined,
  isDark: false,
  showLoading: (message, isDark = false) =>
    set({ isLoading: true, message, isDark }),
  hideLoading: () =>
    set({ isLoading: false, message: undefined, isDark: false }),
}));
