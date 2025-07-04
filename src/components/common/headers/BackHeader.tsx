import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface BackHeaderProps {
  label?: string;
  onClick: () => void;
  isDarkBg?: boolean;
}

export const BackHeader = ({
  isDarkBg = false,
  label,
  onClick,
}: BackHeaderProps) => {
  const colorClass = clsx(isDarkBg ? "text-gray-white" : "text-gray-black");
  return (
    <header className="flex px-6 w-full h-[60px] items-center gap-6 select-none">
      <ChevronLeftIcon
        className={clsx("h-6 w-6 cursor-pointer", colorClass)}
        onClick={onClick}
      />
      {label && (
        <span className={clsx("typo-title-02", colorClass)}>{label}</span>
      )}
    </header>
  );
};
