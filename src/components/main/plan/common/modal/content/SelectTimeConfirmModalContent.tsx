import { useState } from "react";
import { validateHourInput, validateMinuteInput } from "@/utils/date";

interface TimeValue {
  period: "오전" | "오후";
  hour: string;
  minute: string;
}

interface SelectTimeConfirmModalContentProps {
  initialStartTime?: TimeValue;
  initialEndTime?: TimeValue;
  onChangeTime?: (startTime: TimeValue, endTime: TimeValue) => void;
}

const DEFAULT_TIME: TimeValue = {
  period: "오전",
  hour: "07",
  minute: "00",
};

export const SelectTimeConfirmModalContent = ({
  initialStartTime = DEFAULT_TIME,
  initialEndTime = DEFAULT_TIME,
  onChangeTime,
}: SelectTimeConfirmModalContentProps) => {
  const [startTime, setStartTime] = useState<TimeValue>(initialStartTime);
  const [endTime, setEndTime] = useState<TimeValue>(initialEndTime);

  const handleStartTimeChange = (field: keyof TimeValue, value: string) => {
    const newStartTime = { ...startTime, [field]: value };
    setStartTime(newStartTime);
    onChangeTime?.(newStartTime, endTime);
  };

  const handleEndTimeChange = (field: keyof TimeValue, value: string) => {
    const newEndTime = { ...endTime, [field]: value };
    setEndTime(newEndTime);
    onChangeTime?.(startTime, newEndTime);
  };

  const togglePeriod = (type: "start" | "end") => {
    if (type === "start") {
      const newPeriod = startTime.period === "오전" ? "오후" : "오전";
      handleStartTimeChange("period", newPeriod);
    } else {
      const newPeriod = endTime.period === "오전" ? "오후" : "오전";
      handleEndTimeChange("period", newPeriod);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* 타이틀 */}
      <h2 className="typo-subtitle text-gray-black">
        일정 시간을 선택해주세요
      </h2>

      {/* 시작 시간 */}
      <div className="flex items-center justify-center gap-4 bg-gray-5 rounded-xl px-6 py-4 w-full">
        <button
          type="button"
          onClick={() => togglePeriod("start")}
          className="typo-title text-gray-black min-w-[60px] cursor-pointer"
        >
          {startTime.period}
        </button>
        <input
          type="text"
          value={startTime.hour}
          onChange={(e) => {
            const validated = validateHourInput(e.target.value);
            if (validated !== null) {
              handleStartTimeChange("hour", validated);
            }
          }}
          className="typo-title text-gray-black w-12 text-center bg-transparent outline-none"
          maxLength={2}
          placeholder="00"
        />
        <span className="typo-title text-gray-black">:</span>
        <input
          type="text"
          value={startTime.minute}
          onChange={(e) => {
            const validated = validateMinuteInput(e.target.value);
            if (validated !== null) {
              handleStartTimeChange("minute", validated);
            }
          }}
          className="typo-title text-gray-black w-12 text-center bg-transparent outline-none"
          maxLength={2}
          placeholder="00"
        />
      </div>

      {/* 구분자 */}
      <span className="typo-body text-gray-60">부터</span>

      {/* 종료 시간 */}
      <div className="flex items-center justify-center gap-4 bg-gray-5 rounded-xl px-6 py-4 w-full">
        <button
          type="button"
          onClick={() => togglePeriod("end")}
          className="typo-title text-gray-black min-w-[60px] cursor-pointer"
        >
          {endTime.period}
        </button>
        <input
          type="text"
          value={endTime.hour}
          onChange={(e) => {
            const validated = validateHourInput(e.target.value);
            if (validated !== null) {
              handleEndTimeChange("hour", validated);
            }
          }}
          className="typo-title text-gray-black w-12 text-center bg-transparent outline-none"
          maxLength={2}
          placeholder="00"
        />
        <span className="typo-title text-gray-black">:</span>
        <input
          type="text"
          value={endTime.minute}
          onChange={(e) => {
            const validated = validateMinuteInput(e.target.value);
            if (validated !== null) {
              handleEndTimeChange("minute", validated);
            }
          }}
          className="typo-title text-gray-black w-12 text-center bg-transparent outline-none"
          maxLength={2}
          placeholder="00"
        />
      </div>
    </div>
  );
};

export type { TimeValue };
export default SelectTimeConfirmModalContent;
