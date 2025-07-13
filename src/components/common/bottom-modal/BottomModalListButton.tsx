import clsx from "clsx";
import CheckIcon from "@mui/icons-material/Check";

interface BottomModalLisButtontProps {
  label: string;
  isChecked: boolean;
  onClickChecked: () => void;
}

export const BottomModalListButton = ({
  label,
  isChecked,
  onClickChecked,
}: BottomModalLisButtontProps) => {
  const textClass = clsx(
    "typo-title-02",
    isChecked ? "text-gray-black" : "text-gray-60"
  );
  return (
    <div
      className="flex h-14 items-center justify-between px-6"
      onClick={onClickChecked}
    >
      <span className={textClass}>{label}</span>
      {isChecked && <CheckIcon className="text-main" />}
    </div>
  );
};
