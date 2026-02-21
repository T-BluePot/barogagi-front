import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlanSettingForm } from "@/components/main/plan/PlanSettingForm";
import DeletePlanModal from "@/components/main/plan/create/DeletePlanModal";
import type { PlanData } from "@/components/main/plan/PlanCard";
import PlanCategoryBottomModal from "@/components/main/plan/common/modal/PlanCategoryBottomModal";
import PlanFormModal from "@/components/main/plan/common/modal/PlanFormModal";
import { SelectTimeConfirmModal } from "@/components/main/plan/common/modal/SelectTimeConfirmModal";
import { SelectRegionConfirmModal } from "@/components/main/plan/common/modal/SelectRegionConfirmModal";
import { SelectTagConfirmModal } from "@/components/main/plan/common/modal/SelectTagConfirmModal";
import type { RegionOption } from "@/components/main/plan/common/modal/content/SelectRegionConfirmModalContent";
import type { TagOption } from "@/components/main/plan/common/modal/content/SelectTagConfirmModalContent";
import { timeValueToHHmm, hhmmToTimeValue } from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import Button from "@/components/common/buttons/CommonButton";
import { ROUTES } from "@/constants/routes";
import { useConfirmModalStore } from "@/stores/confirmModalStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import { usePlanTimeValidation } from "@/hooks/usePlanTimeValidation";

/**
 * PlanSettingPage - 일정 구성 페이지
 *
 * [페이지 흐름]
 * 1. "+ 일정 추가" 버튼 → 카테고리 선택 모달 → 카테고리 선택 → PlanFormModal(Create 모드) 열림
 * 2. PlanFormModal 안에서 시간 / 장소 / 태그를 각각 선택 (하위 모달)
 * 3. PlanFormModal 닫기 → 시간 유효성 검증 통과 시 일정 카드가 리스트에 추가됨
 * 4. 기존 카드 클릭 → PlanFormModal(Edit 모드)로 수정 가능
 * 5. 카드 스와이프 → 삭제 모달로 일정 삭제
 * 6. 드래그 앤 드롭으로 일정 순서 변경
 * 7. "다음" 버튼 → 스타일 선택 페이지로 이동
 *
 * [모달 계층 구조]
 * - PlanCategoryBottomModal   : 카테고리 선택 (BottomModal)
 * - PlanFormModal             : 일정 추가/수정 폼 (BottomModal)
 *   ├─ SelectTimeConfirmModal   : 시간 선택 (ConfirmModal, z-200)
 *   ├─ SelectRegionConfirmModal : 장소 선택 (ConfirmModal, z-200)
 *   └─ SelectTagConfirmModal    : 태그 선택 (ConfirmModal, z-200)
 * - DeletePlanModal           : 삭제 확인 (ConfirmModal)
 * - AlertModal / ConfirmModal : 유효성 검증 피드백 (전역 스토어)
 */
import type { SelectedCategoryItemType } from "@/types/api/scheduleTypes";

