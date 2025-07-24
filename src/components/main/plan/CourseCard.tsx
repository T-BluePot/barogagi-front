import { CommonTag } from "@/components/common/tags/commonTag";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export interface CourseCardProps {
  date: string; // 예: "2025년 4월 25일"
  title: string; // 예: "서울 데이트 코스"
  tags: string[]; // 예: ["이색체험", "서울"]
  onEdit: () => void; // 일정 카드용 수정 콜백
  onDelete: () => void; // 삭제 아이콘 버튼용 삭제 콜백
}

export const CourseCard = ({
  date,
  title,
  tags,
  onEdit,
  onDelete,
}: CourseCardProps) => {
  return (
    <div
      onClick={onEdit}
      className="flex flex-col w-full p-6 items-baseline border border-gray-black rounded-xl gap-4 cursor-pointer"
    >
      {/* 카드 헤더 */}
      <div className="flex w-full justify-between items-baseline">
        <div className="flex flex-col items-baseline gap-2">
          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <CalendarTodayIcon className="!text-[12px] text-gray-40" />
            <span className="typo-description text-gray-40">{date}</span>
          </div>
          {/* 일정명 */}
          <span className="typo-title-02">{title}</span>
        </div>
        <button
          type="button"
          className="cursor-pointer"
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
        {tags.map((tag, idx) => (
          <CommonTag key={idx} label={tag} size="small" />
        ))}
      </div>
    </div>
  );
};
