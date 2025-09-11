import { TextTag } from "@/components/common/tags/TextTag";
import type { Schedule } from "@/types/schedule";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface SimpleCourseCardProps extends Schedule {
  onEdit: () => void; // 일정 카드용 수정 콜백
  onDelete: () => void; // 삭제 아이콘 버튼용 삭제 콜백
}

export const SimpleCourseCard = ({
  onEdit,
  onDelete,
  ...scheduleProps
}: SimpleCourseCardProps) => {
  return (
    <div
      onClick={onEdit}
      className="flex flex-col w-full p-6 items-baseline border border-gray-black bg-gray-white rounded-xl gap-4 cursor-pointer"
    >
      {/* 카드 헤더 */}
      <div className="flex w-full justify-between items-baseline">
        <div className="flex flex-col items-baseline gap-2">
          {/* 일정명 */}
          <span className="typo-title-02">{scheduleProps.scheduleTitle}</span>
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
          <DeleteOutlineIcon className="text-gray-30 !text-[20px]" />
        </button>
      </div>
      {/* 태그 */}
      <div className="flex gap-2">
        {scheduleProps.tags.map((tag, idx) => (
          <TextTag key={idx} label={tag} />
        ))}
      </div>
    </div>
  );
};
