import { MAGIC_SCHEDULE_TEXT } from "@/constants/texts/main/plan/magicSchedule";

interface MagicSummaryRowProps {
  label: string;
  value: string;
  /** 해당 선택 단계로 돌아가는 핸들러 */
  onChange: () => void;
}

/**
 * 앞 단계에서 고른 값 한 줄 + 되돌아가는 "변경" 링크.
 *
 * 확인 화면에서 잘못 고른 걸 발견했을 때 뒤로가기를 여러 번 누르지 않게 한다.
 * SectionHeader 를 쓰지 않는 이유: 이 행은 17px 볼드 제목이 아니라
 * 라벨-값이 나란한 목록이라 타이포 위계가 다르다.
 */
const MagicSummaryRow = ({ label, value, onChange }: MagicSummaryRowProps) => (
  <div className="flex items-center gap-4 border-b border-gray-10 py-3.5">
    <span className="w-8 shrink-0 typo-description text-gray-50">{label}</span>
    <span className="min-w-0 flex-1 truncate typo-caption text-gray-90">
      {value}
    </span>
    <button
      type="button"
      onClick={onChange}
      aria-label={`${label} ${MAGIC_SCHEDULE_TEXT.SUMMARY.CHANGE}`}
      className="shrink-0 typo-description text-peach-text"
    >
      {MAGIC_SCHEDULE_TEXT.SUMMARY.CHANGE}
    </button>
  </div>
);

export default MagicSummaryRow;
