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
    <header className="flex w-screen h-header justify-between items-center px-screen gap-lg">
      <div>
        {label && (
          <span className={clsx("typo-title-01", colorClass)}>{label}</span>
        )}
      </div>
      <XMarkIcon
        className={clsx("h-6 w-6 cursor-pointer", colorClass)}
        onClick={onClick}
      />
    </header>
  );
};
