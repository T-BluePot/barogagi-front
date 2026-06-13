import {
  enforceTimeOrder,
  validateHourInput,
  validateMinuteInput,
} from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import { useEffect, useRef, useState } from "react";
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

const pad2 = (v: string) => v.padStart(2, "0");

// 조정이 멈췄다고 판단할 시간(ms) — 이 시간 동안 추가 변경이 없으면 보정 실행
const SETTLE_MS = 300;

/**
 * 시(時)가 11↔12 경계를 넘으면 오전/오후를 자동 전환한다.
 * (오전11 → 오후12, 오후11 → 오전12 처럼 정오/자정을 지나는 지점에서 뒤집힘)
 */
const applyHourChange = (time: TimeValue, newHour: string): TimeValue => {
  const prev = pad2(time.hour);
  const next = pad2(newHour);
  const crossesNoon =
    (prev === "11" && next === "12") || (prev === "12" && next === "11");
  const period = crossesNoon
    ? time.period === "오전"
      ? "오후"
      : "오전"
    : time.period;
  return { ...time, hour: newHour, period };
};

export const SelectTimeConfirmModalContent = ({
  initialStartTime = DEFAULT_START_TIME,
  initialEndTime = DEFAULT_END_TIME,
  onChangeTime,
}: SelectTimeConfirmModalContentProps) => {
  const [startTime, setStartTime] = useState<TimeValue>(initialStartTime);
  const [endTime, setEndTime] = useState<TimeValue>(initialEndTime);

  // 마지막으로 사용자가 조정한 칸 (보정 방향 결정용)
  const lastEditedRef = useRef<"start" | "end">("start");
  // 조정이 멈춘 뒤(settle) 보정을 실행하기 위한 디바운스 타이머
  const settleTimerRef = useRef<number | null>(null);

  const handleStartTimeChange = (field: keyof TimeValue, value: string) => {
    lastEditedRef.current = "start";
    const newStartTime =
      field === "hour"
        ? applyHourChange(startTime, value)
        : { ...startTime, [field]: value };
    setStartTime(newStartTime);
    onChangeTime?.(newStartTime, endTime);
  };

  const handleEndTimeChange = (field: keyof TimeValue, value: string) => {
    lastEditedRef.current = "end";
    const newEndTime =
      field === "hour"
        ? applyHourChange(endTime, value)
        : { ...endTime, [field]: value };
    setEndTime(newEndTime);
    onChangeTime?.(startTime, newEndTime);
  };

  // 시작/종료 조정이 멈추면(settle) 종료 > 시작이 되도록 보정
  useEffect(() => {
    if (settleTimerRef.current != null) {
      window.clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = window.setTimeout(() => {
      const corrected = enforceTimeOrder(
        startTime,
        endTime,
        lastEditedRef.current
      );
      if (corrected.start !== startTime) setStartTime(corrected.start);
      if (corrected.end !== endTime) setEndTime(corrected.end);
      if (corrected.start !== startTime || corrected.end !== endTime) {
        onChangeTime?.(corrected.start, corrected.end);
      }
    }, SETTLE_MS);

    return () => {
      if (settleTimerRef.current != null) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, [startTime, endTime, onChangeTime]);

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
