import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

// === component ===
import type { PlanData } from "@/components/main/plan/PlanCard";
import type { RegionOption } from "@/components/main/plan/common/modal/content/SelectRegionConfirmModalContent";
import { useConfirmModalStore } from "@/stores/confirmModalStore";
import { useAlertModalStore } from "@/stores/alertModalStore";

// === util ===
import { timeValueToHHmm, hhmmToTimeValue } from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import {
  usePlanTimeValidation,
  hhmmToMinutes,
  minutesToHHmm,
} from "@/hooks/usePlanTimeValidation";

// === server ===
import type {
  RegionRegistReqDTO,
  TagRegistResDTO,
  UserAddedPlaceDTO,
} from "@/api/types";
import { useUserPlaceStore } from "@/stores/userPlaceStore";

// 1. 카테고리
import type {
  PlanSource,
  SelectedCategoryItemType,
} from "@/types/api/scheduleTypes";

// 2. 상세
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import { searchTags } from "@/api/queries";

// 3. store
import { useScheduleDraftStore } from "@/stores/scheduleStore";

const DRAFT_ID = "__draft__";

/** 폼에서 작성 중인 임시 데이터 타입 (저장 전까지 여기에 보관) */
interface PlanFormDraft {
  source: PlanSource;
  planNm: string;

  startTime?: string;
  endTime?: string;

  categoryNum?: number;
  itemNum?: number;

  address?: string;
  regionRegistReqDTOList?: RegionRegistReqDTO[];
  planTagRegistReqDTOList?: TagRegistResDTO[];

  userAddedPlaceDTO?: UserAddedPlaceDTO;
}

