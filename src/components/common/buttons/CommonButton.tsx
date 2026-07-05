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
  // 커서는 전역 base 규칙(활성 버튼 pointer)과 disabled 팔레트(not-allowed)가 담당
  const baseStyle = `px-4 py-3 rounded-full w-full max-w-xl flex items-center justify-center typo-body focus:outline-none transition-colors duration-200 ${
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
