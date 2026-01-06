import AddIcon from "@mui/icons-material/Add";

interface PlanAddButtonProps {
  label?: string;
  onClick: () => void;
  isDisabled?: boolean;
}

const PlanAddButton = ({
  label = "일정 추가하기",
  onClick,
  isDisabled = false,
}: PlanAddButtonProps) => {
  const baseStyle =
    "flex items-center justify-center gap-1 w-full h-20 rounded-xl border border-dashed border-gray-40 transition-colors duration-200 cursor-pointer";

  const stateStyle = isDisabled
    ? "text-gray-40 cursor-not-allowed"
    : "text-gray-40 hover:border-gray-60 hover:text-gray-60";

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onClick}
      className={`${baseStyle} ${stateStyle}`}
      disabled={isDisabled}
    >
      <AddIcon className="!text-[20px]" />
      <span className="typo-body">{label}</span>
    </button>
  );
};

export default PlanAddButton;
