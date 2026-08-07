import { ScheduleList, type ScheduleCardActions } from "./ScheduleList";
import type { Schedule } from "@/types/scheduleTypes";
import ListViewDivider from "./ListViewDivider";

interface ListViewProps extends ScheduleCardActions {
  schedules: Schedule[]; // 현재 일정 (필수)
  pastSchedules?: Schedule[]; // 지난 일정 (선택)
}

const ListView = ({
  schedules, // 필수
  pastSchedules, // 선택
  onClickCard,
  onDelete,
}: ListViewProps) => {
  const hasPast = pastSchedules && pastSchedules.length > 0;
  return (
    // 탭바 여백은 **이 스크롤러 자신**이 갖는다.
    // 상위 래퍼에 padding 으로 주면 h-full 이 부모 content box(패딩 제외)를 채워서
    // 스크롤러 자체가 화면 바닥보다 위에서 끝난다 → 카드가 그 지점에서 뚝 잘린다.
    <div className="pb-tabbar flex flex-col w-full h-full gap-4 overflow-y-scroll hide-scrollbar">
      <ScheduleList
        schedules={schedules}
        onClickCard={onClickCard}
        onDelete={onDelete}
      />
      {/* 지난 일정이 있을 때: 구분선 + 지난 일정 리스트 */}
      {hasPast && (
        <div className="flex flex-col gap-4">
          <ListViewDivider />
          <ScheduleList
            isPast
            schedules={pastSchedules!}
            onClickCard={onClickCard}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
};

export default ListView;
