import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SELECT_DATE_TEXT } from "@/constants/texts/main/plan/selectDate";

import Calendar from "@/components/main/plan/Calendar";
import Button from "@/components/common/buttons/CommonButton";
import { ROUTES } from "@/constants/routes";

const SelectDatePage = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col w-full h-full gap-6 bg-gray-white overflow-auto hide-scrollbar">
      <div className="flex flex-col w-full px-6 mt-6">
        <Calendar
          withTitle={true}
          selectedDate={selectedDate}
          onChangeDate={(date) => setSelectedDate(date)}
        />
      </div>
      <div className="mt-auto w-full p-6">
        <Button
          label={
            !selectedDate
              ? SELECT_DATE_TEXT.NEXT_BUTTON.disabled
              : SELECT_DATE_TEXT.NEXT_BUTTON.enabled
          }
          isDisabled={!selectedDate}
          onClick={() => {
            // 추후 선택된 일정 넘기기 로직 추가
            navigate(ROUTES.PLAN.LOCATION);
          }}
        />
      </div>
    </div>
  );
};

export default SelectDatePage;
