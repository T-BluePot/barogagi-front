import { useEffect, useRef } from "react";
import { format } from "date-fns";

import { CalendarTitle } from "./CalendarTitle";
import Calendar from "./Calendar";
import type { CalendarProps } from "./Calendar";

import { ScheduleCardLite } from "./main/ScheduleCardLite";
import { smoothScrollTo } from "@/utils/smoothScrollTo";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scheduleSectionRef = useRef<HTMLDivElement>(null);
  const scheduleListRef = useRef<HTMLDivElement>(null);
  // 첫 렌더(진입 시 오늘 날짜가 이미 선택된 상태)에는 스크롤하지 않는다.
  // 사용자가 "누른" 결과일 때만 움직여야 달력이 제멋대로 튀지 않는다.
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    if (!hasSchedules) return;

    const container = scrollContainerRef.current;
    const section = scheduleSectionRef.current;
    if (!container || !section) return;

    // 앵커는 섹션 전체가 아니라 **첫 번째 카드**다.
    // 섹션 전체를 기준으로 하면 일정이 많을수록 이동량이 폭증해(1개 86px → 4개 354px)
    // 달력이 통째로 밀려 올라가며 격자가 드르륵 지나가는 느낌이 난다.
    // 첫 카드까지만 드러내면 개수와 무관하게 이동량이 일정하고, 나머지는 사용자가 이어서 스크롤한다.
    const anchor = scheduleListRef.current?.firstElementChild ?? section;

    // scrollIntoView 를 쓰면 안 된다. 그 기준은 스크롤포트 **맨 아래**인데,
    // 화면 아래 176px 는 FAB·탭바가 덮고 있어서 "보인다"고 판정돼도 실제론 가려진다.
    // 컨테이너가 .pb-tabbar 로 이미 그만큼을 여백으로 확보해 두었으므로,
    // 그 값을 그대로 읽어 '실제로 보이는 바닥'을 계산한다(값이 한 곳에서만 관리된다).
    const reservedBottom =
      parseFloat(getComputedStyle(container).paddingBottom) || 0;
    const visibleBottom = container.clientHeight - reservedBottom;
    // offsetTop 은 offsetParent 기준이라 컨테이너와 어긋난다(컨테이너가 static).
    // 화면 좌표 차이 + 현재 스크롤량으로 콘텐츠 좌표를 직접 구한다.
    const anchorBottom =
      anchor.getBoundingClientRect().bottom -
      container.getBoundingClientRect().top +
      container.scrollTop;

    const target = Math.min(
      anchorBottom - visibleBottom,
      container.scrollHeight - container.clientHeight
    );
    // 이미 충분히 보이면(target <= 현재 위치) 건드리지 않는다 — 위로 튀지 않도록
    if (target <= container.scrollTop) return;

    // scrollTo({ behavior: "smooth" }) 는 속도를 못 정해 휙 지나간다.
    // 디자인 시스템의 --ease-fitpl 곡선으로 직접 트윈한다.
    return smoothScrollTo(container, target);
    // selectedDate 문자열 기준 — 같은 날을 다시 눌렀을 땐 재실행하지 않는다
  }, [selectedDate, hasSchedules]);

  return (
    <div
      ref={scrollContainerRef}
      className="pb-tabbar flex flex-col w-full h-full bg-gray-5 overflow-y-auto hide-scrollbar"
    >
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

          <div
            ref={scheduleListRef}
            className="flex shrink-0 flex-col w-full px-6 gap-4 hide-scrollbar"
          >
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
