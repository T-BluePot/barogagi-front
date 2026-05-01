import { useState } from "react";
import { useNavigate } from "react-router-dom";

// === constants ===
import { ROUTES } from "@/constants/routes";
import { SELECT_DATE_TEXT } from "@/constants/texts/main/plan/selectDate";

// == utils ==
import {
  formatDateToServer,
  parseServerDateToLocalDate,
} from "@/utils/dateFormatters";

// === components ===
import Calendar from "@/components/main/plan/Calendar";
import Button from "@/components/common/buttons/CommonButton";

// === server ===
import { useScheduleDraftStore } from "@/stores/scheduleStore";

const SelectDatePage = () => {
  const navigate = useNavigate();

  const draft = useScheduleDraftStore((s) => s.draft);
  const setDraft = useScheduleDraftStore((s) => s.setDraft);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsedDate = draft.startDate
    ? parseServerDateToLocalDate(draft.startDate)
    : null;

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    parsedDate && parsedDate >= today ? parsedDate : null // 과거 날짜면 null로 초기화
  );

  const handleNext = () => {
    if (!selectedDate) return;

    const formatted = formatDateToServer(selectedDate);

    // 현재- 하루만 지원: start = end
    setDraft({
      startDate: formatted,
      endDate: formatted,
    });

    navigate(ROUTES.PLAN.LOCATION);
  };

  return (
    <div className="flex flex-col w-full h-full gap-6 bg-gray-white overflow-auto hide-scrollbar">
      <div className="flex flex-col w-full">
        <Calendar
          withTitle={true}
          selectedDate={selectedDate}
          onChangeDate={(date) => setSelectedDate(date)}
          disablePastDates={true}
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
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default SelectDatePage;
