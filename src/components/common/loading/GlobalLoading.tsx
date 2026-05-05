import { useLoadingStore } from "@/stores/loadingStore";
import CommonLoading from "./CommonLoading";

/**
 * 전역 로딩 오버레이
 * - App.tsx에 마운트하여 어디서든 store를 통해 로딩을 표시할 수 있습니다.
 * - 화면 전체를 dimmed 처리하고 중앙에 스피너 표시
 */
const GlobalLoading = () => {
  const { isLoading, message } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
      <CommonLoading message={message} />
    </div>
  );
};

export default GlobalLoading;
