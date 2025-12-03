import Button from "./CommonButton";
import type { ButtonProps } from "./CommonButton";

interface ButtonWithTextProps {
  textLabel: string;
  onClickText: () => void;
  button: ButtonProps;
}

const ButtonWithText = ({
  textLabel,
  onClickText,
  button,
}: ButtonWithTextProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={textLabel}
        onClick={onClickText}
        className="typo-description text-gray-40 text-center underline"
      >
        {textLabel}
      </button>
      <Button {...button} />
    </div>
  );
};

export default ButtonWithText;
