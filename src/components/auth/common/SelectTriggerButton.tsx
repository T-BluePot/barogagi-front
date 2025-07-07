import clsx from "clsx";
import { useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface SelectTriggerButtonProps {
  label: string;
  value?: string;
  onClick: () => void;
}

export const SelectTriggerButton = ({
  label,
  value,
  onClick,
}: SelectTriggerButtonProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerClass = clsx(
    "flex w-full h-[60px] items-center justify-between border-b transition-colors duration-300 focus:outline-none",
    isFocused ? " border-main" : " border-gray-60"
  );
  return (
    <button
      onClick={onClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={containerClass}
    >
      {value ? (
        <div className="flex flex-col w-full px-3 items-baseline gap-1">
          <span
            className={clsx(
              "typo-tag",
              isFocused ? " text-main" : " text-gray-60"
            )}
          >
            {label}
          </span>
          <span className="typo-body text-white">{value}</span>
        </div>
      ) : (
        <span
          className={clsx(
            "px-3 typo-body",
            isFocused ? " text-main" : " text-gray-60"
          )}
        >
          {label}
        </span>
      )}

      <div
        className={`transition-transform duration-360 ${
          isFocused ? "rotate-180" : "rotate-0"
        }`}
      >
        <KeyboardArrowUpIcon className="text-gray-60" />
      </div>
    </button>
  );
};
