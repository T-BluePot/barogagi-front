import { TextTag } from "@/components/common/tags/TextTag";
import type { Schedule } from "@/types/scheduleTypes";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface SimpleCourseCardProps {
  onClickCard: () => void; // 일정 카드 선택 콜백
  onDelete: () => void; // 삭제 아이콘 버튼용 삭제 콜백
  schedule: Schedule;
}

export const SimpleCourseCard = ({
  onClickCard,
  onDelete,
  schedule,
}: SimpleCourseCardProps) => {
  return (
    <div
      onClick={onClickCard}
      className="flex flex-row w-full p-6 items-center border border-gray-black bg-gray-white rounded-xl gap-4 cursor-pointer"
    >
      {/* 카드 헤더 */}
      <div className="flex flex-col w-full justify-between items-baseline gap-4">
        {/* 일정명 */}
        <span className="typo-title-02">{schedule.scheduleNm}</span>
        {/* 태그 */}
        {schedule.tags && (
          <div className="flex gap-2">
            {schedule.tags.map((tag, idx) => (
              <TextTag key={idx} label={tag.tagNm} />
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className="cursor-pointer"
        title="일정 삭제"
        aria-label="일정 삭제"
        onClick={(e) => {
          e.stopPropagation(); // 부모 onClick으로의 전파 방지
          onDelete(); // 삭제 콜백 실행
        }}
      >
        <DeleteOutlineIcon className="text-gray-black !text-[20px]" />
      </button>
    </div>
  );
};
