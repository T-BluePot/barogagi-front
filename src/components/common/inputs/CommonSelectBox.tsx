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

  const isActive = isFocused || isOpen;

  const triggerStyles = {
    border: isActive ? "border-main" : "border-gray-30",
    label: isActive ? "text-gray-90" : "text-gray-90",
    value: value ? "text-gray-black" : "text-gray-40",
  };

  const optionStyles = {
    selected: "bg-main text-gray-black",
    default: "text-gray-black hover:bg-gray-20",
  };

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
          triggerStyles.border
        )}
      >
        <div className="flex flex-col items-start gap-0.5">
          {value && (
            <span className={clsx("typo-tag", triggerStyles.label)}>
              {label}
            </span>
          )}
          <span className={clsx("typo-subtitle", triggerStyles.value)}>
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
      <div
        className={clsx(
          "absolute top-full left-0 right-0 z-10 transition-all duration-200 origin-top",
          isOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-0 pointer-events-none"
        )}
      >
        <ul className="flex flex-col bg-gray-10 rounded-lg overflow-hidden shadow-lg">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => handleSelect(option)}
                className={clsx(
                  "w-full text-left px-4 py-3 typo-body cursor-pointer transition-colors",
                  value === option
                    ? optionStyles.selected
                    : optionStyles.default
                )}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommonSelectBox;
