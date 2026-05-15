import { useEffect, useRef } from "react";

/**
 * RN 하드웨어 백 버튼 핸들러
 *
 * - RN(Android)에서 BackHandler가 눌리면 WebView로 'HARDWARE_BACK' 메시지를 dispatch.
 * - 처리 우선순위:
 *   1) handlerStack의 top 핸들러 (모달/바텀시트 등 등록된 것)
 *   2) router 뒤로가기 (window.history.back)
 *   3) window.BarogagiApp.exitApp() — 앱 종료 위임
 *
 * 명세: docs/RN_BRIDGE.md §4
 */

type BackHandler = () => void;

const handlerStack: BackHandler[] = [];

const handleHardwareBack = (): void => {
  // 1) 등록된 핸들러 stack 최상단을 우선 실행
  if (handlerStack.length > 0) {
    const top = handlerStack[handlerStack.length - 1];
    top();
    return;
  }
  // 2) 라우터에서 뒤로 갈 페이지가 있으면 history.back
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  // 3) 더 갈 곳이 없으면 앱 종료 위임
  window.BarogagiApp?.exitApp();
};

let initialized = false;

/** 앱 부팅 시 1회 호출. RN으로부터 오는 HARDWARE_BACK 메시지를 구독한다. */
export const initNativeBackHandler = (): void => {
  if (initialized) return;
  initialized = true;

  window.addEventListener("message", (event) => {
    // RN이 dispatch한 MessageEvent.data는 string. JSON 파싱 실패 시 무시.
    if (typeof event.data !== "string") return;
    try {
      const msg = JSON.parse(event.data);
      if (msg?.type === "HARDWARE_BACK") handleHardwareBack();
    } catch {
      // RN 메시지가 아니면 조용히 무시
    }
  });
};

/**
 * 컴포넌트가 활성 상태일 때 하드웨어 백을 가로채는 hook.
 *
 * 사용 예 (모달):
 *   useNativeBack(isOpen, () => closeModal());
 *
 * - isActive가 true인 동안만 핸들러가 stack에 push됨.
 * - 같은 시점에 여러 모달이 열려있으면 가장 최근에 활성화된 것이 우선.
 */
export const useNativeBack = (
  isActive: boolean,
  onBack: BackHandler | undefined
): void => {
  // onBack은 매 렌더마다 새 reference일 수 있으므로 ref로 latest 값 보관.
  // 등록/해제는 isActive(+ onBack 존재 여부) 변화에만 반응 → 모달이 열려있는 동안 push/pop이 반복되지 않음.
  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  // onBack이 undefined면 등록하지 않음 → router back fallback이 자연스럽게 동작.
  const enabled = isActive && !!onBack;

  useEffect(() => {
    if (!enabled) return;
    const handler: BackHandler = () => onBackRef.current?.();
    handlerStack.push(handler);
    return () => {
      const idx = handlerStack.lastIndexOf(handler);
      if (idx >= 0) handlerStack.splice(idx, 1);
    };
  }, [enabled]);
};