export const PlanSettingPage = () => {
  const navigate = useNavigate();

  // --- 전역 모달 스토어 ---
  const { openConfirmModal } = useConfirmModalStore();
  const { openAlertModal } = useAlertModalStore();

  // --- 위치 선택 페이지에서 저장한 지역 목록 ---
  const selectedRegions = useRegionSelectionStore((s) => s.selectedRegions);

  // --- 일정 카드 리스트 ---
  const [items, setItems] = useState<PlanData[]>([]);

  // --- 시간 유효성 검증 훅 (순서 역전, 중복, 시작≥종료 등) ---
  const { validatePlanTime } = usePlanTimeValidation(items);
  // ============================================
  // 1) 일정 삭제
  //    카드 스와이프 → 삭제 버튼 → 삭제 확인 모달
  // ============================================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(
    null
  );

  const handleDeleteClick = (id: string | number) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      setItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  // --- 드래그 앤 드롭 순서 변경 ---
  const handleOrderChange = (newItems: PlanData[]) => {
    setItems(newItems);
  };

  // --- "+일정 추가" 버튼 → 카테고리 선택 모달 열기 ---
  const handleAddPlan = () => {
    handleCategoryModalOpen();
  };

  // ============================================
  // 2) PlanFormModal - 일정 추가/수정 폼
  //    Create 모드: 새 일정 작성 (카테고리 선택 직후)
  //    Edit 모드  : 기존 카드 클릭 시 수정
  // ============================================

  // DRAFT_ID: 시간/장소 모달에서 "아직 저장되지 않은 새 일정"을 식별하는 임시 ID
  //           기존 카드 ID와 구분하여, 모달 결과를 draft에 반영할지 items에 반영할지 분기
  const DRAFT_ID = "__draft__";
  const [isPlanFormModalOpen, setIsPlanFormModalOpen] = useState(false);

  // 폼에서 작성 중인 임시 데이터 (저장 전까지 여기에 보관)
  const [planFormDraft, setPlanFormDraft] = useState<{
    planNm: string;
    startTime?: string;
    endTime?: string;
    address?: string;
    tags?: string[];
  } | null>(null);

  // Edit 모드 전용: 수정 대상 카드 ID / 메모
  const [editTargetId, setEditTargetId] = useState<string | number | null>(
    null
  );
  const [editNote, setEditNote] = useState("");

  // ============================================
  // 3) 시간 선택 모달 (SelectTimeConfirmModal)
  //    PlanFormModal 안의 "시간 추가" 클릭 시 열림
  //    결과: DRAFT_ID면 draft에, 아니면 해당 카드에 직접 반영
  // ============================================
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [timeEditTargetId, setTimeEditTargetId] = useState<
    string | number | null
  >(null);

  const handleTimeClick = (id: string | number) => {
    setTimeEditTargetId(id);
    setIsTimeModalOpen(true);
  };

  const handleTimeConfirm = (startTime: TimeValue, endTime: TimeValue) => {
    if (timeEditTargetId === null) return;

    if (timeEditTargetId === DRAFT_ID) {
      setPlanFormDraft((prev) =>
        prev
          ? {
              ...prev,
              startTime: timeValueToHHmm(startTime),
              endTime: timeValueToHHmm(endTime),
            }
          : null
      );
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === timeEditTargetId
            ? {
                ...item,
                startTime: timeValueToHHmm(startTime),
                endTime: timeValueToHHmm(endTime),
              }
            : item
        )
      );
    }
    setIsTimeModalOpen(false);
    setTimeEditTargetId(null);
  };

  const handleTimeCancel = () => {
    setIsTimeModalOpen(false);
    setTimeEditTargetId(null);
  };

  // 시간 모달에 전달할 초기값 (draft 또는 기존 카드에서 꺼냄)
  const timeEditTarget =
    timeEditTargetId === DRAFT_ID
      ? { startTime: planFormDraft?.startTime, endTime: planFormDraft?.endTime }
      : items.find((item) => item.id === timeEditTargetId);

  // ============================================
  // 4) 장소 선택 모달 (SelectRegionConfirmModal)
  //    PlanFormModal 안의 "장소 추가" 클릭 시 열림
  //    선택지: 이전 페이지(SelectLocationPage)에서 고른 지역 목록
  // ============================================
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [regionEditTargetId, setRegionEditTargetId] = useState<
    string | number | null
  >(null);

  // 이전 페이지에서 저장한 지역을 모달 선택지로 변환
  const regionOptions: RegionOption[] = selectedRegions.map((r) => ({
    id: String(r.regionNum),
    label: r.regionNm,
  }));

  const handleLocationClick = (id: string | number) => {
    setRegionEditTargetId(id);
    setIsRegionModalOpen(true);
  };

  const handleRegionConfirm = (region: RegionOption | null) => {
    if (regionEditTargetId === null) return;

    if (regionEditTargetId === DRAFT_ID) {
      setPlanFormDraft((prev) =>
        prev ? { ...prev, address: region?.label ?? undefined } : null
      );
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === regionEditTargetId
            ? { ...item, location: region?.label ?? undefined }
            : item
        )
      );
    }
    setIsRegionModalOpen(false);
    setRegionEditTargetId(null);
  };

  const handleRegionCancel = () => {
    setIsRegionModalOpen(false);
    setRegionEditTargetId(null);
  };

  // 장소 모달에 전달할 초기 선택값
  const regionEditTarget =
    regionEditTargetId === DRAFT_ID
      ? { location: planFormDraft?.address }
      : items.find((item) => item.id === regionEditTargetId);
  const initialRegionId = regionOptions.find(
    (r) => r.label === regionEditTarget?.location
  )?.id;

  // ============================================
  // 5) 카테고리 선택 모달 (PlanCategoryBottomModal)
  //    "+일정 추가" → 카테고리 선택 → PlanFormModal(Create)로 이어짐
  // ============================================
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleCategoryModalOpen = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  // 카테고리 항목 클릭 → draft 초기화 후 PlanFormModal 열기
  const handleCategorySelect = (selected: SelectedCategoryItemType) => {
    setPlanFormDraft({
      planNm: selected.option.itemNm,
    });
    handleCategoryModalClose();
    setIsPlanFormModalOpen(true);
  };

  // ============================================
  // 6) 카드 클릭 → Edit 모드로 PlanFormModal 열기
  //    기존 카드의 데이터를 draft에 복사 후 수정 가능
  // ============================================
  const handleCardClick = (id: string | number) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    setEditTargetId(id);
    setPlanFormDraft({
      planNm: target.title,
      startTime: target.startTime,
      endTime: target.endTime,
      address: target.location,
    });
    setEditNote("");
    setIsPlanFormModalOpen(true);
  };

  // --- PlanFormModal 상태 초기화 (모달 닫기 공통) ---
  const closePlanForm = () => {
    setIsPlanFormModalOpen(false);
    setPlanFormDraft(null);
    setEditTargetId(null);
    setEditNote("");
  };

  /**
   * PlanFormModal 닫기 처리 (저장 시도)
   *
   * 흐름:
   *  1. 시간 미선택 → confirm 모달로 "취소할지" 확인
   *  2. 시간 유효성 검증 실패 → alert 모달로 에러 안내
   *  3. 검증 통과 → Edit이면 기존 카드 업데이트, Create이면 새 카드 추가
   */
  const handlePlanFormClose = () => {
    // (1) 시간 미선택 → 일정 추가를 취소할지 사용자에게 확인
    if (planFormDraft && (!planFormDraft.startTime || !planFormDraft.endTime)) {
      openConfirmModal(
        {
          title: "일정 추가를 취소하시겠습니까?",
          content: "시간을 선택하지 않으면 일정이 저장되지 않습니다.",
          confirmLabel: "취소하기",
          cancelLabel: "돌아가기",
        },
        () => closePlanForm()
      );
      return;
    }

    // (2) 시간 유효성 검증 (순서 역전 · 중복 · 시작≥종료)
    if (planFormDraft?.startTime && planFormDraft?.endTime) {
      const insertIndex =
        editTargetId !== null
          ? items.findIndex((item) => item.id === editTargetId)
          : items.length;

      const validation = validatePlanTime(
        planFormDraft.startTime,
        planFormDraft.endTime,
        insertIndex,
        editTargetId ?? undefined
      );

      if (!validation.isValid) {
        openAlertModal({
          title: validation.errorTitle ?? "시간 오류",
          content: validation.errorContent,
          buttonLabel: "확인",
        });
        return;
      }
    }

    if (planFormDraft && editTargetId !== null) {
      // Edit 모드: 기존 아이템 업데이트
      setItems((prev) =>
        prev.map((item) =>
          item.id === editTargetId
            ? {
                ...item,
                title: planFormDraft.planNm,
                startTime: planFormDraft.startTime,
                endTime: planFormDraft.endTime,
                location: planFormDraft.address,
              }
            : item
        )
      );
    } else if (planFormDraft) {
      // Create 모드: 새 아이템 추가
      const newPlan: PlanData = {
        id: String(Date.now()),
        title: planFormDraft.planNm,
        startTime: planFormDraft.startTime,
        endTime: planFormDraft.endTime,
        location: planFormDraft.address,
      };
      setItems((prev) => [...prev, newPlan]);
    }

    closePlanForm();
  };

  // --- PlanFormModal 내부에서 하위 모달 열기 ---
  // 다른 하위 모달이 열려있으면 먼저 닫고, 대상 모달만 열기 (배타적 전환)

  const handlePlanFormTimeClick = () => {
    setIsRegionModalOpen(false);
    setRegionEditTargetId(null);
    setTimeEditTargetId(DRAFT_ID);
    setIsTimeModalOpen(true);
  };

  const handlePlanFormAddressClick = () => {
    setIsTimeModalOpen(false);
    setTimeEditTargetId(null);
    setRegionEditTargetId(DRAFT_ID);
    setIsRegionModalOpen(true);
  };

  // ============================================
  // 7) 태그 선택 모달 (SelectTagConfirmModal)
  //    PlanFormModal(Create 모드) 안의 "태그" 클릭 시 열림
  // ============================================
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // TODO: 추후 백엔드 API에서 태그 목록을 가져와서 교체
  const tagOptions: TagOption[] = [
    { id: "1", label: "분위기 좋은" },
    { id: "2", label: "자리가 편한" },
    { id: "3", label: "뷰가 좋은" },
    { id: "4", label: "저렴한" },
    { id: "5", label: "핫플" },
  ];

  const handlePlanFormTagsClick = () => {
    setIsTimeModalOpen(false);
    setTimeEditTargetId(null);
    setIsRegionModalOpen(false);
    setRegionEditTargetId(null);
    setIsTagModalOpen(true);
  };

  const handleTagConfirm = (tags: TagOption[]) => {
    setPlanFormDraft((prev) =>
      prev ? { ...prev, tags: tags.map((t) => t.label) } : null
    );
    setIsTagModalOpen(false);
  };

  const handleTagCancel = () => {
    setIsTagModalOpen(false);
  };

  // ============================================
  // 렌더링
  // ============================================
  return (
    <div className="flex flex-col w-full h-full">
      {/* 일정 카드 리스트 + 추가 버튼 */}
      <div className="flex-1 overflow-auto p-4">
        <PlanSettingForm
          initialItems={items}
          onAddPlan={handleAddPlan}
          onOrderChange={handleOrderChange}
          onCardClick={handleCardClick}
          onDeleteClick={handleDeleteClick}
          onTimeClick={handleTimeClick}
          onLocationClick={handleLocationClick}
        />
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto w-full p-6">
        <Button
          label="다음"
          isDisabled={items.length === 0}
          onClick={() => navigate(ROUTES.PLAN.STYLE)}
        />
      </div>

      <PlanCategoryBottomModal
        isOpen={isCategoryModalOpen}
        onClose={handleCategoryModalClose}
        onSelectOption={handleCategorySelect}
      />
      <PlanFormModal
        action={{
          isOpen: isPlanFormModalOpen,
          onClose: handlePlanFormClose,
          onConfirm: handlePlanFormClose,
        }}
        info={
          editTargetId !== null
            ? {
                mode: "Edit",
                planNm: planFormDraft?.planNm,
                startTime: planFormDraft?.startTime,
                endTime: planFormDraft?.endTime,
                address: planFormDraft?.address,
                note: "메모",
                noteValue: editNote,
                onChangeNote: setEditNote,
                onClickTime: handlePlanFormTimeClick,
                onClickAddress: handlePlanFormAddressClick,
              }
            : {
                mode: "Create",
                planNm: planFormDraft?.planNm,
                startTime: planFormDraft?.startTime,
                endTime: planFormDraft?.endTime,
                address: planFormDraft?.address,
                tags: planFormDraft?.tags,
                onClickTime: handlePlanFormTimeClick,
                onClickAddress: handlePlanFormAddressClick,
                onClickTags: handlePlanFormTagsClick,
              }
        }
      />
      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClickConfirm={handleConfirmDelete}
        onClickCancel={handleCancelDelete}
      />
      <SelectTimeConfirmModal
        isOpen={isTimeModalOpen}
        initialStartTime={
          timeEditTarget?.startTime
            ? hhmmToTimeValue(timeEditTarget.startTime)
            : undefined
        }
        initialEndTime={
          timeEditTarget?.endTime
            ? hhmmToTimeValue(timeEditTarget.endTime)
            : undefined
        }
        onConfirm={handleTimeConfirm}
        onCancel={handleTimeCancel}
      />
      <SelectRegionConfirmModal
        isOpen={isRegionModalOpen}
        regions={regionOptions}
        initialSelectedId={initialRegionId}
        onConfirm={handleRegionConfirm}
        onCancel={handleRegionCancel}
      />
      <SelectTagConfirmModal
        isOpen={isTagModalOpen}
        tags={tagOptions}
        initialSelectedIds={
          planFormDraft?.tags
            ? tagOptions
                .filter((t) => planFormDraft.tags!.includes(t.label))
                .map((t) => t.id)
            : []
        }
        onConfirm={handleTagConfirm}
        onCancel={handleTagCancel}
      />
    </div>
  );
};
