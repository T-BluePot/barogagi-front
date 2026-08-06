import type { CriticalErrorKind } from "@/stores/criticalErrorStore";

/** 전체화면 안내 1건의 문구 구성 */
export interface ErrorScreenText {
  TITLE: string;
  DESCRIPTION: string;
  ACTION_LABEL: string;
}

/**
 * 오류/점검 전체화면 문구.
 *
 * - 백엔드 message 는 그대로 노출하지 않는다. 실측 응답이 "서버 오류가 발생했습니다." 수준이라
 *   사용자 가치가 낮다. 프론트 고정 문구를 쓰고, `code` 만 작은 글씨로 병기해 CS/QA 추적을 돕는다.
 * - ⚠️ Android 는 `exitApp` 후 자동 재실행이 불가하다 → 앱 문구에는 "직접 다시 열어주세요" 를 반드시 넣는다.
 * - 카피 규칙: 존댓말 요-체(`~어요 / ~세요`). 단정형 `~다` 금지 (`.claude/design/DESIGN.md` §10)
 */
export const ERROR_SCREEN_TEXT = {
  /** 서버 장애 (HTTP 5xx / COMMON-500) */
  critical: {
    TITLE: "잠시 문제가 생겼어요",
    DESCRIPTION:
      "서버에 일시적인 오류가 발생했어요.\n잠시 후 다시 이용해주세요.",
    ACTION_LABEL: "다시 시도",
  },
  /** 응답 자체가 없음 (timeout / 연결 실패) */
  network: {
    TITLE: "연결이 불안정해요",
    DESCRIPTION: "네트워크 상태를 확인한 뒤\n다시 시도해주세요.",
    ACTION_LABEL: "다시 시도",
  },
  /** API-KEY 등 클라이언트 설정 오류 — 사용자가 고칠 수 없다 */
  config: {
    TITLE: "앱을 실행할 수 없어요",
    DESCRIPTION:
      "서비스 설정에 문제가 있어요.\n앱을 완전히 종료한 뒤 다시 열어주세요.",
    ACTION_LABEL: "앱 종료하기",
  },
  /**
   * 점검 안내.
   * ⚠️ 문구·UI 만 준비된 상태다 — 노출 트리거는 백엔드 대기.
   * 톤을 일반 오류와 구분한다(사고가 아니라 예정된 작업이므로 사과보다 안내).
   * 액션도 다르다 — 앱 종료가 아니라 "점검이 끝났는지 다시 확인"이 목적이다.
   */
  maintenance: {
    TITLE: "서비스 점검 중이에요",
    DESCRIPTION:
      "더 나은 서비스를 위해 점검하고 있어요.\n점검이 끝나면 바로 이용할 수 있어요.",
    ACTION_LABEL: "다시 확인",
  },
  /** 렌더 예외 (ErrorBoundary 폴백) */
  render: {
    TITLE: "화면을 표시할 수 없어요",
    DESCRIPTION: "예상치 못한 오류가 발생했어요.\n앱을 다시 실행해주세요.",
    ACTION_LABEL: "다시 시도",
  },
} as const satisfies Record<Exclude<CriticalErrorKind, null>, ErrorScreenText>;

/**
 * 앱(WebView)에서만 덧붙이는 안내.
 * Android 는 `exitApp` 후 자동 재실행이 불가해서 사용자가 직접 열어야 한다.
 */
export const ERROR_SCREEN_APP_HINT = "앱이 닫히면 직접 다시 열어주세요.";

/** 앱(WebView)에서의 액션 라벨 — 웹의 "다시 시도"(새로고침)와 동작이 다르다 */
export const ERROR_SCREEN_APP_ACTION_LABEL = "앱 종료하기";

/** CS/QA 추적용 코드 병기 라벨 */
export const ERROR_SCREEN_CODE_LABEL = (code: string) => `오류 코드 ${code}`;
