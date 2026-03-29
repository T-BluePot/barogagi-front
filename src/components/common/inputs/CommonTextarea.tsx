import clsx from "clsx";

interface CommonTextareaProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
}

const CommonTextarea = ({
  placeholder,
  value,
  onChange,
  maxLength,
  className,
}: CommonTextareaProps) => {
  const baseClass =
    "w-full min-h-40 p-4 bg-gray-10 rounded-lg resize-none typo-body text-gray-black placeholder:text-gray-40 focus:outline-none";

  return (
    <textarea
      className={clsx(baseClass, className)}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
    />
  );
};

export default CommonTextarea;
