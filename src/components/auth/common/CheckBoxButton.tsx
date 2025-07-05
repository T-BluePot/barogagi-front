import clsx from "clsx";

import CheckIcon from "@mui/icons-material/Check";

type GapSize = "default" | "tight";

interface CheckBoxButtonProps {
  size?: "default" | "large"; // 체크 아이콘 사이즈
  gap?: GapSize; // 체크 - 라벨 간 간격
  isChecked: boolean; // 체크 여부
  setIsChecked: (next: boolean) => void;
  label?: string; // 체크박스 옆 라벨 여부
  labelColor?: "white" | "gray";
}

export const CheckBoxButton = ({
  size = "default",
  gap = "default",
  isChecked,
  setIsChecked,
  label,
  labelColor = "white",
}: CheckBoxButtonProps) => {
  const gapClass = gap === "tight" ? "gap-2" : "gap-4";
  const containerClass = clsx("flex flex-row items-center", gapClass);

  const iconSize = size === "large" ? 32 : 24; // px 단위
  const colorClass = isChecked ? "text-main" : "text-gray-40";

  const labelClass = clsx(
    "typo-body",
    labelColor === "white" && "text-white",
    labelColor === "gray" && "text-gray-40"
  );

  const handleClick = () => setIsChecked(!isChecked);

  return (
    <div className={containerClass}>
      <div
        onClick={handleClick}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <CheckIcon sx={{ fontSize: iconSize }} className={colorClass} />
      </div>
      {label && <span className={labelClass}>{label}</span>}
    </div>
  );
};
