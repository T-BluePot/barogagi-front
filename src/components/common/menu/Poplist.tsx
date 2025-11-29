import type React from "react";
import clsx from "clsx";

type Status = "normal" | "delete";

export interface PopListProps {
  status?: Status;
  label: string;
  children: React.ReactElement;
  onClickItem: () => void;
}

export const PopList = ({
  status = "normal",
  label,
  children,
  onClickItem,
}: PopListProps) => {
  const textClass = clsx(
    "typo-body",
    status === "normal" ? "text-gray-black" : "text-alert-red"
  );
  return (
    <button
      onClick={onClickItem}
      className="flex flex-row py-2 pl-3 pr-4 gap-3 justify-center"
    >
      <div>{children}</div>
      <p className={textClass}>{label}</p>
    </button>
  );
};
