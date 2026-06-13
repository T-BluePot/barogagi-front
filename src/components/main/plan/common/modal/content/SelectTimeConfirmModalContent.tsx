import { useState } from "react";
import { validateHourInput, validateMinuteInput } from "@/utils/date";
import type { TimeValue } from "@/utils/date";

interface SelectTimeConfirmModalContentProps {
  initialStartTime?: TimeValue;
  initialEndTime?: TimeValue;
  onChangeTime?: (startTime: TimeValue, endTime: TimeValue) => void;
}

/** props로 시간이 전달되지 않았을 때 사용할 기본값 (시작 오전 9시 / 종료 오전 10시) */
const DEFAULT_START_TIME: TimeValue = { period: "오전", hour: "09", minute: "00" };
const DEFAULT_END_TIME: TimeValue = { period: "오전", hour: "10", minute: "00" };

export const SelectTimeConfirmModalContent = ({
  initialStartTime = DEFAULT_START_TIME,
  initialEndTime = DEFAULT_END_TIME,
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
          className="typo-title text-gray-black min-w-15 cursor-pointer"
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
          className="typo-title text-gray-black min-w-15 cursor-pointer"
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
