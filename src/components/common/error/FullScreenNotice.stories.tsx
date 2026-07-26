import type { Meta, StoryObj } from "@storybook/react-vite";

import FullScreenNotice from "./FullScreenNotice";
import {
  ERROR_SCREEN_APP_HINT,
  ERROR_SCREEN_TEXT,
} from "@/constants/texts/common/errorScreen";

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
  args: { kind: "critical", ...ERROR_SCREEN_TEXT.critical, code: "COMMON-500" },
};

/** 네트워크 실패 — 응답 자체가 없는 경우(timeout / 연결 실패) */
export const Network: Story = {
  args: { kind: "network", ...ERROR_SCREEN_TEXT.network },
};

/** 설정 오류 — API-KEY 문제. 사용자가 고칠 수 없어 앱 종료를 안내한다 */
export const Config: Story = {
  args: {
    kind: "config",
    ...ERROR_SCREEN_TEXT.config,
    code: "A100",
    hint: ERROR_SCREEN_APP_HINT,
  },
};

/**
 * 점검 안내 — 일반 오류와 톤·아이콘이 구분된다.
 * ⚠️ 노출 트리거는 백엔드 대기 상태로, 현재 실제로는 뜨지 않는다.
 */
export const Maintenance: Story = {
  args: { kind: "maintenance", ...ERROR_SCREEN_TEXT.maintenance },
};

/** 렌더 예외 — AppErrorBoundary 폴백 */
export const Render: Story = {
  args: { kind: "render", ...ERROR_SCREEN_TEXT.render },
};
