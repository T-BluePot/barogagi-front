import { formatDateToKorean } from "@/utils/date";

export const CalendarTitle = ({
  selectedDate,
  subTitle,
}: {
  selectedDate: Date;
  subTitle?: string;
}) => {
  return (
    <div className="flex flex-col items-baseline px-6 gap-3">
      <span className="typo-title-01 text-gray-black">
        {formatDateToKorean(selectedDate)}
      </span>
      {subTitle && subTitle.length !== 0 && (
        <span className="typo-subtitle text-gray-80">{subTitle}</span>
      )}
    </div>
  );
};
