import { useRef, useState } from "react";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import PopMenu from "@/components/common/menu/PopMenu";
import ScheduleTitleInput from "../common/ScheduleTitleInput";

interface InfoHeaderProps {
  // 일정명 수정 모드
  editMode: boolean;
  setEditMode: (mode: boolean) => void;

  scheduleName: string; // 일정명
  setScheduleName: (name: string) => void; // 일정명 변경 함수 (실시간)
  onCommitScheduleName?: (finalName: string) => void; // 포커스 아웃 시 확정 콜백
  scheduleDate: string; // 일정 날짜

  onEnterReorder?: () => void; // kebab "목록 편집" → 순서 변경 모드 진입
  onDeleteSchedule?: () => void; // kebab "일정 삭제" → 일정 삭제 확인 모달
}

const ScheduleRouteInfoHeader = ({
  scheduleName,
  setScheduleName,
  onCommitScheduleName,
  scheduleDate,
  editMode,
  setEditMode,
  onEnterReorder,
  onDeleteSchedule,
}: InfoHeaderProps) => {
  // ----- kebab(더보기) 메뉴 — 일정명 편집(editMode)과 독립 -----
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const hasMenu = Boolean(onEnterReorder || onDeleteSchedule);

  return (
    <header className="flex flex-col w-full">
      {/* 날짜 영역 */}
      <div className="flex px-1 w-full justify-between">
        <span className="typo-subtitle text-gray-80">{scheduleDate}</span>
        {hasMenu && (
          <button
            type="button"
            aria-label="일정 메뉴"
            ref={menuBtnRef}
            onClick={() => setMenuAnchor(menuBtnRef.current)}
            className="flex items-center cursor-pointer"
          >
            <MoreVertIcon className="text-gray-40" />
          </button>
        )}
      </div>
      {hasMenu && (
        <PopMenu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          listItems={[
            {
              label: "목록 편집",
              children: <SwapVertIcon className="text-[16px]!" />,
              onClickItem: () => {
                setMenuAnchor(null);
                onEnterReorder?.();
              },
            },
            {
              status: "delete",
              label: "일정 삭제",
              children: (
                <DeleteOutlineIcon className="text-[16px]! text-alert-red!" />
              ),
              onClickItem: () => {
                setMenuAnchor(null);
                onDeleteSchedule?.();
              },
            },
          ]}
        />
      )}
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
              <span className="typo-title-01 text-start">{scheduleName}</span>
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
            onCommit={onCommitScheduleName}
          />
        )}
      </div>
    </header>
  );
};

export default ScheduleRouteInfoHeader;
