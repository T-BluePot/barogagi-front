import type { Meta, StoryObj } from "@storybook/react-vite";

import FullScreenNotice from "./FullScreenNotice";
import type { CriticalErrorKind } from "@/stores/criticalErrorStore";
import {
  ERROR_SCREEN_APP_HINT,
  ERROR_SCREEN_TEXT,
} from "@/constants/texts/common/errorScreen";

/**
 * 문구 상수(UPPER_SNAKE 키) → 컴포넌트 props(camelCase) 매핑.
 *
 * ⚠️ `...ERROR_SCREEN_TEXT.critical` 로 스프레드하면 안 된다 —
 *    키가 `TITLE`/`DESCRIPTION`/`ACTION_LABEL` 이라 props 와 하나도 매칭되지 않는데,
 *    스프레드는 TS 초과 속성 검사를 통과해서 빌드도 잡아주지 못한다(텍스트가 조용히 사라진다).
 */
const textArgs = (kind: Exclude<CriticalErrorKind, null>) => {
  const text = ERROR_SCREEN_TEXT[kind];
  return {
    kind,
    title: text.TITLE,
    description: text.DESCRIPTION,
    actionLabel: text.ACTION_LABEL,
  };
};

const meta: Meta<typeof FullScreenNotice> = {
  title: "Components/Common/Error/FullScreenNotice",
  component: FullScreenNotice,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onAction: () => console.log("action"),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 서버 장애 — HTTP 5xx / COMMON-500. CS 추적용 코드를 병기한다 */
export const Critical: Story = {
  args: { ...textArgs("critical"), code: "COMMON-500" },
};

/** 네트워크 실패 — 응답 자체가 없는 경우(timeout / 연결 실패) */
export const Network: Story = {
  args: textArgs("network"),
};

/**
 * 설정 오류 — API-KEY 문제. 사용자가 고칠 수 없어 앱 종료를 안내한다.
 * 앱(WebView) 환경에서만 붙는 보조 안내를 함께 노출한 상태.
 */
export const Config: Story = {
  args: {
    ...textArgs("config"),
    code: "A100",
    hint: ERROR_SCREEN_APP_HINT,
  },
};

/**
 * 점검 안내 — 일반 오류와 톤·아이콘이 구분된다.
 * ⚠️ 노출 트리거는 백엔드 대기 상태로, 현재 실제 앱에서는 뜨지 않는다.
 */
export const Maintenance: Story = {
  args: textArgs("maintenance"),
};

/** 렌더 예외 — AppErrorBoundary 폴백 */
export const Render: Story = {
  args: textArgs("render"),
};
