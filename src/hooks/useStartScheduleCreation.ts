import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { useScheduleDraftStore } from "@/stores/scheduleStore";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import { useConfirmModalStore } from "@/stores/confirmModalStore";

/**
 * 새 일정 생성 플로우 진입 훅
 * - 작성 중이던 draft(지역 선택 이후 단계)가 있으면 이어하기/새로 만들기 확인 모달을 띄운다.
 * - FAB, 일정 리스트의 추가 버튼 등 진입점이 여러 곳이라 공용 훅으로 분리.
 */
export const useStartScheduleCreation = () => {
  const navigate = useNavigate();
  const { draft, reset } = useScheduleDraftStore();
  const { clearRegions } = useRegionSelectionStore();
  const { openConfirmModal } = useConfirmModalStore();

  // 이어하기(resume) 대상은 "두 번째 지역 선택 단계에서 지역을 고른 시점"부터.
  // 날짜만 정한 첫 페이지 이탈은 이어하기 대상이 아님 → 항상 새로 시작.
  const hasResumableDraft = draft.scheduleRegionRegistReqDTOList.length > 0;

  const startScheduleCreation = () => {
    if (hasResumableDraft) {
      openConfirmModal(
        {
          title: "이어서 만드시겠습니까?",
          content: "이전에 작성 중인 일정이 있습니다.\n이어서 만드시겠습니까?",
          confirmLabel: "이어하기",
          cancelLabel: "새로 만들기",
        },
        () => navigate(ROUTES.PLAN.DATE),
        () => {
          reset();
          clearRegions();
          navigate(ROUTES.PLAN.DATE);
        }
      );
    } else {
      // 지역 선택 전 단계(날짜 등)는 저장/복원하지 않고 깨끗한 상태로 시작
      reset();
      clearRegions();
      navigate(ROUTES.PLAN.DATE);
    }
  };

  return { startScheduleCreation };
};
