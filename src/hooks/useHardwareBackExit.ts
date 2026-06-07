import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { ROUTES } from "@/constants/routes";
import { useNativeBack } from "@/utils/nativeBackHandler";

/**
 * 메인(홈)에서 하드웨어 백 더블탭 종료.
 *
 * - 홈일 때만 백 핸들러를 등록 → 첫 번째 백: 토스트 안내 + 2초 타이머,
 *   2초 내 두 번째 백: window.BarogagiApp.exitApp()로 종료 위임.
 * - 홈이 아니면 등록하지 않음 → nativeBackHandler의 기존 fallback
 *   (history.back → 갈 곳 없으면 exitApp)이 그대로 동작.
 * - 모달이 열려 있으면 모달의 useNativeBack 핸들러가 stack 위에 올라가 우선 처리됨.
 *
 * Layout(앱 생애 1회 마운트, Router 내부)에서 호출한다.
 */
const EXIT_CONFIRM_WINDOW_MS = 2000;

export const useHardwareBackExit = () => {
  const { pathname } = useLocation();
  const isHome = pathname === ROUTES.MAIN.HOME;

  const exitArmedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHomeBack = () => {
    if (exitArmedRef.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      exitArmedRef.current = false;
      window.BarogagiApp?.exitApp();
      return;
    }
    exitArmedRef.current = true;
    toast("한 번 더 누르면 종료됩니다");
    timerRef.current = setTimeout(() => {
      exitArmedRef.current = false;
      timerRef.current = null;
    }, EXIT_CONFIRM_WINDOW_MS);
  };

  // 홈일 때만 등록
  useNativeBack(isHome, handleHomeBack);

  // 홈을 벗어나면 대기 상태/타이머 초기화
  useEffect(() => {
    if (!isHome && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      exitArmedRef.current = false;
    }
  }, [isHome]);

  // 언마운트 정리
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );
};
