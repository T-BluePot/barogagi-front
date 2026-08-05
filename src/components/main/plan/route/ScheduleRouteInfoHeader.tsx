import EditIcon from "@mui/icons-material/Edit";

import ScheduleTitleInput from "../common/ScheduleTitleInput";

interface InfoHeaderProps {
  // 일정명 수정 모드
  editMode: boolean;
  setEditMode: (mode: boolean) => void;

  scheduleName: string; // 일정명
  setScheduleName?: (name: string) => void; // 일정명 변경 함수 (실시간) — readOnly면 불필요
  onCommitScheduleName?: (finalName: string) => void; // 포커스 아웃 시 확정 콜백
  scheduleDate: string; // 일정 날짜

  // detail 전용: 제목 탭 시 인라인 편집 대신 일정 정보 바텀시트 오픈
  onOpenInfoSheet?: () => void;

  /**
   * share(공유 링크) 뷰처럼 조회만 가능한 화면.
   * 제목을 버튼이 아닌 텍스트로 렌더하고 편집 아이콘도 감춘다.
   * (이 가드가 없으면 onOpenInfoSheet가 없는 화면에서 제목을 탭했을 때
   *  create용 인라인 편집 모드로 들어가 버린다)
   */
  readOnly?: boolean;
}

const ScheduleRouteInfoHeader = ({
  scheduleName,
  setScheduleName,
  onCommitScheduleName,
  scheduleDate,
  editMode,
  setEditMode,
  onOpenInfoSheet,
  readOnly = false,
}: InfoHeaderProps) => {
  return (
    <header className="flex flex-col w-full gap-2">
      {/* 날짜 영역 */}
      <div className="flex px-1 w-full justify-between">
        <span className="typo-subtitle text-gray-80">{scheduleDate}</span>
      </div>
      {/* 일정명 영역 */}
      <div className="flex w-full items-center gap-2">
        {/* 편집 수단이 하나도 없으면(readOnly거나, 시트 오픈·인라인 편집 콜백이 모두 미제공)
            제목을 텍스트로만 렌더한다. 이렇게 안 하면 콜백 없는 화면에서 연필을 눌러
            편집 모드로 들어가 타이핑이 먹통이 되는 상태가 생긴다. */}
        {(readOnly || (!onOpenInfoSheet && !setScheduleName)) && (
          <span className="typo-title-01 text-start px-1">{scheduleName}</span>
        )}
        {!readOnly && !editMode && (onOpenInfoSheet || setScheduleName) && (
          <button
            type="button"
            className="flex items-center justify-between w-full px-1 cursor-pointer"
            onClick={() => {
              // detail: 일정 정보 바텀시트 / create: 기존 인라인 편집
              if (onOpenInfoSheet) {
                onOpenInfoSheet();
              } else {
                // 위 렌더 조건상 여기 도달 시 setScheduleName이 반드시 존재한다
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
        {!readOnly && editMode && setScheduleName && (
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
