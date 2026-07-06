import EditIcon from "@mui/icons-material/Edit";

import ScheduleTitleInput from "../common/ScheduleTitleInput";

interface InfoHeaderProps {
  // 일정명 수정 모드
  editMode: boolean;
  setEditMode: (mode: boolean) => void;

  scheduleName: string; // 일정명
  setScheduleName: (name: string) => void; // 일정명 변경 함수 (실시간)
  onCommitScheduleName?: (finalName: string) => void; // 포커스 아웃 시 확정 콜백
  scheduleDate: string; // 일정 날짜

  // detail 전용: 제목 탭 시 인라인 편집 대신 일정 정보 바텀시트 오픈
  onOpenInfoSheet?: () => void;
}

const ScheduleRouteInfoHeader = ({
  scheduleName,
  setScheduleName,
  onCommitScheduleName,
  scheduleDate,
  editMode,
  setEditMode,
  onOpenInfoSheet,
}: InfoHeaderProps) => {
  return (
    <header className="flex flex-col w-full gap-1">
      {/* 날짜 영역 */}
      <div className="flex px-1 w-full justify-between">
        <span className="typo-subtitle text-gray-80">{scheduleDate}</span>
      </div>
      {/* 일정명 영역 */}
      <div className="flex w-full items-center gap-2">
        {!editMode && (
          <button
            type="button"
            className="flex items-center justify-between w-full px-1 cursor-pointer"
            onClick={() => {
              // detail: 일정 정보 바텀시트 / create: 기존 인라인 편집
              if (onOpenInfoSheet) {
                onOpenInfoSheet();
              } else {
                setEditMode(true);
              }
            }}
          >
            <span className="typo-title-01 text-start">{scheduleName}</span>
            <div
              aria-hidden="true"
              className="shrink-0 w-7 h-7 rounded-full bg-gray-10 flex items-center justify-center"
            >
              <EditIcon className="text-caption! text-gray-50" />
            </div>
          </button>
        )}
        {editMode && (
          <ScheduleTitleInput
            scheduleName={scheduleName}
            setScheduleName={setScheduleName}
            setEditMode={setEditMode}
            onCommit={onCommitScheduleName}
          />
        )}
      </div>
    </header>
  );
};

export default ScheduleRouteInfoHeader;
