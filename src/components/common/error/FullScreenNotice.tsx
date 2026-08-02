import { useEffect, useRef } from "react";
import {
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

import CommonButton from "@/components/common/buttons/CommonButton";
import type { CriticalErrorKind } from "@/stores/criticalErrorStore";
import { ERROR_SCREEN_CODE_LABEL } from "@/constants/texts/common/errorScreen";

type NoticeKind = Exclude<CriticalErrorKind, null>;

interface FullScreenNoticeProps {
  kind: NoticeKind;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  /** CS/QA 추적용 서버 응답 코드. 있으면 작은 글씨로 병기한다 */
  code?: string;
  /** 액션 버튼 아래 덧붙이는 보조 안내 (앱에서 "직접 다시 열어주세요" 등) */
  hint?: string;
}

/**
 * 전체화면 안내 컴포넌트 (오류 / 점검 / 렌더 예외 공용).
 *
 * - `z-9999` 로 헤더·BottomTabBar(`z-30`)·모달(`z-[200]`) 위를 완전히 덮는다.
 *   배경은 반투명이 아니라 **불투명** — 뒤에 깨진 화면이 비치면 안 된다.
 * - ⛔ **router hook 사용 금지.** AppErrorBoundary 의 폴백으로도 렌더되고,
 *   그때는 BrowserRouter 가 죽어 있을 수 있다. 이동이 필요하면 부모가 onAction 으로 넘긴다.
 * - 아이콘: 오류 일러스트 에셋이 아직 없어 heroicons 로 임시 사용한다(디자인 확정 시 교체).
 *   장식 요소이므로 `aria-hidden`.
 */
const FullScreenNotice = ({
  kind,
  title,
  description,
  actionLabel,
  onAction,
  code,
  hint,
}: FullScreenNoticeProps) => {
  // 점검은 사고가 아니라 예정된 작업이므로 아이콘·안내 역할을 구분한다
  const isMaintenance = kind === "maintenance";
  const Icon = isMaintenance ? WrenchScrewdriverIcon : ExclamationTriangleIcon;

  const containerRef = useRef<HTMLDivElement>(null);

  // 화면을 덮기만 하면 포커스는 가려진 뒤쪽 컨트롤에 남는다 → 키보드·스크린리더 사용자가
  // 복구 버튼에 닿지 못한다. 마운트 시 안내 영역으로 포커스를 옮겨 여기서부터 탭이 시작되게 한다.
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="pt-safe pb-safe pl-safe pr-safe fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white px-6 outline-none"
      role={isMaintenance ? "status" : "alert"}
      aria-live={isMaintenance ? "polite" : "assertive"}
    >
      <Icon
        aria-hidden="true"
        className={`mb-6 h-16 w-16 ${
          isMaintenance ? "text-peach-text" : "text-main"
        }`}
      />

      <h1 className="typo-title-02 text-gray-black text-center">{title}</h1>

      <p className="typo-body text-gray-60 mt-3 text-center whitespace-pre-line">
        {description}
      </p>

      {/* CommonButton 이 w-full max-w-xl 이라 그대로 두면 화면 폭 전체로 늘어난다 → 폭 제어 래퍼 */}
      <div className="mt-8 w-full max-w-xs">
        <CommonButton label={actionLabel} onClick={onAction} />
      </div>

      {hint && (
        <p className="typo-description text-gray-50 mt-3 text-center">{hint}</p>
      )}

      {code && (
        <p className="typo-description text-gray-30 mt-6 text-center">
          {ERROR_SCREEN_CODE_LABEL(code)}
        </p>
      )}
    </div>
  );
};

export default FullScreenNotice;
