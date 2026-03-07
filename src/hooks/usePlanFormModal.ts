import { useState, type Dispatch, type SetStateAction } from "react";
import type { PlanData } from "@/components/main/plan/PlanCard";
import type { RegionOption } from "@/components/main/plan/common/modal/content/SelectRegionConfirmModalContent";
import { timeValueToHHmm, hhmmToTimeValue } from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import { useConfirmModalStore } from "@/stores/confirmModalStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { usePlanTimeValidation } from "@/hooks/usePlanTimeValidation";

// === server
import type { RegionRegistReqDTO, TagRegistReqDTO } from "@/api/types";

// 1. 카테고리
import type { SelectedCategoryItemType } from "@/types/api/scheduleTypes";

// 2. 상세
// 1) 장소 관련
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
// 2) 일정 태그 (선택) 관련
import type { TagRegistResDTO } from "@/api/types";
import { searchTags } from "@/api/queries";

/**
 * 일정 추가/수정 폼 모달 + 하위 모달(시간/장소/태그/카테고리) 상태 관리 훅
 *
 * [흐름]
 * Create: "+일정 추가" → 카테고리 선택 → PlanFormModal → 시간/장소/태그 선택 → 저장
 * Edit  : 기존 카드 클릭 → PlanFormModal → 시간/장소 수정 → 저장
 *
 * [DRAFT_ID 패턴]
 * 시간/장소 모달은 "기존 카드 수정"과 "새 일정 작성" 양쪽에서 사용됨
 * DRAFT_ID로 구분하여 결과를 draft에 반영할지 items에 직접 반영할지 분기
 *
 * @param items    - 현재 일정 카드 목록 (순서 검증에 사용)
 * @param setItems - 일정 목록 상태 변경 함수 (카드 추가/수정 시 호출)
 *
 * @returns
 * - formHandlers      : PlanSettingForm에 전달할 이벤트 핸들러 모음
 * - categoryModalProps : PlanCategoryBottomModal에 스프레드로 전달할 props
 * - planFormModalProps  : PlanFormModal에 스프레드로 전달할 props
 * - timeModalProps      : SelectTimeConfirmModal에 스프레드로 전달할 props
 * - regionModalProps    : SelectRegionConfirmModal에 스프레드로 전달할 props
 * - tagModalProps       : SelectTagConfirmModal에 스프레드로 전달할 props
 */

/**
 * 아직 저장되지 않은 새 일정을 식별하는 임시 ID
 * 예: 시간 모달에서 targetId가 DRAFT_ID면 → 결과를 draft에 저장
 *     targetId가 일반 id면 → 해당 카드에 직접 저장
 */
const DRAFT_ID = "__draft__";

/** 폼에서 작성 중인 임시 데이터 타입 (저장 전까지 여기에 보관) */
interface PlanFormDraft {
  planNm: string; // 일정 이름 (카테고리에서 선택한 항목명)
  startTime?: string; // 시작 시간 (HH:mm)
  endTime?: string; // 종료 시간 (HH:mm)
  address?: string; // 장소명
  tags?: TagRegistReqDTO[]; // 태그 라벨 목록
}

interface PlanFormDraft {
  planNm: string;
  categoryNum?: number;
  startTime?: string;
  endTime?: string;
  regionRegistReqDTOList?: RegionRegistReqDTO[];
  planTagRegistReqDTOList?: TagRegistReqDTO[];
}

