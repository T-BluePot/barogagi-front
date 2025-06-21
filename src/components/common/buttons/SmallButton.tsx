type Props = {
  label: string;
  type?: "filled" | "outlined";
  isDisabled?: boolean;
  onClick?: () => void;
};

const SmallButton = ({
  label,
  type = "filled",
  isDisabled = false,
  onClick,
}: Props) => {
  const baseStyle =
    "flex items-center justify-center px-3 py-2 cursor-pointer transition-colors duration-200 focus:outline-none rounded-lg typo-description";

  const typeStyles = {
    filled:
      "bg-main text-gray-black hover:bg-main-dark disabled:bg-main-disable disabled:text-gray-50",
    outlined:
      "bg-transparent border-2 border-main text-gray-white hover:bg-main hover:text-gray-black disabled:border-main-disable disabled:text-gray-white",
  };

  return (
    <button
      className={`${baseStyle} ${typeStyles[type]} ${
        isDisabled ? "cursor-not-allowed" : ""
      }`}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
    >
      <span className="break-words">{label}</span>
    </button>
  );
};

export default SmallButton;
