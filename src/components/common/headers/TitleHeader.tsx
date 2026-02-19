import clsx from "clsx";
import type { ReactNode } from "react";

interface TitleHeaderProps {
  label: string;
  isHeaderDark?: boolean;
  children?: ReactNode;
}

export const TitleHeader = ({
  isHeaderDark = false,
  label,
  children,
}: TitleHeaderProps) => {
  return (
    <header className="flex px-6 w-full h-[60px] justify-between items-center gap-6 select-none">
      <span
        className={clsx(
          "typo-title-02",
          isHeaderDark ? "text-gray-white" : "text-gray-black"
        )}
      >
        {label}
      </span>
      {children && <div className="ml-auto flex items-center">{children}</div>}
    </header>
  );
};
