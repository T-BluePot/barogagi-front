import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

type CommonTagProps = {
  label: string;
  hasHash?: boolean;
  size?: "small" | "default";
  isActive?: boolean;
  onClick?: () => void;
};

export const CommonTag = ({
  label,
  hasHash = true,
  size = "default",
  isActive = true,
  onClick,
}: CommonTagProps) => {
  const paddingClass = clsx(
    size === "default" && "px-[14px] py-[10px]",
    size === "small" && "px-[12px] py-[6px]"
  );

  const baseClass = clsx(
    "flex items-center justify-center gap-1 rounded-[20px] transition-colors duration-200",
    size === "default" && "border",
    paddingClass
  );

  const stateClass = clsx(
    isActive
      ? "bg-main border-main"
      : size === "default"
      ? "bg-gray-white border-gray-40"
      : "bg-gray-10"
  );

  const textClass = clsx(
    "typo-description", // 12px / weight 500 (typo-tag 300보다 굵음)
    size === "default"
      ? isActive
        ? "text-white"
        : "text-gray-40"
      : "text-gray-black" // small: 코랄/회색 배경 모두 검은 글자
  );
  return (
    <button
      className={clsx(baseClass, stateClass, "cursor-pointer")}
      onClick={onClick}
    >
      {hasHash && <span className={textClass}>#</span>}
      <span className={textClass}>{label}</span>
      {size === "default" && isActive && (
        <XMarkIcon className="h-4 w-4 text-white" />
      )}
    </button>
  );
};
