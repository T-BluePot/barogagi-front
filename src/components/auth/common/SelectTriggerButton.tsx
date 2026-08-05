import clsx from "clsx";
import { useState } from "react";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface SelectTriggerButtonProps {
  label: string;
  value?: string;
  onClick: () => void;
  /**
   * 라벨 옆에 붙는 `?` 안내 버튼. 넘기지 않으면 렌더하지 않는다.
   * "이 항목을 왜 입력해야 하는지"가 필요한 선택 항목에만 붙인다.
   */
  help?: {
    ariaLabel: string;
    onClick: () => void;
  };
}

/**
 * 바텀시트를 여는 선택 입력 트리거.
 *
 * 구조 주의: 바깥이 `<button>` 이면 안내 버튼을 라벨 옆에 둘 수 없다(버튼 중첩은 무효 HTML).
 * → 컨테이너는 `div` 로 두고, **행 전체를 덮는 투명 버튼**을 뒤에 깔아 탭 영역을 만든다.
 *   표시 영역은 `pointer-events-none` 이라 클릭이 그대로 뒤 버튼에 전달되고,
 *   안내 버튼만 `pointer-events-auto` 로 되살려 자기 클릭을 가져간다.
 */
export const SelectTriggerButton = ({
  label,
  value,
  onClick,
  help,
}: SelectTriggerButtonProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerClass = clsx(
    "relative flex w-full h-[60px] items-center justify-between border-b transition-colors duration-300",
    isFocused ? " border-main" : " border-gray-20"
  );

  // 값이 있으면 라벨이 캡션으로 작아지고, 없으면 플레이스홀더처럼 본문 크기로 보인다
  const labelClass = clsx(
    value ? "typo-tag" : "typo-body",
    isFocused ? " text-peach-text" : " text-gray-50"
  );

  return (
    <div className={containerClass}>
      {/* 행 전체 탭 영역. 아이콘·값이 별도 요소라 이름을 직접 준다.
          고른 값도 함께 읽어준다 — 라벨만 읽으면 낭독기 사용자는
          이미 선택된 값이 무엇인지 알 수 없다 */}
      <button
        type="button"
        onClick={onClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label={value ? `${label}: ${value}` : label}
        className="absolute inset-0 focus:outline-none"
      />

      {/* 표시 영역 — 클릭은 뒤 버튼이 받는다 (relative 로 뒤 버튼 위에 그린다) */}
      <div className="pointer-events-none relative flex w-full flex-col items-start gap-1 px-3">
        <div className="flex items-center gap-1">
          <span className={labelClass}>{label}</span>
          {help && (
            <button
              type="button"
              onClick={help.onClick}
              aria-label={help.ariaLabel}
              /**
               * 정렬 주의 2가지:
               * 1. 버튼 박스를 라벨 line-height 와 같게 고정한다(h-4 = 16px = --leading-tag).
               *    패딩으로 탭 영역을 키우면 그 높이가 줄 높이를 밀어 라벨이 위로 어긋난다.
               *    → 탭 영역은 레이아웃에 영향 없는 ::after 오버레이로 넓힌다.
               * 2. 아이콘 크기는 라벨을 따라간다 — 값이 있으면 라벨이 typo-tag(12px)로
               *    작아지는데 아이콘만 그대로면 혼자 커 보인다.
               */
              className="pointer-events-auto relative flex h-4 w-4 items-center justify-center text-gray-40 transition-colors after:absolute after:-inset-2 after:content-[''] hover:text-peach-text"
            >
              <HelpOutlineIcon
                sx={{ fontSize: value ? 13 : 15, display: "block" }}
              />
            </button>
          )}
        </div>
        {value && <span className="typo-body text-gray-black">{value}</span>}
      </div>

      <div
        className={`pointer-events-none relative transition-transform duration-360 ${
          isFocused ? "rotate-180" : "rotate-0"
        }`}
      >
        <KeyboardArrowUpIcon className="text-gray-60" />
      </div>
    </div>
  );
};
