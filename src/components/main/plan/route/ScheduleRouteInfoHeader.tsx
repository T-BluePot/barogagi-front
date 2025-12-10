import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { formatDate } from "@/utils/date";

import ScheduleTitleInput from "../common/ScheduleTitleInput";

interface InfoHeaderProps {
  // 일정명 수정 모드
  editMode: boolean;
  setEditMode: (mode: boolean) => void;

  scheduleName: string; // 일정명
  setScheduleName: (name: string) => void; // 일정명 변경 함수
  scheduleDate: Date; // 일정 날짜
}

const ScheduleRouteInfoHeader = ({
  scheduleName,
  setScheduleName,
  scheduleDate,
  editMode,
  setEditMode,
}: InfoHeaderProps) => {
  return (
    <header className="flex flex-col w-full">
      {/* 날짜 영역 */}
      <div className="flex px-1 w-full justify-between">
        <span className="typo-subtitle text-gray-80">
          {formatDate(scheduleDate)}
        </span>
      </div>
      {/* 일정명 영역 */}
      <div className="flex flex-col w-full h-12 pb-[1px] items-baseline gap-2">
        {!editMode && (
          <button
            className="cursor-pointer"
            onClick={() => {
              setEditMode(true);
            }}
          >
            <div className="flex flex-row items-end gap-1 px-1 py-2">
              <span className="typo-title-01">{scheduleName}</span>
              <div>
                <EditOutlinedIcon fontSize="small" className="text-gray-40" />
              </div>
            </div>
          </button>
        )}
        {editMode && (
          <ScheduleTitleInput
            scheduleName={scheduleName}
            setScheduleName={setScheduleName}
            setEditMode={setEditMode}
          />
        )}
      </div>
    </header>
  );
};

export default ScheduleRouteInfoHeader;
