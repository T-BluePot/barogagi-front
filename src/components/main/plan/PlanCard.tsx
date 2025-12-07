import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export interface PlanData {
  id: string | number;
  emoji: string;
  title: string;
  startTime?: string; // HH:mm 형식
  endTime?: string; // HH:mm 형식
  location?: string;
}

interface PlanCardProps {
  data: PlanData;
  isDeleteMode?: boolean;
  onDelete?: (id: string | number) => void;
  onTimeClick?: (id: string | number) => void;
  onLocationClick?: (id: string | number) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const PlanCard = ({
  data,
  isDeleteMode = false,
  onDelete,
  onTimeClick,
  onLocationClick,
  dragHandleProps,
}: PlanCardProps) => {
  const { id, emoji, title, startTime, endTime, location } = data;

  const hasTime = startTime && endTime;
  const hasLocation = !!location;

  return (
    <div className="flex w-full p-4 items-center border border-gray-20 rounded-xl bg-white">
      {/* 이모지 */}
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl">
        {emoji}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col gap-1 ml-3">
        {/* 제목 */}
        <span className="typo-subtitle text-gray-black">{title}</span>

        {/* 시간 & 장소 정보 */}
        <div className="flex items-center gap-3">
          {/* 시간 */}
          <button
            type="button"
            onClick={() => onTimeClick?.(id)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <AccessTimeIcon className="!text-[16px] text-gray-40" />
            <span className="typo-caption text-gray-40">
              {hasTime ? `${startTime} ~ ${endTime}` : "시간 추가"}
            </span>
          </button>

          {/* 장소 */}
          <button
            type="button"
            onClick={() => onLocationClick?.(id)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <PlaceIcon className="!text-[16px] text-gray-40" />
            <span className="typo-caption text-gray-40">
              {hasLocation ? location : "장소 추가"}
            </span>
          </button>
        </div>
      </div>

      {/* 우측 버튼 영역 */}
      <div className="flex-shrink-0 ml-3">
        {isDeleteMode ? (
          <button
            type="button"
            onClick={() => onDelete?.(id)}
            className="p-2 cursor-pointer"
          >
            <DeleteOutlineIcon className="text-gray-40 !text-[24px]" />
          </button>
        ) : (
          <div
            {...dragHandleProps}
            className="p-2 cursor-grab active:cursor-grabbing"
          >
            <DragIndicatorIcon className="text-gray-30 !text-[24px]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanCard;
