import { useLoadingStore } from "@/stores/loadingStore";
import CommonLoading from "./CommonLoading";

/**
 * 전역 로딩 오버레이
 * - App.tsx에 마운트하여 어디서든 store를 통해 로딩을 표시할 수 있습니다.
 * - isDark: true → 어두운 배경 위 (밝은 오버레이 + 어두운 텍스트)
 * - isDark: false → 밝은 배경 위 (어두운 오버레이 + 밝은 텍스트)
 */
const GlobalLoading = () => {
  const { isLoading, message, srMessage, isDark } = useLoadingStore();

  if (!isLoading) return null;

  return (
    // 오버레이가 떠도 스크린리더에는 아무 일도 일어나지 않는다 — 새로 마운트된
    // 텍스트는 그냥 읽히지 않는다. 진행 안내가 낭독되려면 live region 이어야 한다.
    // 마법봉 생성은 최대 120초라 이게 없으면 그동안 완전히 무음이다.
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-9999 flex items-center justify-center ${
        isDark ? "bg-white/40" : "bg-black/40"
      }`}
    >
      <CommonLoading message={message} srMessage={srMessage} dark={!isDark} />
    </div>
  );
};

export default GlobalLoading;
