import { useState, type Dispatch, type SetStateAction } from "react";
import type { PlanData } from "@/components/main/plan/PlanCard";
import type { RegionOption } from "@/components/main/plan/common/modal/content/SelectRegionConfirmModalContent";
import type { TagOption } from "@/components/main/plan/common/modal/content/SelectTagConfirmModalContent";
import type { SelectedCategoryItemType } from "@/types/api/scheduleTypes";
import { timeValueToHHmm, hhmmToTimeValue } from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import { useConfirmModalStore } from "@/stores/confirmModalStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import { usePlanTimeValidation } from "@/hooks/usePlanTimeValidation";

/**
 * 일정 추가/수정 폼 모달 + 하위 모달(시간/장소/태그/카테고리) 상태 관리
 *
 * [흐름]
 * Create: "+일정 추가" → 카테고리 선택 → PlanFormModal → 시간/장소/태그 선택 → 저장
 * Edit  : 기존 카드 클릭 → PlanFormModal → 시간/장소 수정 → 저장
 *
 * [DRAFT_ID 패턴]
 * 시간/장소 모달은 "기존 카드 수정"과 "새 일정 작성" 양쪽에서 사용됨
 * DRAFT_ID로 구분하여 결과를 draft에 반영할지 items에 직접 반영할지 분기
 */

// 아직 저장되지 않은 새 일정을 식별하는 임시 ID
const DRAFT_ID = "__draft__";

// TODO: 추후 백엔드 API에서 태그 목록을 가져와서 교체
const TAG_OPTIONS: TagOption[] = [
  { id: "1", label: "분위기 좋은" },
  { id: "2", label: "자리가 편한" },
  { id: "3", label: "뷰가 좋은" },
  { id: "4", label: "저렴한" },
  { id: "5", label: "핫플" },
];

interface PlanFormDraft {
  planNm: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  tags?: string[];
}

