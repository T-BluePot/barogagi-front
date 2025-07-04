import clsx from "clsx";
import type { ReactNode } from "react";

interface TitleHeaderProps {
  label: string;
  isDarkBg?: boolean;
  children?: ReactNode;
}

export const TitleHeader = ({
  isDarkBg = false,
  label,
  children,
}: TitleHeaderProps) => {
  return (
    <header className="flex px-6 w-full h-[60px] justify-between items-center gap-6 select-none bg-alert-red">
      <span
        className={clsx(
          "typo-title-02",
          isDarkBg ? "text-gray-white" : "text-gray-black"
        )}
      >
        {label}
      </span>
      {children && <div className="ml-auto flex items-center">{children}</div>}
    </header>
  );
};
