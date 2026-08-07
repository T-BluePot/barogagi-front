/** 빠른 이동 대상 분 값 (2자리 0패딩 — MINUTES 목록과 동일 포맷) */
const QUICK_MINUTES = ["00", "30"] as const;

interface MinuteQuickButtonsProps {
  /** 현재 선택된 분 (활성 표시용, 2자리 0패딩) */
  value: string;
  /** 버튼을 누르면 해당 분으로 이동 */
  onSelect: (minute: string) => void;
  /** 스크린리더용 접두사 ("시작" / "종료") */
  labelPrefix: string;
}

/**
 * 분 칸을 0분·30분으로 한 번에 이동시키는 보조 버튼.
 * - 분은 60칸이라 드래그/휠로 정시·반시간까지 가는 비용이 커서 지름길을 둔다.
 * - 시간 그룹의 오른쪽 끝(= 분 칸)에 맞춰 정렬되도록 justify-end 로 붙인다.
 */
export const MinuteQuickButtons = ({
  value,
  onSelect,
  labelPrefix,
}: MinuteQuickButtonsProps) => (
  <div className="flex justify-end gap-1.5">
    {QUICK_MINUTES.map((minute) => {
      const isActive = value.padStart(2, "0") === minute;
      return (
        <button
          key={minute}
          type="button"
          aria-label={`${labelPrefix} 분을 ${Number(minute)}분으로`}
          aria-pressed={isActive}
          onClick={() => onSelect(minute)}
          className={`typo-tag flex h-6 items-center justify-center rounded-full border px-2 transition-colors cursor-pointer touch-none ${
            isActive
              ? "border-peach-border bg-peach-light font-semibold text-peach-text"
              : "border-gray-20 bg-gray-white text-gray-60 active:bg-gray-10"
          }`}
        >
          {minute}분
        </button>
      );
    })}
  </div>
);

export default MinuteQuickButtons;
