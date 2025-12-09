import { ScheduleListCard } from "./list/ScheduleListCard";
import type { Schedule } from "@/types/scheduleTypes";

interface ListViewProps {
  schedules: Schedule[];
  onClickCard: (scheduleNum: number) => void;
  onDelete: (scheduleNum: number) => void;
}

export const ListView = ({
  schedules,
  onClickCard,
  onDelete,
}: ListViewProps) => {
  return (
    <div className="flex flex-col w-full h-full gap-4 pb-6 overflow-y-auto hide-scrollbar">
      {schedules.map((schedule) => {
        return (
          <ScheduleListCard
            key={schedule.scheduleNum}
            schedule={schedule}
            onClickCard={() => onClickCard(schedule.scheduleNum)}
            onDelete={() => onDelete(schedule.scheduleNum)}
          />
        );
      })}
    </div>
  );
};
