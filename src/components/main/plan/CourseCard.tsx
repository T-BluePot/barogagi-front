import { CommonTag } from "@/components/common/tags/commonTag";
import type { Schedule } from "@/types/scheduleTypes";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface CourseCardProps {
  schedule: Schedule;
  onClickCard: () => void; // 일정 카드용 수정 콜백
  onDelete?: () => void; // 삭제 아이콘 버튼용 삭제 콜백
  isDeleteDisabled?: boolean; // 삭제 버튼 비활성화 여부
}

export const CourseCard = ({
  schedule,
  onClickCard,
  onDelete,
  isDeleteDisabled = false,
}: CourseCardProps) => {
  return (
    <div
      onClick={onClickCard}
      className="flex flex-col w-full p-6 items-baseline border border-gray-black rounded-xl gap-4 cursor-pointer"
    >
      {/* 카드 헤더 */}
      <div className="flex w-full justify-between items-baseline">
        <div className="flex flex-col items-baseline gap-2">
          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <CalendarTodayIcon className="!text-[12px] text-gray-40" />
            <span className="typo-description text-gray-40">
              {schedule.startDate}
            </span>
          </div>
          {/* 일정명 */}
          <span className="typo-title-02">{schedule.scheduleNm}</span>
        </div>
        {/* 삭제 버튼 */}
        {!isDeleteDisabled && (
          <button
            type="button"
            className="cursor-pointer w-6 h-6 rounded-full hover:bg-gray-10 active:bg-gray-10"
            onClick={(e) => {
              e.stopPropagation(); // 부모 onClick으로의 전파 방지
              onDelete?.(); // 삭제 콜백 실행 (옵셔널 체이닝)
            }}
          >
            <DeleteOutlineIcon className="text-gray-black !text-[20px]" />
          </button>
        )}
      </div>
      {/* 태그 */}
      <div className="flex gap-2">
        {schedule.tags.map((tag, idx) => (
          <CommonTag key={idx} label={tag.tagNm} size="small" />
        ))}
      </div>
    </div>
  );
};
