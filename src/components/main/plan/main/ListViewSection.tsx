import { ScheduleList, type ScheduleCardActions } from "./ScheduleList";
import type { Schedule } from "@/types/scheduleTypes";
import ListViewSectionDivider from "./ListViewSectionDivider";

interface ListViewSectionProps extends ScheduleCardActions {
  schedules: Schedule[]; // 현재 일정 (필수)
  pastSchedules?: Schedule[]; // 지난 일정 (선택)
}

const ListViewSection = ({
  schedules, // 필수
  pastSchedules, // 선택
  onClickCard,
  onDelete,
}: ListViewSectionProps) => {
  const hasPast = pastSchedules && pastSchedules.length > 0;
  return (
    <div className="flex flex-col w-full h-full pb-6 gap-4 overflow-y-scroll hide-scrollbar">
      <ScheduleList
        schedules={schedules}
        onClickCard={onClickCard}
        onDelete={onDelete}
      />
      {/* 지난 일정이 있을 때: 구분선 + 지난 일정 리스트 */}
      {hasPast && (
        <div className="flex flex-col gap-4">
          <ListViewSectionDivider />
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

export default ListViewSection;
