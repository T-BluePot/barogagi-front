interface ScheduleDeleteButtonProps {
  label?: string;
  onClick: () => void;
  isDisabled?: boolean;
}

const ScheduleDeleteButton = ({
  label = "삭제",
  onClick,
  isDisabled = false,
}: ScheduleDeleteButtonProps) => {
  const baseStyle =
    "px-4 py-2 rounded-full typo-caption transition-colors duration-200 cursor-pointer";

  const stateStyle = isDisabled
    ? "bg-gray-20 text-gray-40 cursor-not-allowed"
    : "bg-gray-20 text-gray-60 hover:bg-gray-30 hover:text-gray-80";

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onClick}
      className={`${baseStyle} ${stateStyle}`}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};

export default ScheduleDeleteButton;
