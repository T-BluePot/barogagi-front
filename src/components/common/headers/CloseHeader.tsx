import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface CloseHeaderProps {
  label?: string;
  onClick: () => void;
  isDarkBg?: boolean;
}

export const CloseHeader = ({
  isDarkBg = false,
  label,
  onClick,
}: CloseHeaderProps) => {
  const colorClass = clsx(isDarkBg ? "text-gray-white" : "text-gray-black");
  return (
    <header className="flex px-6 w-full h-[60px] justify-between items-center gap-6 select-none">
      <div>
        {label && (
          <span className={clsx("typo-title-02", colorClass)}>{label}</span>
        )}
      </div>
      <XMarkIcon
        className={clsx("h-6 w-6 cursor-pointer", colorClass)}
        onClick={onClick}
      />
    </header>
  );
};
