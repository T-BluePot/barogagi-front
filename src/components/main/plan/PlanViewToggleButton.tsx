import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export type PlanViewType = "list" | "calendar";

interface PlanViewToggleButtonProps {
  viewType: PlanViewType;
  toggleViewType: () => void;
}

export const PlanViewToggleButton = ({
  viewType,
  toggleViewType,
}: PlanViewToggleButtonProps) => {
  return (
    <button
      onClick={toggleViewType}
      type="button"
      aria-label={viewType === "list" ? "달력으로 보기" : "목록으로 보기"}
      className="flex justify-center items-center px-3 py-2 gap-2 rounded-[10px] bg-gray-5 cursor-pointer"
    >
      {viewType === "calendar" ? (
        <FormatListBulletedIcon className="!text-[16px] text-gray-80 " />
      ) : (
        <CalendarTodayIcon className="!text-[16px] text-gray-80" />
      )}
      <div className="typo-description text-gray-80">
        {viewType === "list" ? "달력으로 보기" : "목록으로 보기"}
      </div>
    </button>
  );
};
