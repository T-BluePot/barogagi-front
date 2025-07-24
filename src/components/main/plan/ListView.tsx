import { CourseCard } from "./CourseCard";

export interface Schedule {
  scheduleNum: string | number;
  scheduleNm: string; // 예: "서울 데이트 코스"
  date: string; // 예: "2025년 4월 25일"
  tags: string[]; // 예: ["이색체험", "서울"]
}

interface ListViewProps {
  schedules: Schedule[];
  onEdit: () => void;
  onDelete: () => void;
}

export const ListView = ({ schedules, onEdit, onDelete }: ListViewProps) => {
  return (
    <div className="flex flex-col w-full gap-4 pb-6">
      {schedules.map((plan, idx) => {
        return (
          <CourseCard
            key={idx}
            scheduleNum={plan.scheduleNum}
            date={plan.date}
            title={plan.scheduleNm}
            tags={plan.tags}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};
