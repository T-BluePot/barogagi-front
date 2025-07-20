import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SELECT_DATE_TEXT } from "@/constants/texts/main/plan/selectDate";

import { BackHeader } from "@/components/common/headers/BackHeader";
import Calendar from "@/components/main/plan/Calendar";
import Button from "@/components/common/buttons/CommonButton";

const SelectDatePage = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col w-full min-h-screen gap-6 bg-gray-white">
      <BackHeader
        label={SELECT_DATE_TEXT.HEADER_TITLE}
        onClick={() => {
          // 일정 탭 메인 화면
        }}
      />

      <div className="flex flex-col w-full px-6">
        <Calendar
          withTitle={true}
          selectedDate={selectedDate}
          onChangeDate={(date) => setSelectedDate(date)}
        />
      </div>
      <div className="mt-auto w-full p-8">
        <Button
          label={
            !selectedDate
              ? SELECT_DATE_TEXT.NEXT_BUTTON.disabled
              : SELECT_DATE_TEXT.NEXT_BUTTON.enabled
          }
          isDisabled={!selectedDate}
          onClick={() => {
            // 추후 선택된 일정 넘기기 로직 추가
            navigate("/plan/location");
          }}
        />
      </div>
    </div>
  );
};

export default SelectDatePage;
