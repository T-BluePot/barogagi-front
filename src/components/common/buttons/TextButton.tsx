type Props = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

const TextButton = ({ label, onClick, disabled, type = "button" }: Props) => {
  const baseStyle = `px-4 py-3 typo-body cursor-pointer transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;
  const typoStyle = `text-gray-50 hover:text-black break-words`;

  return (
    <button
      className={baseStyle}
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
