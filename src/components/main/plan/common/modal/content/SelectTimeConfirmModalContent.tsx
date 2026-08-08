import { validateHourInput, validateMinuteInput } from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import { useRef, useState } from "react";
import { MinuteQuickButtons } from "./MinuteQuickButtons";
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

/** HOURS 목록에서 시(時) 문자열의 인덱스 ("01" → 0 … "12" → 11) */
const hourToIndex = (hour: string) => Number(pad2(hour)) - 1;

/**
 * 시 칸을 steps 칸 이동하는 동안 정오/자정 경계를 몇 번 지났는지 센다.
 *
 * 경계는 11↔12 사이다 (오전11 → 오후12 = 정오, 오후11 → 오전12 = 자정).
 * - 앞으로 갈 때: 12(인덱스 11)에 들어서는 순간마다 1회
 * - 뒤로 갈 때: 12에서 11(인덱스 10)로 내려서는 순간마다 1회
 *
 * 관성 스크롤은 여러 칸을 한 번에 건너뛰므로 끝값만으로는 판단할 수 없다.
 * 예) 09 → 03 은 앞으로 6칸(정오 통과) 일 수도, 뒤로 6칸(통과 안 함) 일 수도 있다.
 */
const countNoonCrossings = (fromIndex: number, steps: number): number => {
  const mod12 = (n: number) => ((n % 12) + 12) % 12;
  let crossings = 0;
  if (steps > 0) {
    for (let j = fromIndex + 1; j <= fromIndex + steps; j++) {
      if (mod12(j) === 11) crossings++;
    }
  } else {
    for (let j = fromIndex - 1; j >= fromIndex + steps; j--) {
      if (mod12(j) === 10) crossings++;
    }
  }
  return crossings;
};

/**
 * 시(時)가 정오/자정을 지나면 오전/오후를 자동 전환한다.
 *
 * - steps 가 있으면(스크롤·화살표) 경로상 경계 통과 횟수가 홀수일 때 전환
 * - steps 가 없으면(직접 입력) 인접 이동으로 보고 11↔12 만 판정
 */
const applyHourChange = (
  time: TimeValue,
  newHour: string,
  steps?: number
): TimeValue => {
  const prev = pad2(time.hour);
  const next = pad2(newHour);

  const flips =
    steps != null && steps !== 0
      ? countNoonCrossings(hourToIndex(prev), steps) % 2 === 1
      : (prev === "11" && next === "12") || (prev === "12" && next === "11");

  const period = flips
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

  // state 의 최신값 미러. 리렌더 전에 연달아 들어오는 변경도 올바른 기준으로 계산하기 위함
  // (state 를 갱신할 때 항상 함께 갱신한다)
  const startTimeRef = useRef<TimeValue>(initialStartTime);
  const endTimeRef = useRef<TimeValue>(initialEndTime);

  const handleStartTimeChange = (
    field: keyof TimeValue,
    value: string,
    steps?: number
  ) => {
    // 클로저의 state 가 아니라 ref 의 최신값을 기준으로 계산한다.
    // 한 프레임에 여러 칸을 건너뛰어 onChange 가 연달아 불릴 때, 아직 반영되지 않은
    // 이전 렌더의 값을 기준으로 삼으면 경계를 지나도 오전/오후가 갱신되지 않는다.
    const base = startTimeRef.current;
    const newStartTime =
      field === "hour"
        ? applyHourChange(base, value, steps)
        : { ...base, [field]: value };
    startTimeRef.current = newStartTime;
    setStartTime(newStartTime);
    onChangeTime?.(newStartTime, endTimeRef.current);
  };

  const handleEndTimeChange = (
    field: keyof TimeValue,
    value: string,
    steps?: number
  ) => {
    const base = endTimeRef.current;
    const newEndTime =
      field === "hour"
        ? applyHourChange(base, value, steps)
        : { ...base, [field]: value };
    endTimeRef.current = newEndTime;
    setEndTime(newEndTime);
    onChangeTime?.(startTimeRef.current, newEndTime);
  };

  // 편집 중에는 순서 보정을 하지 않는다.
  // 예전엔 조정이 멈출 때마다(300ms) 보정이 끼어들어, 방금 맞춘 값이 뒤에서 밀리는 느낌이었다.
  // 보정은 확인(저장) 시점에 SelectTimeConfirmModal 이 한 번만 수행한다.

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* 타이틀 */}
      <h2 className="typo-subtitle text-gray-black">
        일정 시간을 선택해주세요
      </h2>

      {/* 시작 시간 */}
      <div className="bg-gray-5 rounded-xl px-6 py-3 w-full">
        {/* w-fit 래퍼로 감싸 분 지름길 버튼이 시간 그룹의 오른쪽 끝(분 칸)에 정렬되게 한다 */}
        <div className="mx-auto flex w-fit flex-col gap-4">
          <div className="flex items-center gap-4">
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
              onChange={(v, steps) => handleStartTimeChange("hour", v, steps)}
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
          <MinuteQuickButtons
            labelPrefix="시작"
            onSelect={(v) => handleStartTimeChange("minute", v)}
          />
        </div>
      </div>

      {/* 구분자 */}
      <span className="typo-body text-gray-60">부터</span>

      {/* 종료 시간 */}
      <div className="bg-gray-5 rounded-xl px-6 py-3 w-full">
        <div className="mx-auto flex w-fit flex-col gap-4">
          <div className="flex items-center gap-4">
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
              onChange={(v, steps) => handleEndTimeChange("hour", v, steps)}
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
          <MinuteQuickButtons
            labelPrefix="종료"
            onSelect={(v) => handleEndTimeChange("minute", v)}
          />
        </div>
      </div>
    </div>
  );
};

export type { TimeValue };
export default SelectTimeConfirmModalContent;
