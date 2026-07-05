import { BUTTON_COLOR } from "./buttonStyles";

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
    "flex items-center justify-center px-3 py-2 transition-colors duration-200 focus:outline-none rounded-lg typo-description";

  // 색상은 buttonStyles의 공통 팔레트만 사용 (CommonButton과 동일 세트)
  const typeStyles = {
    filled: isDisabled ? BUTTON_COLOR.filledDisabled : BUTTON_COLOR.filled,
    outlined: isDisabled
      ? BUTTON_COLOR.outlinedDisabled
      : BUTTON_COLOR.outlined,
  };

  return (
    <button
      className={`${baseStyle} ${typeStyles[type]}`}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
    >
      <span className="wrap-break-word">{label}</span>
    </button>
  );
};

export default SmallButton;
