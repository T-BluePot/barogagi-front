type Props = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "default" | "main-underline";
};

const TextButton = ({
  label,
  onClick,
  disabled,
  type = "button",
  variant = "default",
  className,
}: Props) => {
  const baseStyle = `px-4 py-3 typo-body cursor-pointer transition-colors duration-200`;

  const variantStyles = {
    default: `text-gray-50 hover:text-black break-words`,
    "main-underline": `text-main-dark hover:main-disable text-sm underline break-words`,
  };

  const typoStyle = variantStyles[variant];

  return (
    <button
      className={`${baseStyle} ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={label}
    >
      <span className={typoStyle}>{label}</span>
    </button>
  );
};

export default TextButton;
