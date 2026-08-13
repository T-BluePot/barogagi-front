/** 빠른 이동 대상 분 값 (2자리 0패딩 — MINUTES 목록과 동일 포맷) */
const QUICK_MINUTES = ["00", "30"] as const;

interface MinuteQuickButtonsProps {
  /** 버튼을 누르면 해당 분으로 이동 */
  onSelect: (minute: string) => void;
  /** 스크린리더용 접두사 ("시작" / "종료") */
  labelPrefix: string;
}

/**
 * 분 칸을 0분·30분으로 한 번에 이동시키는 보조 버튼.
 * - 분은 60칸이라 드래그/휠로 정시·반시간까지 가는 비용이 커서 지름길을 둔다.
 * - 선택 상태를 가지지 않는 단순 이동 버튼이다 (현재 값 표시는 분 칸이 담당).
 * - 시간 그룹의 오른쪽 끝(= 분 칸)에 맞춰 정렬되도록 justify-end 로 붙인다.
 * - 높이 24px 알약형. 정원(32px)도 검토했지만 모달 세로를 16px 더 먹어서 되돌렸다.
 *   "분" 단위를 노출해 옆 칸(시)의 두 자리 숫자와 혼동되지 않게 한다.
 */
export const MinuteQuickButtons = ({
  onSelect,
  labelPrefix,
}: MinuteQuickButtonsProps) => (
  <div className="flex justify-end gap-2">
    {QUICK_MINUTES.map((minute) => (
      <button
        key={minute}
        type="button"
        aria-label={`${labelPrefix} 분을 ${Number(minute)}분으로`}
        onClick={() => onSelect(minute)}
        className="typo-tag flex h-6 items-center justify-center rounded-full bg-gray-white px-2.5 text-gray-70 shadow-raised transition-all duration-150 ease-fitpl cursor-pointer active:scale-95 active:shadow-raised-pressed"
      >
        {minute}분
      </button>
    ))}
  </div>
);

export default MinuteQuickButtons;
