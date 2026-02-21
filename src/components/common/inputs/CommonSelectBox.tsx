import { useState } from "react";
import clsx from "clsx";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface CommonSelectBoxProps<T extends string> {
  label: string;
  placeholder: string;
  value: T | null;
  options: readonly T[];
  onChange: (value: T) => void;
}

const CommonSelectBox = <T extends string>({
  label,
  placeholder,
  value,
  options,
  onChange,
}: CommonSelectBoxProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSelect = (option: T) => {
    onChange(option);
    setIsOpen(false);
  };

  const borderClass =
    isFocused || isOpen ? "border-main-default" : "border-gray-30";
  const labelClass = isFocused || isOpen ? "text-main-default" : "text-gray-50";

  return (
    <div className="relative flex flex-col gap-1 text-left">
      {/* 트리거 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={clsx(
          "flex w-full items-center justify-between border-b-2 py-3 transition-colors duration-300 cursor-pointer focus:outline-none",
          borderClass
        )}
      >
        <div className="flex flex-col items-start gap-0.5">
          {value && (
            <span className={clsx("typo-tag", labelClass)}>{label}</span>
          )}
          <span
            className={clsx(
              "typo-subtitle",
              value ? "text-gray-black" : "text-gray-40"
            )}
          >
            {value ?? placeholder}
          </span>
        </div>

        <div
          className={clsx(
            "transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        >
          <KeyboardArrowUpIcon className="text-gray-50" />
        </div>
      </button>

      {/* 드롭다운 목록 */}
      {isOpen && (
        <ul className="absolute top-full left-0 right-0 z-10 flex flex-col bg-gray-10 rounded-lg overflow-hidden shadow-lg">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => handleSelect(option)}
                className={clsx(
                  "w-full text-left px-4 py-3 typo-body cursor-pointer transition-colors",
                  value === option
                    ? "bg-main-light text-main-default"
                    : "text-gray-black hover:bg-gray-20"
                )}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommonSelectBox;
