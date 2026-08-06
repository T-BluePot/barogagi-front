import { useRef, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import PopMenu from "@/components/common/menu/PopMenu";

import type { PopListProps } from "@/components/common/menu/Poplist";

interface ScheduleDetailMenuProps {
  onEnterReorder: () => void; // kebab "목록 편집" → 순서 변경 모드 진입
  onDeleteSchedule: () => void; // kebab "일정 삭제" → 일정 삭제 확인 모달
  /** 계획이 2개 이상일 때만 true. 1개짜리 일정은 바꿀 순서가 없어 항목 자체를 숨긴다 */
  canReorder: boolean;
}

/**
 * 일정 상세 앱 헤더용 kebab(더보기) 메뉴
 * - "목록 편집": 순서 변경 모드 진입 (계획 2개 이상일 때만 노출)
 * - "일정 삭제": 일정 삭제 확인 모달 오픈
 */
const ScheduleDetailMenu = ({
  onEnterReorder,
  onDeleteSchedule,
  canReorder,
}: ScheduleDetailMenuProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        type="button"
        aria-label="일정 메뉴"
        ref={menuBtnRef}
        onClick={() => setMenuAnchor(menuBtnRef.current)}
        className="flex items-center cursor-pointer"
      >
        <MoreVertIcon className="text-gray-40" />
      </button>
      <PopMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        listItems={[
          // 계획이 1개면 바꿀 순서가 없다 → 항목을 비활성이 아니라 아예 노출하지 않는다
          ...(canReorder
            ? [
                {
                  label: "목록 편집",
                  children: <SwapVertIcon className="text-[16px]!" />,
                  onClickItem: () => {
                    setMenuAnchor(null);
                    onEnterReorder();
                  },
                } satisfies PopListProps,
              ]
            : []),
          {
            status: "delete",
            label: "일정 삭제",
            children: (
              <DeleteOutlineIcon className="text-[16px]! text-alert-red!" />
            ),
            onClickItem: () => {
              setMenuAnchor(null);
              onDeleteSchedule();
            },
          },
        ]}
      />
    </>
  );
};

export default ScheduleDetailMenu;
