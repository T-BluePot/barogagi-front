import { useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
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
  onDeleteClick?: (id: string | number) => void;
  onTimeClick?: (id: string | number) => void;
  onLocationClick?: (id: string | number) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const SWIPE_THRESHOLD = 60; // 삭제 버튼이 나타나는 스와이프 거리
const DELETE_BUTTON_WIDTH = 72; // 삭제 버튼 너비

const PlanCard = ({
  data,
  onDeleteClick,
  onTimeClick,
  onLocationClick,
  dragHandleProps,
}: PlanCardProps) => {
  const { id, emoji, title, startTime, endTime, location } = data;

  const hasTime = startTime && endTime;
  const hasLocation = !!location;

  // framer-motion 드래그 상태
  const x = useMotionValue(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleDragEnd = () => {
    const currentX = x.get();

    if (currentX < -SWIPE_THRESHOLD) {
      // 충분히 스와이프했으면 열기
      animate(x, -DELETE_BUTTON_WIDTH, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
      setIsOpen(true);
    } else {
      // 아니면 닫기
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
      setIsOpen(false);
    }
  };

  const handleDeleteClick = () => {
    // 부모에게 삭제 요청 전달 (모달은 부모에서 관리)
    onDeleteClick?.(id);
  };

  // 삭제 완료 후 카드 상태 초기화 (외부에서 호출 가능하도록 export 필요 시 수정)
  const resetSwipeState = () => {
    animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    setIsOpen(false);
  };

  const handleCardClick = () => {
    // 열려있으면 닫기
    if (isOpen) {
      resetSwipeState();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDeleteClick}
        className="absolute right-0 top-0 bottom-0 w-full flex items-center justify-end bg-red-500 cursor-pointer rounded-xl pr-6"
      >
        <DeleteOutlineIcon className="text-white !text-[24px]" />
      </button>

      {/* 카드 본체 (드래그 가능) */}
      <motion.div
        className="flex w-full p-4 items-center border border-gray-20 rounded-xl bg-white select-none relative"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -DELETE_BUTTON_WIDTH, right: 0 }}
        dragElastic={{ left: 0.1, right: 0 }}
        onDragEnd={handleDragEnd}
        onClick={handleCardClick}
      >
        {/* 이모지 */}
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl">
          {emoji}
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col gap-1 ml-3 text-left">
          {/* 제목 */}
          <span className="typo-subtitle text-gray-black">{title}</span>

          {/* 시간 & 장소 정보 */}
          <div className="flex items-center gap-3">
            {/* 시간 */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTimeClick?.(id);
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                onLocationClick?.(id);
              }}
              className="flex items-center gap-1 cursor-pointer"
            >
              <PlaceIcon className="!text-[16px] text-gray-40" />
              <span className="typo-caption text-gray-40">
                {hasLocation ? location : "장소 추가"}
              </span>
            </button>
          </div>
        </div>

        {/* 드래그 핸들 */}
        <div className="flex-shrink-0 ml-3">
          <div
            {...dragHandleProps}
            className="p-2 cursor-grab active:cursor-grabbing"
          >
            <DragIndicatorIcon className="text-gray-30 !text-[24px]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlanCard;