export const usePlanFormModal = (
  items: PlanData[],
  setItems: Dispatch<SetStateAction<PlanData[]>>
) => {
  // --- 전역 모달 스토어 (유효성 검증 피드백용) ---
  const { openConfirmModal } = useConfirmModalStore(); // 확인/취소 2버튼 모달
  const { openAlertModal } = useAlertModalStore(); // 확인 1버튼 모달

  // --- 이전 페이지(SelectLocationPage)에서 선택한 지역 목록 ---
  const selectedRegions = useRegionSelectionStore((s) => s.selectedRegions);

  // --- 시간 유효성 검증 (순서 역전, 중복, 시작≥종료 등) ---
  const { validatePlanTime } = usePlanTimeValidation(items);

  // ============================================
  // PlanFormModal 상태
  // ============================================
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false); // 폼 모달 열림 여부
  const [draft, setDraft] = useState<PlanFormDraft | null>(null); // 작성 중인 임시 데이터
  const [editTargetId, setEditTargetId] = useState<string | number | null>(
    null // null이면 Create 모드, 값이 있으면 해당 id의 카드를 수정하는 Edit 모드
  );
  const [editNote, setEditNote] = useState(""); // Edit 모드에서 메모 입력값

  // ============================================
  // 카테고리 모달
  // "+일정 추가" 버튼 → 카테고리 목록 표시 → 항목 선택 → PlanFormModal 열기
  // ============================================
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [tagOptions, setTagOptions] = useState<TagRegistResDTO[]>([]);

  /** "+일정 추가" 버튼 클릭 */
  const handleAddPlan = () => setIsCategoryOpen(true);

  /** 카테고리 항목 선택 → 일정 이름을 draft에 저장하고 PlanFormModal 열기 */
  const handleCategorySelect = (selected: SelectedCategoryItemType) => {
    const categoryNum = selected.category.categoryNum;

    setDraft({ planNm: selected.option.itemNm });
    setIsCategoryOpen(false);
    setIsPlanFormOpen(true);

    searchTags({ tagType: "P", categoryNum }).then((res) =>
      setTagOptions(res.data ?? [])
    );
  };

  // ============================================
  // 카드 클릭 → Edit 모드
  // 기존 카드의 데이터를 draft에 복사한 뒤 PlanFormModal 열기
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
  //
  // [흐름]
  //  1. 시간 아직 미선택 → "취소할까요?" confirm 모달
  //  2. 시간은 선택했지만 유효성 실패 → alert 모달로 에러 안내
  //  3. 검증 통과 → Edit이면 기존 카드 업데이트, Create이면 새 카드 추가
  // ============================================

  /** 모달 + draft + edit 상태를 모두 초기화하는 공통 닫기 함수 */
  const closePlanForm = () => {
    setIsPlanFormOpen(false);
    setDraft(null);
    setEditTargetId(null);
    setEditNote("");
  };

  /** PlanFormModal 닫기 시 호출 — 유효성 검증 후 저장 */
  const handlePlanFormClose = () => {
    // --- (1) 시간 미선택: 사용자에게 취소할지 물어보기 ---
    if (draft && (!draft.startTime || !draft.endTime)) {
      openConfirmModal(
        editTargetId !== null
          ? {
              title: "일정 수정을 취소하시겠습니까?",
              content: "시간을 선택하지 않으면 수정 내용이 저장되지 않습니다.",
              confirmLabel: "취소하기",
              cancelLabel: "돌아가기",
            }
          : {
              title: "일정 추가를 취소하시겠습니까?",
              content: "시간을 선택하지 않으면 일정이 저장되지 않습니다.",
              confirmLabel: "취소하기",
              cancelLabel: "돌아가기",
            },
        () => closePlanForm()
      );
      return;
    }

    // --- (2) 시간 유효성 검증: 순서 역전 · 중복 · 시작≥종료 ---
    if (draft?.startTime && draft?.endTime) {
      // 수정 모드면 해당 카드의 위치, 추가 모드면 맨 뒤
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

    // --- (3) 검증 통과: 실제 저장 ---
    if (draft && editTargetId !== null) {
      // Edit 모드: 해당 id의 카드 데이터를 새 draft 값으로 교체
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
      // Create 모드: 새 카드를 목록 맨 뒤에 추가 (id는 현재 시각으로 생성)
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
  // PlanFormModal 안의 "시간 추가" 클릭 시 열림
  // 결과: DRAFT_ID면 draft에, 아니면 해당 카드에 직접 반영
  // ============================================
  const [isTimeOpen, setIsTimeOpen] = useState(false); // 시간 모달 열림 여부
  const [timeTargetId, setTimeTargetId] = useState<string | number | null>(
    null // DRAFT_ID 또는 기존 카드 id
  );

  /** 카드의 시간 영역 클릭 → 시간 모달 열기 */
  const handleTimeClick = (id: string | number) => {
    setTimeTargetId(id);
    setIsTimeOpen(true);
  };

  /** 시간 모달에서 "확인" → 선택한 시간을 draft 또는 카드에 데이터 반영 */
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
  // PlanFormModal 안의 "장소 추가" 클릭 시 열림
  // 선택지: 이전 페이지(SelectLocationPage)에서 고른 지역 목록
  // ============================================
  const [isRegionOpen, setIsRegionOpen] = useState(false); // 장소 모달 열림 여부
  const [regionTargetId, setRegionTargetId] = useState<string | number | null>(
    null // DRAFT_ID 또는 기존 카드 id
  );

  /** 이전 페이지에서 저장한 지역을 모달 선택지 형식으로 변환 */
  const regionOptions: RegionOption[] = selectedRegions.map((r) => ({
    id: String(r.regionNum),
    label: r.regionNm,
  }));

  /** 카드의 장소 영역 클릭 → 장소 모달 열기 */
  const handleLocationClick = (id: string | number) => {
    setRegionTargetId(id);
    setIsRegionOpen(true);
  };

  /** 장소 모달에서 "확인" → 선택한 지역을 draft 또는 카드에 반영 */
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
  // PlanFormModal(Create 모드) 안의 "태그" 클릭 시 열림
  // 태그는 draft에만 반영 (새 일정 작성 시에만 사용)
  // ============================================
  const [isTagOpen, setIsTagOpen] = useState(false);

  /** 태그 모달에서 "확인" → 선택한 태그를 draft에 반영 */
  const handleTagConfirm = (tags: TagRegistResDTO[]) => {
    setDraft((prev) =>
      prev ? { ...prev, planTagRegistReqDTOList: tags } : null
    );
    setIsTagOpen(false);
  };

  const handleTagCancel = () => {
    setIsTagOpen(false);
  };

  // ============================================
  // PlanFormModal 내부 하위 모달 열기 (배타적 전환)
  //
  // 한 번에 하나의 하위 모달만 열리도록,
  // 다른 하위 모달이 열려 있으면 먼저 닫고 대상 모달만 열기
  // ============================================

  /** PlanFormModal 안의 "시간 추가" 클릭 → 장소·태그 모달 닫고 시간 모달 열기 */
  const handlePlanFormTimeClick = () => {
    setIsRegionOpen(false);
    setRegionTargetId(null);
    setIsTagOpen(false);
    setTimeTargetId(DRAFT_ID);
    setIsTimeOpen(true);
  };

  /** PlanFormModal 안의 "장소 추가" 클릭 → 시간·태그 모달 닫고 장소 모달 열기 */
  const handlePlanFormAddressClick = () => {
    setIsTimeOpen(false);
    setTimeTargetId(null);
    setIsTagOpen(false);
    setRegionTargetId(DRAFT_ID);
    setIsRegionOpen(true);
  };

  /** PlanFormModal 안의 "태그" 클릭 → 시간+장소 모달 닫고 태그 모달 열기 */
  const handlePlanFormTagsClick = () => {
    setIsTimeOpen(false);
    setTimeTargetId(null);
    setIsRegionOpen(false);
    setRegionTargetId(null);
    setIsTagOpen(true);
  };

  // ============================================
  // 모달 props 계산
  // 각 모달 컴포넌트에 전달할 초기값을 draft 또는 items에서 계산
  // ============================================

  // 시간 모달 초기값: DRAFT_ID면 draft에서, 아니면 해당 카드에서 꺼냄
  const timeEditTarget =
    timeTargetId === DRAFT_ID
      ? { startTime: draft?.startTime, endTime: draft?.endTime }
      : items.find((item) => item.id === timeTargetId);

  // 장소 모달 초기값: DRAFT_ID면 draft에서, 아니면 해당 카드에서 꺼냄
  const regionEditTarget =
    regionTargetId === DRAFT_ID
      ? { location: draft?.address }
      : items.find((item) => item.id === regionTargetId);

  // 현재 선택된 지역의 id (모달에서 선택된 상태로 표시하기 위해)
  const initialRegionId = regionOptions.find(
    (r) => r.label === regionEditTarget?.location
  )?.id;

  // 태그 모달 초기값: draft의 태그 라벨 → tagOptions에서 tagNm 찾기
  const initialTagIds = draft?.planTagRegistReqDTOList
    ? draft.planTagRegistReqDTOList.map((t) => t.tagNum)
    : [];

  /**
   * PlanFormModal에 전달할 info (Create / Edit 분기)
   * - Create: 태그 선택 UI 표시
   * - Edit  : 메모 입력 UI 표시
   */
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
  // 반환: 각 모달별 props
  // 페이지에서 스프레드로 전달하면 됨
  // 예: <SelectTimeConfirmModal {...timeModalProps} />
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
      tags: tagOptions,
      initialSelectedIds: initialTagIds,
      onConfirm: handleTagConfirm,
      onCancel: handleTagCancel,
    },
  };
};
