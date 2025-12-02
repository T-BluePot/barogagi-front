import { CourseCard } from "./CourseCard";
import type { Schedule } from "@/types/scheduleTypes";

interface ListViewProps {
  schedules: Schedule[];
  onclickCard: (scheduleNum: number) => void;
  onDelete: (scheduleNum: number) => void;
}

export const ListView = ({
  schedules,
  onclickCard,
  onDelete,
}: ListViewProps) => {
  return (
    <div className="flex flex-col w-full gap-4 pb-6">
      {schedules.map((schedule) => {
        return (
          <CourseCard
            key={schedule.scheduleNum}
            schedule={schedule}
            onclickCard={() => onclickCard(schedule.scheduleNum)}
            onDelete={() => onDelete(schedule.scheduleNum)}
          />
        );
      })}
    </div>
  );
};
