import { useRef } from "react";
import AddIcon from "@mui/icons-material/Add";

interface PlanAddButtonProps {
  label?: string;
  onClick: () => void;
  isDisabled?: boolean;
}

const PlanAddButton = ({
  label = "계획 추가하기",
  onClick,
  isDisabled = false,
}: PlanAddButtonProps) => {
  // 긴 리스트 하단 버튼이 "터치 스크롤 후 버튼 위에서 손 뗄 때" 클릭으로 오인되는 문제 방지.
  // touchstart 지점 대비 일정 거리(10px) 이상 세로로 움직였으면 스크롤로 보고 클릭을 무시한다.
  // (touchmove는 touchstart가 발생한 요소로 계속 전달되므로 스크롤 판별이 안정적)
  const startY = useRef(0);
  const scrolled = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0]?.clientY ?? 0;
    scrolled.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (Math.abs((e.touches[0]?.clientY ?? 0) - startY.current) > 10) {
      scrolled.current = true;
    }
  };

  const handleClick = () => {
    if (scrolled.current) return; // 스크롤 제스처였으면 실행하지 않음
    onClick();
  };

  const baseStyle =
    "flex items-center justify-center gap-1 w-full h-20 rounded-xl border border-dashed border-gray-40 transition-colors duration-200 cursor-pointer";

  const stateStyle = isDisabled
    ? "text-gray-40 cursor-not-allowed"
    : "text-gray-40 hover:border-gray-60 hover:text-gray-60";

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : handleClick}
      onTouchStart={isDisabled ? undefined : handleTouchStart}
      onTouchMove={isDisabled ? undefined : handleTouchMove}
      className={`${baseStyle} ${stateStyle}`}
      disabled={isDisabled}
    >
      <AddIcon className="!text-[20px]" />
      <span className="typo-body">{label}</span>
    </button>
  );
};

export default PlanAddButton;
