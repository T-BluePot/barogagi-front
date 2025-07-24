import { CourseCard } from "./CourseCard";
import type { Schedule } from "@/types/schedule";

interface ListViewProps {
  schedules: Schedule[];
  onEdit: () => void;
  onDelete: () => void;
}

export const ListView = ({ schedules, onEdit, onDelete }: ListViewProps) => {
  return (
    <div className="flex flex-col w-full gap-4 pb-6">
      {schedules.map((schedule, idx) => {
        return (
          <CourseCard
            key={idx}
            userNum={schedule.userNum}
            scheduleNum={schedule.scheduleNum}
            date={schedule.date}
            scheduleTitle={schedule.scheduleTitle}
            tags={schedule.tags}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};
