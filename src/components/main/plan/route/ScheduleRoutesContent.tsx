import { useState } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ScheduleRoutesContentProps } from "@/types/main/plan/scheduleRoutes";
import { ROUTES_CREATE_TEXT } from "@/constants/texts/main/plan/routesCreate";

// --- 컴포넌트 영역 import
import ScheduleRouteInfoHeader from "@/components/main/plan/route/ScheduleRouteInfoHeader";

import PlanDetailCard from "@/components/main/plan/route/PlanDetailCard";
import PopMenu from "@/components/common/menu/PopMenu";
import CommonButton from "@/components/common/buttons/CommonButton";
import type { CardMenuAnchorInfo } from "@/types/main/plan/planListTypes";
import type { PlanRegistResDTO } from "@/api/types";

import RoutesCreateFooter from "@/components/main/plan/route/RoutesCreateFooter";

// --- 아이콘
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

// ----- 순서 변경 모드: 드래그 가능한 카드 래퍼 -----
// 드래그 리스너는 핸들(span)에만 바인딩 — 카드 본문 인터랙션 보존
interface SortablePlanCardProps {
  id: number;
  plan: PlanRegistResDTO;
  index: number;
  onOpenCardMenu: (info: CardMenuAnchorInfo) => void;
}

const SortablePlanCard = ({
  id,
  plan,
  index,
  onOpenCardMenu,
}: SortablePlanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <PlanDetailCard
        mode="detail"
        reorderMode
        plan={plan}
        index={index}
        isOpen={false}
        onToggleOpen={() => {}}
        onOpenCardMenu={onOpenCardMenu}
        dragHandle={
          <span
            {...listeners}
            aria-label="드래그해서 순서 변경"
            className="cursor-grab touch-none text-gray-40 flex items-center"
          >
            <DragIndicatorIcon className="text-title-02!" />
          </span>
        }
      />
    </div>
  );
};

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

  // ----- 순서 변경 모드 (detail 전용) -----
  // 일정명 편집(editMode)과는 독립된 상태 — 켜지면 카드에 드래그 핸들 표시
  const [reorderMode, setReorderMode] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동해야 드래그 시작 (탭과 구분)
      },
    })
  );

  // 드래그 완료 → 부모에 (from, to) 인덱스 전달 (시간 재계산 없이 배열 순서만 변경)
  const handleDragEnd = (event: DragEndEvent) => {
    if (!isEditable) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = plans.findIndex((p, i) => (p.planNum ?? i) === active.id);
    const newIndex = plans.findIndex((p, i) => (p.planNum ?? i) === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    props.onReorder?.(oldIndex, newIndex);
  };

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
      <div className="flex flex-col w-full p-6 bg-gray-white">
        <ScheduleRouteInfoHeader
          editMode={editMode}
          setEditMode={setEditMode}
          scheduleName={scheduleName}
          setScheduleName={onChangeScheduleName}
          onCommitScheduleName={onCommitScheduleName}
          scheduleDate={scheduleDate}
          onEnterReorder={isEditable ? () => setReorderMode(true) : undefined}
          onDeleteSchedule={isEditable ? props.onDeleteSchedule : undefined}
          onOpenInfoSheet={isEditable ? props.onOpenInfoSheet : undefined}
        />
        {/* 일정 메모 라인 (detail 전용) — 탭하면 일정 정보 바텀시트 오픈 */}
        {isEditable && props.onOpenInfoSheet && (
          <button
            type="button"
            onClick={props.onOpenInfoSheet}
            className="text-left w-full px-1 mt-0.5"
          >
            {props.scheduleMemo ? (
              <span className="typo-caption text-gray-60">
                {props.scheduleMemo}
              </span>
            ) : (
              <span className="flex items-center gap-1 typo-caption text-gray-40">
                <AddIcon className="text-[16px]!" />이 일정에 대한 메모
              </span>
            )}
          </button>
        )}
      </div>
      <motion.div
        className="flex flex-col flex-1 w-full min-h-0 p-6 overflow-y-auto gap-4 hide-scrollbar"
        layoutScroll
      >
        {isEditable && reorderMode ? (
          // 순서 변경 모드: 핸들 드래그로 재정렬 (시간은 각 계획에 고정)
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={plans.map((plan, index) => plan.planNum ?? index)}
              strategy={verticalListSortingStrategy}
            >
              {plans.map((plan, index) => (
                <SortablePlanCard
                  key={plan.planNum ?? index}
                  id={plan.planNum ?? index}
                  plan={plan}
                  index={index}
                  onOpenCardMenu={handleOpenCardMenu}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          plans.map((plan, index) => {
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
          })
        )}

        {/* 하단 액션: 순서 변경 모드에선 "완료"(일괄 저장), 평상시엔 "계획 추가하기" */}
        {isEditable &&
          (reorderMode ? (
            <CommonButton
              label="완료"
              onClick={() => {
                setReorderMode(false);
                props.onReorderCommit?.();
              }}
            />
          ) : (
            props.onAddPlan && (
              <button
                type="button"
                onClick={props.onAddPlan}
                className="flex items-center justify-center gap-1.5 w-full py-4 rounded-2xl bg-gray-10 text-gray-60 typo-body active:bg-gray-20 transition-colors"
              >
                <AddIcon className="text-title-02!" />
                계획 추가하기
              </button>
            )
          ))}
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
