import { formatDateToKorean } from "@/utils/date";

export const CalendarTitle = ({ selectedDate }: { selectedDate: Date }) => {
  return (
    <div className="flex px-6">
      <span className="typo-title-01 text-gray-black">
        {formatDateToKorean(selectedDate)}
      </span>
    </div>
  );
};
