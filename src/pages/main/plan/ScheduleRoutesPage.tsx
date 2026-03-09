import { useEffect, useState } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import type { ScheduleRoutesPageProps } from "@/types/main/plan/scheduleRoutes";
import type { PlanNoteMap } from "@/types/main/plan/bottom-modal/planFromTypes";

import { usePlanEditStore } from "@/stores/planEditStore";

import PageLoading from "@/components/layout/PageLoading";
import ScheduleRoutesContent from "@/components/main/plan/route/ScheduleRoutesContent";

import { CreateScheduleModal } from "@/components/main/plan/create/CreateScheduleModal";
import PlanFormModal from "@/components/main/plan/common/modal/PlanFormModal";
import DeletePlanModal from "@/components/main/plan/create/DeletePlanModal";

// === server ===
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import { useScheduleDraftStore } from "@/stores/scheduleStore";
import { createSchedule } from "@/api/queries";
import type { PlanRegistResDTO, ScheduleRegistResDTO } from "@/api/types";
import { saveSchedule } from "@/api/queries";

const ScheduleRoutesPage = ({ variant }: ScheduleRoutesPageProps) => {
  const navigate = useNavigate();

  const isCreate = variant === "create";
  const isDetail = variant === "detail";

  // ----- 일정 생성 로직 -----
  const { buildRequest, reset } = useScheduleDraftStore();
  const { clearRegions } = useRegionSelectionStore();

  const [scheduleResult, setScheduleResult] =
    useState<ScheduleRegistResDTO | null>(null);
  const [createPlans, setCreatePlans] = useState<PlanRegistResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isCreate) return;

    let ignore = false;

    const fetchCreateSchedule = async () => {
      try {
        const req = buildRequest();
        const res = await createSchedule(req);
        if (ignore) return;
        setScheduleResult(res.data);
        setCreatePlans(res.data?.planRegistResDTOList ?? []);
      } catch (err) {
        if (ignore) return;
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data?.message ?? "일정 생성에 실패했습니다."
          );
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast("일정 생성에 실패했습니다.\n다시 시도해주세요");
        }
        console.error(err);
        navigate(-1);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchCreateSchedule();

    return () => {
      ignore = true;
    }; // 언마운트 시 결과 무시
  }, []);

  const { id } = useParams<{ id: string }>();

  // ----- 헤더 영역 -----
  const [scheduleName, setScheduleName] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<string>("");

  const scheduleNum = id ? Number(id) : undefined;

  // ----- detail 모드 플랜 리스트 -----

  // ----- 일정 이름 / 날짜 초기 세팅 -----
  useEffect(() => {
    if (!isDetail) {
      setScheduleName(scheduleResult?.scheduleNm ?? "생성된 일정");
      setScheduleDate(scheduleResult?.startDate ?? "");
      return;
    }

    if (!scheduleNum || Number.isNaN(scheduleNum)) {
      setScheduleName("오늘의 일정");
      setScheduleDate("");
      return;
    }
  }, [isDetail, scheduleNum, scheduleResult]);

  // scheduleName이 바뀔 때 scheduleResult도 동기화
  const handleChangeScheduleName = (next: string) => {
    setScheduleName(next);
    setScheduleResult((prev) => (prev ? { ...prev, scheduleNm: next } : prev));
  };

  // ----- 일정 삭제하기 modal -----
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletePlanNum, setDeletePlanNum] = useState<number | null>(null);

  const handleRequestDelete = (planNum: number) => {
    setDeletePlanNum(planNum);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletePlanNum(null);
  };

  // ----- 일정 수정하기 bottom modal -----
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const { draft: editDraft, clearDraft } = usePlanEditStore();

  const handleRequestEdit = () => /**
   * (planNum: number)
   */ {
    // TODO: 추후 선택된 plan의 Num을 연동
    // - 기존 필터링 함수의 경우 서버 연동 시 필요 없는 부분이라 제외

    setIsEditModalOpen(true);
  };

  const [planNotes, setPlanNotes] = useState<PlanNoteMap>({});

  const handleChangeNote = (planNum: number, nextValue: string) => {
    setPlanNotes((prev) => ({
      ...prev,
      [planNum]: nextValue,
    }));
  };

  // ----- 일정 confirm -----
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  // ----- 일정 저장 로직 -----
  const handleSaveSchedule = async () => {
    if (!scheduleResult) return;

    try {
      const res = await saveSchedule(scheduleResult);
      if (res.code !== "S204" && res.code !== "S203") {
        toast(res.message ?? "일정 저장에 실패했습니다.");
        return;
      }
      handleCloseCreateModal();

      // 일정 저장 성공 시 store 초기화
      reset();
      clearRegions();
      navigate(ROUTES.PLAN.LIST);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast(err.response?.data?.message ?? "일정 저장에 실패했습니다.");
      } else if (err instanceof Error) {
        toast(err.message);
      } else {
        toast("일정 저장에 실패했습니다.\n다시 시도해주세요");
      }
    }
  };

  // ----- 로딩 중 -----
  if (isCreate && isLoading) {
    return (
      <PageLoading
        message="AI가 일정을 생성하고 있어요. 잠시만 기다려주세요"
        isHeaderDark={false}
      />
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-gray-5">
      <CreateScheduleModal
        isConfirmOpen={isCreateModalOpen}
        onConfirmCancel={handleCloseCreateModal}
        onConfirmConfirm={handleSaveSchedule}
      />

      {editDraft && (
        <PlanFormModal
          action={{
            isOpen: isEditModalOpen,
            onClose: () => {
              setIsEditModalOpen(false);
              clearDraft();
            },
            onConfirm: () => {},
            onClickEditTitle: () => {},
          }}
          info={{
            mode: "Edit",
            planNum: editDraft.planNum,
            planNm: editDraft.plan.planNm,
            startTime: editDraft.plan.startTime,
            endTime: editDraft.plan.endTime,
            address: editDraft.place.address,
            onClickAddress: () => navigate("search"),
            onClickTime: () => {},
            note: planNotes[editDraft.planNum],
            noteValue: planNotes[editDraft.planNum] ?? "",
            onChangeNote: (next: string) =>
              handleChangeNote(editDraft.planNum, next),
          }}
        />
      )}

      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClickCancel={handleCloseDeleteModal}
        onClickConfirm={() => {
          console.log("삭제할 일정:", deletePlanNum);
          handleCloseDeleteModal();
        }}
      />

      {isCreate && (
        <ScheduleRoutesContent
          header={{
            scheduleDate,
            scheduleName,
            onChangeScheduleName: handleChangeScheduleName,
          }}
          plans={createPlans}
          isEditable={false}
          footer={{
            onClickConfirm: () => setIsCreateModalOpen(true),
          }}
        />
      )}
      {isDetail && (
        <ScheduleRoutesContent
          header={{
            scheduleDate,
            scheduleName,
            onChangeScheduleName: setScheduleName,
          }}
          plans={[]}
          isEditable={isDetail}
          onRequestEdit={handleRequestEdit}
          onRequestDelete={handleRequestDelete}
        />
      )}
      <Outlet />
    </div>
  );
};

export default ScheduleRoutesPage;
