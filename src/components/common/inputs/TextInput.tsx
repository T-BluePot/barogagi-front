import clsx from "clsx";

type size = "small" | "large";

interface TextInputProps {
  size?: size;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

const TextInput = ({
  size = "small",
  placeholder,
  value,
  onChange,
  maxLength,
}: TextInputProps) => {
  // 공통 스타일
  const baseClass =
    "flex justify-baseline items-baseline w-full border border-gray-20 rounded-[8px] p-4";

  if (size === "large") {
    // 여러 줄 입력용 textarea
    const fieldClass = clsx(baseClass, "h-[120px]");
    return (
      <textarea
        className={fieldClass}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        maxLength={maxLength}
      />
    );
  }

  // 한 줄 입력용 input
  const fieldClass = clsx(baseClass, "h-12");
  return (
    <input
      type="text"
      className={fieldClass}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      maxLength={maxLength}
    />
  );
};

export default TextInput;
