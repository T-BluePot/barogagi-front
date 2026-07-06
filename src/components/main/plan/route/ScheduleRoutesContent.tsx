import { useState } from "react";
import { motion } from "framer-motion";
import type { ScheduleRoutesContentProps } from "@/types/main/plan/scheduleRoutes";
import { ROUTES_CREATE_TEXT } from "@/constants/texts/main/plan/routesCreate";

// --- 컴포넌트 영역 import
import ScheduleRouteInfoHeader from "@/components/main/plan/route/ScheduleRouteInfoHeader";

import PlanDetailCard from "@/components/main/plan/route/PlanDetailCard";
import PopMenu from "@/components/common/menu/PopMenu";
import type { CardMenuAnchorInfo } from "@/types/main/plan/planListTypes";

import RoutesCreateFooter from "@/components/main/plan/route/RoutesCreateFooter";

// --- 아이콘
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

const ScheduleRoutesContent = (props: ScheduleRoutesContentProps) => {
  const { header, plans } = props;
  // ----- 헤더 영역 -----
  const { scheduleDate, scheduleName, onChangeScheduleName, onCommitScheduleName } =
    header;
  const [editMode, setEditMode] = useState<boolean>(false);

  // ----- 리스트 영역 -----
  // 현재 열려 있는 카드의 planNum (없으면 null)
  const [openPlanNum, setOpenPlanNum] = useState<number | null>(null);

  const handleToggleOpen = (planNum: number) => {
    setOpenPlanNum((prev) => (prev === planNum ? null : planNum));
  };

  // ----- 팝메뉴 영역 -----
  const isEditable = props.isEditable === true; // 카드(plan) 편집 여부

  // 메뉴 팝오버용 상태
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  // 어떤 카드의 "메뉴 팝오버"가 열려 있는지
  const [menuPlanNum, setMenuPlanNum] = useState<number | null>(null);

  // 팝메뉴 열기
  const handleOpenCardMenu = (info: CardMenuAnchorInfo) => {
    // 편집 모드가 아닐 경우 방지
    if (!isEditable) return;

    setMenuPlanNum(info.planNum);
    setMenuAnchorEl(info.anchorEl);
  };

  // 팝메뉴 닫기
  const handleCloseMenu = () => {
    setMenuPlanNum(null);
    setMenuAnchorEl(null);
  };

  const handleClickEdit = () => {
    if (!isEditable || menuPlanNum == null) return;
    props.onRequestEdit(menuPlanNum);
    handleCloseMenu();
  };

  const handleClickDelete = () => {
    if (!isEditable || menuPlanNum == null) return;
    props.onRequestDelete(menuPlanNum);
    handleCloseMenu();
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-5">
      {isEditable && (
        <PopMenu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleCloseMenu}
          listItems={[
            {
              label: ROUTES_CREATE_TEXT.POP_MENU.EDIT_LABEL,
              children: <ModeEditIcon className="text-[16px]!" />,
              onClickItem: handleClickEdit,
            },
            {
              status: "delete",
              label: ROUTES_CREATE_TEXT.POP_MENU.DELETE_LABEL,
              children: (
                <DeleteOutlineIcon className="text-[16px]! text-alert-red!" />
              ),
              onClickItem: handleClickDelete,
            },
          ]}
        />
      )}
      <div className="flex w-full p-6 bg-gray-white">
        <ScheduleRouteInfoHeader
          editMode={editMode}
          setEditMode={setEditMode}
          scheduleName={scheduleName}
          setScheduleName={onChangeScheduleName}
          onCommitScheduleName={onCommitScheduleName}
          scheduleDate={scheduleDate}
        />
      </div>
      <motion.div
        className="flex flex-col flex-1 w-full min-h-0 p-6 overflow-y-auto gap-4 hide-scrollbar"
        layoutScroll
      >
        {plans.map((plan, index) => {
          const planNum = plan.planNum ?? index;
          const isOpen = openPlanNum === planNum;

          return (
            // layout 애니메이션이 이 div 안에서만 일어나도록 격리
            <div key={planNum} style={{ isolation: "isolate" }}>
              {isEditable ? (
                <PlanDetailCard
                  plan={plan}
                  index={index}
                  isOpen={isOpen}
                  onToggleOpen={() => handleToggleOpen(planNum)}
                  mode="detail"
                  onOpenCardMenu={handleOpenCardMenu}
                  noteValue={props.notes?.[planNum] ?? ""}
                  onChangeNote={(v) => props.onChangeNote?.(planNum, v)}
                  onCommitNote={() => props.onCommitNote?.(planNum)}
                />
              ) : (
                <PlanDetailCard
                  plan={plan}
                  index={index}
                  isOpen={isOpen}
                  onToggleOpen={() => handleToggleOpen(planNum)}
                  mode="create"
                  kept={props.keptIndexes?.has(index) ?? false}
                  onToggleKept={() => props.onToggleKept?.(index)}
                />
              )}
            </div>
          );
        })}

        {isEditable && props.onAddPlan && (
          <button
            type="button"
            onClick={props.onAddPlan}
            className="flex items-center justify-center gap-1.5 w-full py-4 rounded-2xl bg-gray-10 text-gray-60 typo-body active:bg-gray-20 transition-colors"
          >
            <AddIcon className="text-title-02!" />
            계획 추가하기
          </button>
        )}
      </motion.div>

      {!isEditable && (
        <div className="mt-auto">
          <RoutesCreateFooter
            onConfirm={props.footer.onClickConfirm}
            onRegenerate={props.footer.onRegenerate}
            keptCount={props.footer.keptCount}
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleRoutesContent;
