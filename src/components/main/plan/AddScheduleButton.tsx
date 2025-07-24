import AddIcon from "@mui/icons-material/Add";

export const AddScheduleButton = ({
  onAddSchedule,
}: {
  onAddSchedule: () => void;
}) => {
  return (
    <button
      onClick={onAddSchedule}
      className="flex w-12 h-12 justify-center items-center rounded-full bg-main shadow-md shadow-gray-30 cursor-pointer"
    >
      <AddIcon className="text-gray-black" />
    </button>
  );
};
