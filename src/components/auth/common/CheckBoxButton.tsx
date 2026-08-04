import clsx from "clsx";

import CheckIcon from "@mui/icons-material/Check";

type GapSize = "default" | "tight";

export interface CheckBoxButtonProps {
  size?: "default" | "large"; // 체크 아이콘 사이즈
  gap?: GapSize; // 체크 - 라벨 간 간격
  isChecked: boolean; // 체크 여부
  onCheckedChange?: () => void;
  label?: string; // 체크박스 옆 라벨 여부
  labelColor?: "white" | "gray";
  /**
   * 스크린리더용 이름. 미지정 시 `label` 을 쓴다.
   * 아이콘만 있는 컨트롤이라 둘 다 없으면 "체크박스"로만 읽힌다.
   */
  ariaLabel?: string;
}

export const CheckBoxButton = ({
  size = "default",
  gap = "default",
  isChecked,
  onCheckedChange,
  label,
  labelColor = "white",
  ariaLabel,
}: CheckBoxButtonProps) => {
  const gapClass = gap === "tight" ? "gap-2" : "gap-4";
  const containerClass = clsx("flex flex-row items-center", gapClass);

  const iconSize = size === "large" ? 28 : 20; // px 단위
  const colorClass = isChecked ? "text-main" : "text-gray-30";

  const labelClass = clsx(
    "typo-body",
    labelColor === "white" && "text-gray-black",
    labelColor === "gray" && "text-gray-50"
  );

  return (
    <div className={containerClass}>
      {/* div[role=button] 이었는데 Enter/Space 처리가 없어 키보드로 못 눌렀다.
          실제 button 으로 바꾸면 키보드 동작·포커스 링을 브라우저가 알아서 해준다.
          체크 상태는 aria-pressed 로 알린다(아이콘 색만으로는 낭독기가 알 수 없다). */}
      <button
        type="button"
        onClick={onCheckedChange}
        aria-label={ariaLabel ?? label}
        aria-pressed={isChecked}
        className="flex cursor-pointer items-center"
      >
        <CheckIcon sx={{ fontSize: iconSize }} className={colorClass} />
      </button>
      {label && <span className={labelClass}>{label}</span>}
    </div>
  );
};
