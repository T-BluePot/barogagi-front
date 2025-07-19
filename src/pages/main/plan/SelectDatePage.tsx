import { useState } from "react";
import Calendar from "@/components/main/plan/Calendar";
import { getMarkedDates } from "@/utils/getMarkedDates";
import { mockSchedules } from "@/mock/schedules";

const SelectDatePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const markedDates = getMarkedDates(mockSchedules);
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-white">
      <span>날짜 선택 페이지</span>
      <div className="flex flex-col w-full">
        <Calendar
          withTitle={true}
          selectedDate={selectedDate}
          onChangeDate={(date) => setSelectedDate(date)}
          markedDates={markedDates}
        />
      </div>
    </div>
  );
};

export default SelectDatePage;
