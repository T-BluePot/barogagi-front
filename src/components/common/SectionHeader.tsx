import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  /**
   * 타이틀 아래 보조 설명 — 없으면 렌더되지 않음.
   * 구분선 등을 넣을 수 있도록 문자열이 아니라 노드를 받는다.
   */
  subtitle?: ReactNode;
  /** 우측 텍스트 액션 (예: "전체보기") — onAction과 함께 지정 시 노출 */
  actionLabel?: string;
  /** 우측 아이콘 액션 — 아이콘만 노출되므로 actionAriaLabel을 반드시 함께 지정 */
  actionIcon?: ReactNode;
  actionAriaLabel?: string;
  onAction?: () => void;
}

/**
 * 섹션 헤더 공통 컴포넌트
 * - 좌측 타이틀(17px 700) + 우측 액션(텍스트 12px 500 또는 아이콘, 코랄)
 * - actionIcon이 있으면 아이콘 액션이 우선
 * - subtitle은 선택 — 넘기지 않으면 기존 레이아웃과 완전히 동일하다
 */
const SectionHeader = ({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  actionAriaLabel,
  onAction,
}: SectionHeaderProps) => {
  return (
    <div className="mb-3 flex w-full items-center justify-between gap-2">
      <div className="flex min-w-0 flex-col">
        <h2 className="truncate text-[17px] font-bold tracking-[-0.02em] text-gray-black">
          {title}
        </h2>
        {subtitle && (
          <div className="mt-0.5 min-w-0 text-[11px] font-medium text-gray-50">
            {subtitle}
          </div>
        )}
      </div>
      {onAction && actionIcon ? (
        <button
          type="button"
          aria-label={actionAriaLabel}
          onClick={onAction}
          className="flex h-7 w-7 items-center justify-center text-peach-text"
        >
          {actionIcon}
        </button>
      ) : onAction && actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-medium text-peach-text"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default SectionHeader;
