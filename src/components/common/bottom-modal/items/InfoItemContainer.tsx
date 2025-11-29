import type { IconType } from "@/types/main/plan/bottom-modal/itemsTypes";
import { IconRenderer } from "./IconRenderer";
import type React from "react";

interface InfoItemContainerProps {
  icon: IconType;
  onClick?: () => void;
  children: React.ReactNode;
}

export const InfoItemContainer = ({
  icon,
  onClick,
  children,
}: InfoItemContainerProps) => {
  return (
    <button
      className="flex flex-row w-full min-h-14 py-4 px-6 items-center gap-2 hover:bg-gray-5 active:bg-gray-5"
      onClick={onClick}
    >
      <IconRenderer icon={icon} />
      {children}
    </button>
  );
};
