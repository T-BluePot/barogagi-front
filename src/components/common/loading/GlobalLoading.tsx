import { useLoadingStore } from "@/stores/loadingStore";
import CommonLoading from "./CommonLoading";

/**
 * 전역 로딩 오버레이
 * - App.tsx에 마운트하여 어디서든 store를 통해 로딩을 표시할 수 있습니다.
 * - isDark: true → 어두운 배경 위 (밝은 오버레이 + 어두운 텍스트)
 * - isDark: false → 밝은 배경 위 (어두운 오버레이 + 밝은 텍스트)
 */
const GlobalLoading = () => {
  const { isLoading, message, isDark } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center ${
        isDark ? "bg-white/40" : "bg-black/40"
      }`}
    >
      <CommonLoading message={message} dark={!isDark} />
    </div>
  );
};

export default GlobalLoading;
