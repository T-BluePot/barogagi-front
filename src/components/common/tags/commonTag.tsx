import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

type CommonTagProps = {
  label: string;
  size?: "small" | "default";
  active: boolean;
};

export const CommonTag = ({
  label,
  size = "default",
  active,
}: CommonTagProps) => {
  const paddingClass = clsx(
    "flex items-center justify-center gap-1",
    size === "default" && "px-[14px] py-[10px]",
    size === "small" && "px-[10px] py-[6px]"
  );

  const baseClass = clsx(
    "rounded-tag rounded-[20px] transition-colors duration-200",
    paddingClass
  );

  const stateClass = clsx(
    active
      ? "bg-main"
      : size === "default"
      ? "bg-gray-white border border-gray-40"
      : "bg-gray-10"
  );

  const textClass = clsx(
    size === "default"
      ? active
        ? "text-gray-black text-caption"
        : "text-gray-40 text-caption"
      : "text-gray-black text-description"
  );
  return (
    <button className={clsx(baseClass, stateClass)}>
      <span className={textClass}>{label}</span>
      {size === "default" && active && (
        <XMarkIcon className="h-4 w-4 text-gray-black" />
      )}
    </button>
  );
};
