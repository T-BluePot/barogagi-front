interface HomeScheduleCardProps {
  /** 날짜 열 상단 (예: "4.25") */
  dateLabel: string;
  /** 날짜 열 하단 (예: "~ 4.26") — 종료일이 시작일과 다를 때만 */
  dateSubLabel?: string;
  title: string;
  /** 메타 줄 (예: "# 데이트 · # 서울") */
  meta?: string;
  /** 진행 중이면 배경을 peach-light로 */
  isOngoing?: boolean;
  /** 우측 상단 뱃지 (예: "예시") — mock 카드 구분용 */
  badgeLabel?: string;
  onClick: () => void;
}

/**
 * 홈 "나의 일정" 카드 (디자인 레퍼런스 §6 ScheduleCard)
 * - 좌측 날짜 열(52px) + 세로 peach 바 + 본문(제목/메타)
 * - 일정에 시각 정보가 없어 레퍼런스의 "시간 열"을 "날짜 열"로 변형
 * - 표시 전용 컴포넌트: 데이터 가공은 상위(MyScheduleSection)가 담당
 */
const HomeScheduleCard = ({
  dateLabel,
  dateSubLabel,
  title,
  meta,
  isOngoing = false,
  badgeLabel,
  onClick,
}: HomeScheduleCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-3 rounded-xl border border-peach-border px-3.5 py-[13px] text-left ${
        isOngoing ? "bg-peach-light" : "bg-white"
      }`}
    >
      {/* 날짜 열 (52px 고정) */}
      <div className="w-13 shrink-0">
        <p className="text-[13px] font-semibold tracking-[-0.02em] text-peach-text">
          {dateLabel}
        </p>
        {dateSubLabel && (
          <p className="mt-0.5 text-[10px] font-medium text-gray-50">
            {dateSubLabel}
          </p>
        )}
      </div>

      {/* 세로 바 */}
      <div className="w-0.5 self-stretch rounded-full bg-peach" />

      {/* 본문 */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-black">{title}</p>
        {meta && (
          <p className="mt-[3px] truncate text-[11px] font-medium text-gray-50">
            {meta}
          </p>
        )}
      </div>

      {/* 뱃지 (mock 예시 카드 구분) */}
      {badgeLabel && (
        <span className="absolute right-3 top-2.5 rounded-full bg-gray-10 px-2 py-0.5 text-[10px] font-medium text-gray-50">
          {badgeLabel}
        </span>
      )}
    </button>
  );
};

export default HomeScheduleCard;
