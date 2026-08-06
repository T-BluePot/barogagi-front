import { useEffect, useRef } from "react";
import { format } from "date-fns";

import { CalendarTitle } from "./CalendarTitle";
import Calendar from "./Calendar";
import type { CalendarProps } from "./Calendar";

import { ScheduleCardLite } from "./main/ScheduleCardLite";
import type { Schedule } from "@/types/scheduleTypes";

interface CalendarViewProps extends CalendarProps {
  schedules: Schedule[];
  onClickCard: (scheduleNum: number) => void;
  onDelete: (scheduleNum: number) => void;
}

export const CalendarView = ({
  schedules,
  onClickCard,
  onDelete,
  ...props
}: CalendarViewProps) => {
  // 선택한 날짜에 일정이 있는지
  const selectedDate = props.selectedDate
    ? format(props.selectedDate, "yyyy-MM-dd")
    : "";

  // 해당 날짜 일정 필터링
  const filteredSchedules = schedules.filter(
    (schedule) => schedule.startDate === selectedDate
  );

  // 일정 존재 여부
  const hasSchedules = filteredSchedules.length > 0;

  // 달력이 화면을 거의 채워서, 날짜를 눌러도 아래 일정 카드가 뷰포트 밖에 있으면
  // 아무 일도 안 일어난 것처럼 보인다 → 일정이 있을 때만 목록을 시야로 끌어온다.
  const scheduleSectionRef = useRef<HTMLDivElement>(null);
  // 첫 렌더(진입 시 오늘 날짜가 이미 선택된 상태)에는 스크롤하지 않는다.
  // 사용자가 "누른" 결과일 때만 움직여야 달력이 제멋대로 튀지 않는다.
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    if (!hasSchedules) return;

    // block: "nearest" — 이미 보이면 안 움직이고, 가려져 있을 때만 최소한으로 스크롤한다.
    scheduleSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
    // selectedDate 문자열 기준 — 같은 날을 다시 눌렀을 땐 재실행하지 않는다
  }, [selectedDate, hasSchedules]);

  return (
    <div className="pb-tabbar flex flex-col w-full h-full bg-gray-5 overflow-y-auto hide-scrollbar">
      <div className="flex-none">
        <Calendar {...props} />
      </div>
      {/* shrink-0 필수 — flex-1(= flex:1 1 0%)로 두면 스크롤 컨테이너 안에서
          넘치는 대신 남은 공간에 눌려 들어가, scrollHeight 가 clientHeight 를
          넘지 못해 스크롤이 아예 생기지 않는다. 자연 높이를 유지해야 스크롤된다. */}
      {props.selectedDate && (
        <div
          ref={scheduleSectionRef}
          className="flex shrink-0 flex-col py-6 items-baseline gap-4"
        >
          <CalendarTitle
            selectedDate={props.selectedDate}
            subTitle={!hasSchedules ? "일정이 없습니다." : undefined}
          />

          <div className="flex shrink-0 flex-col w-full px-6 gap-4 hide-scrollbar">
            {filteredSchedules.map((schedule) => {
              return (
                <ScheduleCardLite
                  key={schedule.scheduleNum}
                  schedule={schedule}
                  onClickCard={() => onClickCard(schedule.scheduleNum)}
                  onDelete={() => onDelete(schedule.scheduleNum)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
