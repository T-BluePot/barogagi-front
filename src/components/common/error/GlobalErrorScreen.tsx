import FullScreenNotice from "./FullScreenNotice";
import { useCriticalErrorStore } from "@/stores/criticalErrorStore";
import {
  ERROR_SCREEN_APP_ACTION_LABEL,
  ERROR_SCREEN_APP_HINT,
  ERROR_SCREEN_TEXT,
} from "@/constants/texts/common/errorScreen";
import { isAppExitAction, reloadPage, restartApp } from "@/utils/restartApp";
import { useNativeBack } from "@/utils/nativeBackHandler";

/**
 * 전역 오류 화면
 * - App.tsx 에 마운트해 어디서든 store 를 통해 전체화면 오류를 표시한다.
 * - 표시 조건은 `criticalErrorStore` 의 kind 뿐이다 (axios 인터셉터가 raise 한다).
 *
 * ⚠️ 하드웨어 백을 빈 handler 로 가로채면 사용자가 화면에 **갇힌다**
 *    (`useHardwareBackExit` 의 홈 더블탭 종료가 handlerStack 아래로 밀린다).
 *    → 백도 복구 액션(restartApp)으로 매핑한다.
 */
const GlobalErrorScreen = () => {
  // 셀렉터로 구독 범위를 좁힌다 — 스토어 전체를 구독하면 raise/clear 참조 변경에도 리렌더된다
  const kind = useCriticalErrorStore((s) => s.kind);
  const code = useCriticalErrorStore((s) => s.code);

  // 오류가 떠 있는 동안만 백을 가로챈다 (kind === null 이면 등록되지 않음)
  useNativeBack(kind !== null, restartApp);

  if (kind === null) return null;

  const text = ERROR_SCREEN_TEXT[kind];

  // 점검은 "끝났는지 다시 확인"이 목적이라 앱을 종료하지 않고 새로고침만 한다.
  // ⚠️ 노출 트리거는 아직 없다 — classifyApiError 는 maintenance 를 반환하지 않는다.
  const isMaintenance = kind === "maintenance";

  // 앱은 액션이 "앱 종료"라 웹의 "다시 시도"(새로고침)와 동작이 다르다 → 라벨/안내를 바꾼다
  const isAppExit = !isMaintenance && isAppExitAction();

  return (
    <FullScreenNotice
      kind={kind}
      title={text.TITLE}
      description={text.DESCRIPTION}
      actionLabel={isAppExit ? ERROR_SCREEN_APP_ACTION_LABEL : text.ACTION_LABEL}
      onAction={isMaintenance ? reloadPage : restartApp}
      code={code}
      hint={isAppExit ? ERROR_SCREEN_APP_HINT : undefined}
    />
  );
};

export default GlobalErrorScreen;
