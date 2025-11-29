import type React from "react";
import type { IconType } from "@/types/main/plan/bottom-modal/itemsTypes";

import { IconRenderer } from "./IconRenderer";
import clsx from "clsx";

interface InfoItemContainerProps {
  icon: IconType;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const InfoItemContainer = ({
  icon,
  disabled = false,
  onClick,
  children,
}: InfoItemContainerProps) => {
  const containerClass = clsx(
    "flex flex-row w-full min-h-14 py-4 px-6 items-center gap-2",
    !disabled && "hover:bg-gray-5 active:bg-gray-5"
  );
  return (
    <button className={containerClass} disabled={disabled} onClick={onClick}>
      <IconRenderer icon={icon} />
      {children}
    </button>
  );
};
