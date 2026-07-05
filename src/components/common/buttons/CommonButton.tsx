import type { ButtonHTMLAttributes } from "react";

import { BUTTON_COLOR } from "./buttonStyles";

export type ButtonProps = {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode; // 아이콘 slot 추가
  isDisabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  label,
  type = "button",
  onClick,
  icon,
  isDisabled = false,
}: ButtonProps) => {
  const baseStyle = `px-4 py-3 rounded-full w-full max-w-xl flex items-center justify-center typo-body focus:outline-none cursor-pointer transition-colors duration-200 ${
    isDisabled ? BUTTON_COLOR.filledDisabled : BUTTON_COLOR.filled
  }`;

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      className={baseStyle}
      disabled={isDisabled}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      <span className="wrap-break-word">{label}</span>
    </button>
  );
};

export default Button;