export const usePlanFormModal = (
  items: PlanData[],
  setItems: Dispatch<SetStateAction<PlanData[]>>
) => {
  const { openConfirmModal } = useConfirmModalStore();
  const { openAlertModal } = useAlertModalStore();
  const selectedRegions = useRegionSelectionStore((s) => s.selectedRegions);
  const { validatePlanTime } = usePlanTimeValidation(items);

  // ============================================
  // PlanFormModal 상태
  // ============================================
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [draft, setDraft] = useState<PlanFormDraft | null>(null);
  const [editTargetId, setEditTargetId] = useState<string | number | null>(
    null
  );
  const [editNote, setEditNote] = useState("");

  // ============================================
  // 카테고리 모달
  // ============================================
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleAddPlan = () => setIsCategoryOpen(true);

  const handleCategorySelect = (selected: SelectedCategoryItemType) => {
    setDraft({ planNm: selected.option.itemNm });
    setIsCategoryOpen(false);
    setIsPlanFormOpen(true);
  };

  // ============================================
  // 카드 클릭 → Edit 모드
  // ============================================
  const handleCardClick = (id: string | number) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    setEditTargetId(id);
    setDraft({
      planNm: target.title,
      startTime: target.startTime,
      endTime: target.endTime,
      address: target.location,
    });
    setEditNote("");
    setIsPlanFormOpen(true);
  };

  // ============================================
  // PlanFormModal 닫기 (저장 시도)
  //  1. 시간 미선택 → confirm으로 취소 확인
  //  2. 시간 유효성 검증 실패 → alert으로 에러 안내
  //  3. 검증 통과 → Edit이면 업데이트, Create이면 추가
  // ============================================
  const closePlanForm = () => {
    setIsPlanFormOpen(false);
    setDraft(null);
    setEditTargetId(null);
    setEditNote("");
  };

  const handlePlanFormClose = () => {
    // (1) 시간 미선택 → 취소 확인
    if (draft && (!draft.startTime || !draft.endTime)) {
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
    if (draft?.startTime && draft?.endTime) {
      const insertIndex =
        editTargetId !== null
          ? items.findIndex((item) => item.id === editTargetId)
          : items.length;

      const result = validatePlanTime(
        draft.startTime,
        draft.endTime,
        insertIndex,
        editTargetId ?? undefined
      );

      if (!result.isValid) {
        openAlertModal({
          title: result.errorTitle ?? "시간 오류",
          content: result.errorContent,
          buttonLabel: "확인",
        });
        return;
      }
    }

    // (3) 저장
    if (draft && editTargetId !== null) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editTargetId
            ? {
                ...item,
                title: draft.planNm,
                startTime: draft.startTime,
                endTime: draft.endTime,
                location: draft.address,
              }
            : item
        )
      );
    } else if (draft) {
      setItems((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          title: draft.planNm,
          startTime: draft.startTime,
          endTime: draft.endTime,
          location: draft.address,
        },
      ]);
    }

    closePlanForm();
  };

  // ============================================
  // 시간 선택 모달
  // ============================================
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [timeTargetId, setTimeTargetId] = useState<string | number | null>(
    null
  );

  const handleTimeClick = (id: string | number) => {
    setTimeTargetId(id);
    setIsTimeOpen(true);
  };

  const handleTimeConfirm = (start: TimeValue, end: TimeValue) => {
    if (timeTargetId === null) return;

    if (timeTargetId === DRAFT_ID) {
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              startTime: timeValueToHHmm(start),
              endTime: timeValueToHHmm(end),
            }
          : null
      );
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === timeTargetId
            ? {
                ...item,
                startTime: timeValueToHHmm(start),
                endTime: timeValueToHHmm(end),
              }
            : item
        )
      );
    }
    setIsTimeOpen(false);
    setTimeTargetId(null);
  };

  const handleTimeCancel = () => {
    setIsTimeOpen(false);
    setTimeTargetId(null);
  };

  // ============================================
  // 장소 선택 모달
  // ============================================
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [regionTargetId, setRegionTargetId] = useState<string | number | null>(
    null
  );

  const regionOptions: RegionOption[] = selectedRegions.map((r) => ({
    id: String(r.regionNum),
    label: r.regionNm,
  }));

  const handleLocationClick = (id: string | number) => {
    setRegionTargetId(id);
    setIsRegionOpen(true);
  };

  const handleRegionConfirm = (region: RegionOption | null) => {
    if (regionTargetId === null) return;

    if (regionTargetId === DRAFT_ID) {
      setDraft((prev) =>
        prev ? { ...prev, address: region?.label ?? undefined } : null
      );
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === regionTargetId
            ? { ...item, location: region?.label ?? undefined }
            : item
        )
      );
    }
    setIsRegionOpen(false);
    setRegionTargetId(null);
  };

  const handleRegionCancel = () => {
    setIsRegionOpen(false);
    setRegionTargetId(null);
  };

  // ============================================
  // 태그 선택 모달
  // ============================================
  const [isTagOpen, setIsTagOpen] = useState(false);

  const handleTagConfirm = (tags: TagOption[]) => {
    setDraft((prev) =>
      prev ? { ...prev, tags: tags.map((t) => t.label) } : null
    );
    setIsTagOpen(false);
  };

  const handleTagCancel = () => {
    setIsTagOpen(false);
  };

  // ============================================
  // PlanFormModal 내부 하위 모달 열기 (배타적 전환)
  // ============================================
  const handlePlanFormTimeClick = () => {
    setIsRegionOpen(false);
    setRegionTargetId(null);
    setTimeTargetId(DRAFT_ID);
    setIsTimeOpen(true);
  };

  const handlePlanFormAddressClick = () => {
    setIsTimeOpen(false);
    setTimeTargetId(null);
    setRegionTargetId(DRAFT_ID);
    setIsRegionOpen(true);
  };

  const handlePlanFormTagsClick = () => {
    setIsTimeOpen(false);
    setTimeTargetId(null);
    setIsRegionOpen(false);
    setRegionTargetId(null);
    setIsTagOpen(true);
  };

  // ============================================
  // 모달 props 계산
  // ============================================

  // 시간 모달 초기값
  const timeEditTarget =
    timeTargetId === DRAFT_ID
      ? { startTime: draft?.startTime, endTime: draft?.endTime }
      : items.find((item) => item.id === timeTargetId);

  // 장소 모달 초기값
  const regionEditTarget =
    regionTargetId === DRAFT_ID
      ? { location: draft?.address }
      : items.find((item) => item.id === regionTargetId);

  const initialRegionId = regionOptions.find(
    (r) => r.label === regionEditTarget?.location
  )?.id;

  // 태그 모달 초기값
  const initialTagIds = draft?.tags
    ? TAG_OPTIONS.filter((t) => draft.tags!.includes(t.label)).map((t) => t.id)
    : [];

  // PlanFormModal info (Create / Edit 분기)
  const planFormInfo =
    editTargetId !== null
      ? {
          mode: "Edit" as const,
          planNm: draft?.planNm,
          startTime: draft?.startTime,
          endTime: draft?.endTime,
          address: draft?.address,
          note: "메모",
          noteValue: editNote,
          onChangeNote: setEditNote,
          onClickTime: handlePlanFormTimeClick,
          onClickAddress: handlePlanFormAddressClick,
        }
      : {
          mode: "Create" as const,
          planNm: draft?.planNm,
          startTime: draft?.startTime,
          endTime: draft?.endTime,
          address: draft?.address,
          tags: draft?.tags,
          onClickTime: handlePlanFormTimeClick,
          onClickAddress: handlePlanFormAddressClick,
          onClickTags: handlePlanFormTagsClick,
        };

  // ============================================
  // 반환: 각 모달별 props (컴포넌트에 바로 전달 가능)
  // ============================================
  return {
    /** PlanSettingForm에 전달할 핸들러 */
    formHandlers: {
      handleAddPlan,
      handleCardClick,
      handleTimeClick,
      handleLocationClick,
    },
    /** 카테고리 선택 모달 props */
    categoryModalProps: {
      isOpen: isCategoryOpen,
      onClose: () => setIsCategoryOpen(false),
      onSelectOption: handleCategorySelect,
    },
    /** PlanFormModal props */
    planFormModalProps: {
      action: {
        isOpen: isPlanFormOpen,
        onClose: handlePlanFormClose,
        onConfirm: handlePlanFormClose,
      },
      info: planFormInfo,
    },
    /** 시간 선택 모달 props */
    timeModalProps: {
      isOpen: isTimeOpen,
      initialStartTime: timeEditTarget?.startTime
        ? hhmmToTimeValue(timeEditTarget.startTime)
        : undefined,
      initialEndTime: timeEditTarget?.endTime
        ? hhmmToTimeValue(timeEditTarget.endTime)
        : undefined,
      onConfirm: handleTimeConfirm,
      onCancel: handleTimeCancel,
    },
    /** 장소 선택 모달 props */
    regionModalProps: {
      isOpen: isRegionOpen,
      regions: regionOptions,
      initialSelectedId: initialRegionId,
      onConfirm: handleRegionConfirm,
      onCancel: handleRegionCancel,
    },
    /** 태그 선택 모달 props */
    tagModalProps: {
      isOpen: isTagOpen,
      tags: TAG_OPTIONS,
      initialSelectedIds: initialTagIds,
      onConfirm: handleTagConfirm,
      onCancel: handleTagCancel,
    },
  };
};