export const usePlanFormModal = (
  items: PlanData[],
  setItems: Dispatch<SetStateAction<PlanData[]>>
) => {
  const { openConfirmModal } = useConfirmModalStore();
  const { openAlertModal } = useAlertModalStore();
  const selectedRegions = useRegionSelectionStore((s) => s.selectedRegions);
  // 지역이 1개뿐이면 블록마다 지역을 고를 이유가 없으므로(이미 확정)
  // 해당 지역을 자동 할당하고 선택 UI는 숨긴다. 2개 이상이면 다시 선택 가능.
  const singleRegion = selectedRegions.length === 1 ? selectedRegions[0] : null;
  const { validatePlanTime } = usePlanTimeValidation(items);
  const {
    addAIPlan,
    updateAIPlan,
    addUserCustomPlan,
    addUserPlacePlan,
    updateUserCustomPlan,
    updateUserPlacePlan,
    convertToUserPlacePlan,
    setPlanList,
  } = useScheduleDraftStore();

  // ============================================
  // PlanFormModal 상태
  // ============================================
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [draft, setDraft] = useState<PlanFormDraft | null>(null);

  // ============================================
  // 카테고리 모달
  // ============================================
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [tagOptions, setTagOptions] = useState<TagRegistResDTO[]>([]);

  // 새 계획 기본 시간(블록 기본 용량 1시간):
  // - 시간 지정된 블록이 있으면 가장 늦게 끝나는 블록의 종료시각부터 +1시간
  // - 없으면(첫 블록) 09:00~10:00 기준
  const getDefaultPlanTime = (): { startTime: string; endTime: string } => {
    const endMins = items
      .map((item) => (item.endTime ? hhmmToMinutes(item.endTime) : NaN))
      .filter((m) => Number.isFinite(m) && m >= 0 && m < 24 * 60);
    const startMin = endMins.length > 0 ? Math.max(...endMins) : 9 * 60;
    const endMin = Math.min(startMin + 60, 23 * 60 + 59);
    return {
      startTime: minutesToHHmm(startMin),
      endTime: minutesToHHmm(endMin),
    };
  };

  const handleAddPlan = () => setIsCategoryOpen(true);

  const handleCategorySelect = (selected: SelectedCategoryItemType) => {
    const categoryNum = selected.category.categoryNum;
    const { startTime, endTime } = getDefaultPlanTime();

    setDraft({
      source: "AI",
      planNm: selected.option.itemNm,
      categoryNum,
      itemNum: selected.option.itemNum,
      // 새 계획 기본 시간 미리 채움(이전 블록 종료~+1h, 첫 블록 09:00~10:00)
      startTime,
      endTime,
      // 지역이 1개면 선택 단계 없이 해당 지역을 바로 채워둔다
      ...(singleRegion
        ? {
            address: singleRegion.regionNm,
            regionRegistReqDTOList: [{ regionNum: singleRegion.regionNum }],
          }
        : {}),
    });
    setIsCategoryOpen(false);
    setIsPlanFormOpen(true);

    searchTags({ tagType: "P", categoryNum }).then((res) =>
      setTagOptions(res.data ?? [])
    );
  };

  // ============================================
  // 직접 등록 관련 로직
  // ============================================
  const navigate = useNavigate();
  const { place, clearPlace } = useUserPlaceStore();

  const [isPlanNameOpen, setIsPlanNameOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);

  const handlePlanNameConfirm = (planNm: string) => {
    const { startTime, endTime } = getDefaultPlanTime();
    setDraft({
      source: "USER_CUSTOM",
      planNm,
      // 새 계획 기본 시간 미리 채움(이전 블록 종료~+1h, 첫 블록 09:00~10:00)
      startTime,
      endTime,
    });
    setIsPlanNameOpen(false);
    setIsPlanFormOpen(true);
  };

  useEffect(() => {
    if (!place) return;

    if (draft) {
      setDraft((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          source: "USER_PLACE" as const,
          address: place.addressName,
          userAddedPlaceDTO: place,
        };
      });
    } else if (editTargetId !== null) {
      const target = items.find((item) => item.id === editTargetId);
      if (!target) {
        setEditTargetId(null);
        clearPlace();
        return;
      }
      convertToUserPlacePlan(target.storeIndex, {
        planNm: target.title,
        startTime: target.startTime ?? "",
        endTime: target.endTime ?? "",
        userAddedPlaceDTO: place,
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === editTargetId
            ? {
                ...item,
                source: "USER_PLACE" as const,
                location: place.addressName,
                userAddedPlaceDTO: place,
              }
            : item
        )
      );
      setEditTargetId(null);
    }

    clearPlace();
  }, [place]);

  // ============================================
  // 카드 클릭 → 기존 데이터를 draft에 복사 후 PlanFormModal 열기
  // ============================================

  const handleCardClick = (id: number) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    setEditTargetId(id);
    setDraft({
      source: target.source ?? "AI",
      planNm: target.title,
      startTime: target.startTime,
      endTime: target.endTime,
      address: target.location,
      categoryNum: target.categoryNum,
      planTagRegistReqDTOList: target.planTagRegistReqDTOList,
      regionRegistReqDTOList: target.regionRegistReqDTOList,
      userAddedPlaceDTO: target.userAddedPlaceDTO,
    });
    setIsPlanFormOpen(true);

    if (target.categoryNum) {
      searchTags({ tagType: "P", categoryNum: target.categoryNum }).then(
        (res) => setTagOptions(res.data ?? [])
      );
    }
  };

  // ============================================
  // PlanFormModal 닫기
  // ============================================
  const closePlanForm = () => {
    setIsPlanFormOpen(false);
    setDraft(null);
    setEditTargetId(null);
    clearPlace();
  };

  const handlePlanFormClose = () => {
    // (1) 시간 미선택
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
              title: "계획 추가를 취소하시겠습니까?",
              content: "시간을 선택하지 않으면 계획이 저장되지 않습니다.",
              confirmLabel: "취소하기",
              cancelLabel: "돌아가기",
            },
        () => closePlanForm()
      );
      return;
    }

    // (2) 시간 유효성 검증
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

    // (3) 검증 통과 - 수정
    if (draft && editTargetId !== null) {
      const target = items.find((item) => item.id === editTargetId);
      if (!target) {
        closePlanForm();
        return;
      }

      if (draft.source === "AI") {
        updateAIPlan(target.storeIndex, {
          startTime: draft.startTime,
          endTime: draft.endTime,
          regionRegistReqDTOList: draft.regionRegistReqDTOList ?? [],
          planTagRegistReqDTOList: draft.planTagRegistReqDTOList ?? [], // ← tagNm 포함 그대로
        });
      } else if (draft.source === "USER_CUSTOM") {
        updateUserCustomPlan(target.storeIndex, {
          startTime: draft.startTime,
          endTime: draft.endTime,
          planNm: draft.planNm,
        });
      } else if (draft.source === "USER_PLACE") {
        updateUserPlacePlan(target.storeIndex, {
          startTime: draft.startTime,
          endTime: draft.endTime,
          planNm: draft.planNm,
          userAddedPlaceDTO: draft.userAddedPlaceDTO,
        });
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === editTargetId
            ? {
                ...item,
                title: draft.planNm,
                startTime: draft.startTime,
                endTime: draft.endTime,
                location: draft.address,
                categoryNum: draft.categoryNum,
                planTagRegistReqDTOList: draft.planTagRegistReqDTOList,
                userAddedPlaceDTO: draft.userAddedPlaceDTO,
              }
            : item
        )
      );
    } else if (draft) {
      // (3) 검증 통과 - 새 카드 추가
      const newId = Date.now();

      if (draft.source === "AI") {
        const isRandomCategory = draft.itemNum === 1 ? "Y" : "N";
        addAIPlan({
          startTime: draft.startTime,
          endTime: draft.endTime,
          categoryNum: draft.categoryNum,
          itemNum: draft.itemNum,
          isRandomCategory,
          regionRegistReqDTOList: draft.regionRegistReqDTOList ?? [],
          planTagRegistReqDTOList: draft.planTagRegistReqDTOList ?? [],
        });
      } else if (draft.source === "USER_CUSTOM") {
        addUserCustomPlan({
          planNm: draft.planNm,
          startTime: draft.startTime!,
          endTime: draft.endTime!,
        });
      } else if (draft.source === "USER_PLACE") {
        addUserPlacePlan({
          planNm: draft.planNm,
          startTime: draft.startTime!,
          endTime: draft.endTime!,
          userAddedPlaceDTO: draft.userAddedPlaceDTO!,
        });
      }

      // store에 추가된 직후 전체 planList를 시간 순서로 정렬 후 반영
      const addedList =
        useScheduleDraftStore.getState().draft.planRegistReqDTOList;

      const sortedList = [...addedList].sort((a, b) => {
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return hhmmToMinutes(a.startTime) - hhmmToMinutes(b.startTime);
      });

      setPlanList(sortedList);

      // items도 sortedList 순서에 맞게 재구성
      const newCard = {
        id: newId,
        source: draft.source,
        title: draft.planNm,
        startTime: draft.startTime,
        endTime: draft.endTime,
        location: draft.address,
        categoryNum: draft.categoryNum,
        itemNum: draft.itemNum,
        planTagRegistReqDTOList: draft.planTagRegistReqDTOList,
        regionRegistReqDTOList: draft.regionRegistReqDTOList,
        userAddedPlaceDTO: draft.userAddedPlaceDTO,
      };

      setItems((prev) => {
        const merged = [
          ...prev,
          { ...newCard, storeIndex: addedList.length - 1 },
        ];

        // startTime 기준 정렬 후 storeIndex 재부여
        const sorted = [...merged].sort((a, b) => {
          if (!a.startTime) return 1;
          if (!b.startTime) return -1;
          return hhmmToMinutes(a.startTime) - hhmmToMinutes(b.startTime);
        });

        return sorted.map((item, i) => ({ ...item, storeIndex: i }));
      });
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
      const target = items.find((item) => item.id === timeTargetId);
      const newStart = timeValueToHHmm(start);
      const newEnd = timeValueToHHmm(end);

      if (target?.source === "AI") {
        updateAIPlan(target.storeIndex, {
          startTime: newStart,
          endTime: newEnd,
        });
      } else if (target?.source === "USER_CUSTOM") {
        updateUserCustomPlan(target.storeIndex, {
          startTime: newStart,
          endTime: newEnd,
        });
      } else if (target?.source === "USER_PLACE") {
        updateUserPlacePlan(target.storeIndex, {
          startTime: newStart,
          endTime: newEnd,
        });
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === timeTargetId
            ? { ...item, startTime: newStart, endTime: newEnd }
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
    const target = items.find((item) => item.id === id);
    if (!target) {
      setIsRegionOpen(false);
      setRegionTargetId(null);
      return;
    }

    if (target.source === "AI") {
      // 지역이 1개뿐이면 변경할 이유가 없으므로 지역 선택 모달을 열지 않음
      if (singleRegion) return;
      setRegionTargetId(id);
      setIsRegionOpen(true);
    } else {
      setEditTargetId(id as number);
      navigate("search");
    }
  };
  const handleRegionConfirm = (region: RegionOption | null) => {
    if (regionTargetId === null) return;

    if (regionTargetId === DRAFT_ID) {
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              address: region?.label ?? undefined,
              regionRegistReqDTOList: region
                ? [{ regionNum: Number(region.id), regionNm: region.label }]
                : [],
            }
          : null
      );
    } else {
      const target = items.find((item) => item.id === regionTargetId);
      if (!target) return;
      updateAIPlan(target.storeIndex, {
        regionRegistReqDTOList: region
          ? [{ regionNum: Number(region.id) }]
          : [],
      });
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
  // ============================================
  const handlePlanFormTimeClick = () => {
    setIsRegionOpen(false);
    setRegionTargetId(null);
    setIsTagOpen(false);
    setTimeTargetId(DRAFT_ID);
    setIsTimeOpen(true);
  };

  const handlePlanFormAddressClick = () => {
    setIsTimeOpen(false);
    setTimeTargetId(null);
    setIsTagOpen(false);

    if (draft?.source === "AI") {
      setRegionTargetId(DRAFT_ID);
      setIsRegionOpen(true);
    } else {
      navigate("search");
    }
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
  const timeEditTarget =
    timeTargetId === DRAFT_ID
      ? { startTime: draft?.startTime, endTime: draft?.endTime }
      : items.find((item) => item.id === timeTargetId);

  // 새 일정 기본 시간: 기존 블록이 있을 때 이전 블록의 종료 시간 기준
  const isDraftNoTime = timeTargetId === DRAFT_ID && !draft?.startTime;
  const timedItems = isDraftNoTime ? items.filter((item) => item.endTime) : [];
  const lastTimedItem =
    timedItems.length > 0 ? timedItems[timedItems.length - 1] : null;

  const lastEndMinutes = (() => {
    if (!lastTimedItem?.endTime) return undefined;
    const minutes = hhmmToMinutes(lastTimedItem.endTime);
    return Number.isFinite(minutes) && minutes >= 0 && minutes < 24 * 60
      ? minutes
      : undefined;
  })();

  const nextEndMinutes =
    lastEndMinutes !== undefined && lastEndMinutes + 60 < 24 * 60
      ? lastEndMinutes + 60
      : undefined;

  const newDraftDefaultStart =
    lastEndMinutes !== undefined
      ? hhmmToTimeValue(minutesToHHmm(lastEndMinutes))
      : undefined;
  const newDraftDefaultEnd =
    nextEndMinutes !== undefined
      ? hhmmToTimeValue(minutesToHHmm(nextEndMinutes))
      : undefined;

  const regionEditTarget =
    regionTargetId === DRAFT_ID
      ? { location: draft?.address }
      : items.find((item) => item.id === regionTargetId);

  const initialRegionId = regionOptions.find(
    (r) => r.label === regionEditTarget?.location
  )?.id;

  const initialTagIds = draft?.planTagRegistReqDTOList
    ? draft.planTagRegistReqDTOList.map((t) => t.tagNum)
    : [];

  // source 기반으로 planFormInfo 분리
  const planFormInfo =
    draft?.source === "AI"
      ? {
          mode: "Create" as const,
          planNm: draft?.planNm,
          startTime: draft?.startTime,
          endTime: draft?.endTime,
          address: draft?.address,
          tags: draft?.planTagRegistReqDTOList,
          onClickTime: handlePlanFormTimeClick,
          onClickAddress: handlePlanFormAddressClick,
          onClickTags: handlePlanFormTagsClick,
          // 지역이 1개뿐이면 지역(장소) 선택 항목 자체를 숨김
          hideAddress: !!singleRegion,
        }
      : {
          mode: "UserCustom" as const,
          planNm: draft?.planNm,
          startTime: draft?.startTime,
          endTime: draft?.endTime,
          address: draft?.address,
          onClickTime: handlePlanFormTimeClick,
          onClickAddress: handlePlanFormAddressClick,
        };

  return {
    formHandlers: {
      handleAddPlan,
      handleCardClick,
      handleTimeClick,
      handleLocationClick,
    },
    categoryModalProps: {
      isOpen: isCategoryOpen,
      onClose: () => setIsCategoryOpen(false),
      onSelectOption: handleCategorySelect,
      onClickAction: () => {
        setIsCategoryOpen(false);
        setIsPlanNameOpen(true);
      },
    },
    planNameModalProps: {
      isOpen: isPlanNameOpen,
      onConfirm: handlePlanNameConfirm,
      onCancel: () => setIsPlanNameOpen(false),
    },
    planFormModalProps: {
      action: {
        isOpen: isPlanFormOpen,
        onClose: handlePlanFormClose,
        onConfirm: handlePlanFormClose,
      },
      info: planFormInfo,
    },
    timeModalProps: {
      isOpen: isTimeOpen,
      initialStartTime: timeEditTarget?.startTime
        ? hhmmToTimeValue(timeEditTarget.startTime)
        : newDraftDefaultStart,
      initialEndTime: timeEditTarget?.endTime
        ? hhmmToTimeValue(timeEditTarget.endTime)
        : newDraftDefaultEnd,
      onConfirm: handleTimeConfirm,
      onCancel: handleTimeCancel,
    },
    regionModalProps: {
      isOpen: isRegionOpen,
      regions: regionOptions,
      initialSelectedId: initialRegionId,
      onConfirm: handleRegionConfirm,
      onCancel: handleRegionCancel,
    },
    tagModalProps: {
      isOpen: isTagOpen,
      tags: tagOptions,
      initialSelectedIds: initialTagIds,
      onConfirm: handleTagConfirm,
      onCancel: handleTagCancel,
    },
  };
};
