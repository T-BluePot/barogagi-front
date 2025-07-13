import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 뒤로가기 방지 훅
 * @param onBack Optional - 뒤로가기 시 실행할 콜백 함수 (예: 상태 감소, 특정 페이지 이동 등)
 */
export const useBlockBackNavigation = (onBack?: () => void) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 URL을 히스토리에 추가 → 뒤로가기를 누르면 popstate 발생하게 함
    history.pushState(null, "", window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault(); // 기본 뒤로가기 동작 막기

      if (onBack) {
        onBack(); // 사용자 정의 동작 실행
      } else {
        // 기본 동작: 뒤로가기를 눌러도 현재 페이지 유지
        history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onBack, navigate]);
};
