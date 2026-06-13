import { validateHourInput, validateMinuteInput } from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import { useState } from "react";
import { ScrollableTimeField } from "./ScrollableTimeField";

interface SelectTimeConfirmModalContentProps {
  initialStartTime?: TimeValue;
  initialEndTime?: TimeValue;
  onChangeTime?: (startTime: TimeValue, endTime: TimeValue) => void;
}

/** props로 시간이 전달되지 않았을 때 사용할 기본값 (시작 오전 9시 / 종료 오전 10시) */
const DEFAULT_START_TIME: TimeValue = { period: "오전", hour: "09", minute: "00" };
const DEFAULT_END_TIME: TimeValue = { period: "오전", hour: "10", minute: "00" };

const PERIODS = ["오전", "오후"];
// 스크롤 이동/검증 모두 2자리 0패딩 문자열 기준
const HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

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

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* 타이틀 */}
      <h2 className="typo-subtitle text-gray-black">
        일정 시간을 선택해주세요
      </h2>

      {/* 시작 시간 */}
      <div className="flex items-center justify-center gap-4 bg-gray-5 rounded-xl px-6 py-3 w-full">
        <ScrollableTimeField
          value={startTime.period}
          items={PERIODS}
          wrap={false}
          ariaLabel="시작 오전 오후"
          widthClass="w-15"
          onChange={(v) => handleStartTimeChange("period", v)}
        />
        <ScrollableTimeField
          value={startTime.hour}
          items={HOURS}
          editable
          validate={validateHourInput}
          ariaLabel="시작 시"
          onChange={(v) => handleStartTimeChange("hour", v)}
        />
        <span className="text-[18px] font-semibold text-gray-black">:</span>
        <ScrollableTimeField
          value={startTime.minute}
          items={MINUTES}
          editable
          validate={validateMinuteInput}
          ariaLabel="시작 분"
          onChange={(v) => handleStartTimeChange("minute", v)}
        />
      </div>

      {/* 구분자 */}
      <span className="typo-body text-gray-60">부터</span>

      {/* 종료 시간 */}
      <div className="flex items-center justify-center gap-4 bg-gray-5 rounded-xl px-6 py-3 w-full">
        <ScrollableTimeField
          value={endTime.period}
          items={PERIODS}
          wrap={false}
          ariaLabel="종료 오전 오후"
          widthClass="w-15"
          onChange={(v) => handleEndTimeChange("period", v)}
        />
        <ScrollableTimeField
          value={endTime.hour}
          items={HOURS}
          editable
          validate={validateHourInput}
          ariaLabel="종료 시"
          onChange={(v) => handleEndTimeChange("hour", v)}
        />
        <span className="text-[18px] font-semibold text-gray-black">:</span>
        <ScrollableTimeField
          value={endTime.minute}
          items={MINUTES}
          editable
          validate={validateMinuteInput}
          ariaLabel="종료 분"
          onChange={(v) => handleEndTimeChange("minute", v)}
        />
      </div>
    </div>
  );
};

export type { TimeValue };
export default SelectTimeConfirmModalContent;
