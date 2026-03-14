import { useEffect, useState, useRef } from "react";
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
import { createSchedule, saveSchedule, getScheduleDetail } from "@/api/queries";
import type { PlanRegistResDTO, ScheduleRegistResDTO } from "@/api/types";
import { toCommonPlan } from "@/utils/api/planMapper";
import { useUpdateScheduleMutation } from "@/hooks/mutations/useUpdateScheduleMutation";

const ScheduleRoutesPage = ({ variant }: ScheduleRoutesPageProps) => {
  const navigate = useNavigate();

  const isCreate = variant === "create";
  const isDetail = variant === "detail";

  // ----- create: 일정 생성 로직 -----
  const { buildRequest, reset } = useScheduleDraftStore();
  const { clearRegions } = useRegionSelectionStore();
  const updateMutation = useUpdateScheduleMutation();

  // create / detail 공통 state
  const [scheduleResult, setScheduleResult] =
    useState<ScheduleRegistResDTO | null>(null);
  const [planList, setPlanList] = useState<PlanRegistResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(isCreate);
  const [isDetailLoading, setIsDetailLoading] = useState(isDetail);

  // useRef로 중복 호출 방지
  // sessionStorage와 달리 컴포넌트 인스턴스에 묶여있어 탭 간 공유 / 이전 값 잔류 문제가 없음
  // React StrictMode의 마운트→언마운트→재마운트 사이클에서도 정확히 1회 fetch 보장
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!isCreate) return;
    if (hasFetched.current) return; // 이미 호출됐으면 스킵
    hasFetched.current = true;

    setIsLoading(true);

    const fetchCreateSchedule = async () => {
      try {
        const req = buildRequest();
        const res = await createSchedule(req);

        // HTTP 200이지만 에러 코드로 내려오는 경우 처리 (catch에 안 걸림)
        if (res.code !== "S201") {
          toast(res.message ?? "일정 생성에 실패했습니다.");
          navigate(-1);
          return;
        }

        setScheduleResult(res.data);
        setPlanList(res.data?.planRegistResDTOList ?? []);
      } catch (err) {
        if (err instanceof AxiosError) {
          toast(err.response?.data?.message ?? "일정 생성에 실패했습니다.");
        } else if (err instanceof Error) {
          toast(err.message);
        } else {
          toast("일정 생성에 실패했습니다.\n다시 시도해주세요");
        }
        console.error(err);
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreateSchedule();
  }, []);

  // ----- detail: 일정 상세 로직 -----
  const { id } = useParams<{ id: string }>();
  const scheduleNum = id ? Number(id) : undefined;

  useEffect(() => {
    if (!isDetail || !scheduleNum || Number.isNaN(scheduleNum)) return;

    setIsDetailLoading(true);
    let ignore = false;

    const fetchDetail = async () => {
      try {
        const res = await getScheduleDetail(scheduleNum);
        if (ignore) return;

        if (res.code !== "S202") {
          toast(res.message ?? "일정을 불러오지 못했습니다");
          navigate(-1);
          return;
        }

        // ScheduleDetailResDTO → 공통 state로 변환 후 저장
        const convertedPlans = res.data.planDetailVOList.map(toCommonPlan);
        setScheduleResult({
          scheduleNum: res.data.scheduleNum,
          scheduleNm: res.data.scheduleNm,
          startDate: res.data.startDate,
          endDate: res.data.endDate,
          scheduleTagRegistResDTOList: [],
          planRegistResDTOList: convertedPlans,
        });
        setPlanList(convertedPlans);
      } catch (err) {
        if (ignore) return;
        if (err instanceof AxiosError) {
          toast(err.response?.data?.message ?? "일정을 불러오지 못했습니다");
        } else if (err instanceof Error) {
          toast(err.message);
        } else {
          toast("일정을 불러오지 못했습니다");
        }
        console.error(err);
        navigate(-1);
      } finally {
        if (!ignore) setIsDetailLoading(false);
      }
    };

    fetchDetail();
    return () => {
      ignore = true;
    };
  }, [scheduleNum]);

  // ----- 헤더 영역 -----
  const [scheduleName, setScheduleName] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<string>("");

  // 일정 이름 / 날짜 초기 세팅
  useEffect(() => {
    if (!scheduleResult) return;
    setScheduleName(
      scheduleResult.scheduleNm ?? (isCreate ? "생성된 일정" : "오늘의 일정")
    );
    setScheduleDate(scheduleResult.startDate ?? "");
  }, [scheduleResult]);

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
  const { setDraft, draft: editDraft, clearDraft } = usePlanEditStore();

  const handleRequestEdit = (planNum: number) => {
    const target = planList.find((p) => p.planNum === planNum);
    if (!target) return;

    setDraft({
      planNum: target.planNum ?? planNum,
      plan: {
        planNm: target.planNm ?? "",
        startTime: target.startTime,
        endTime: target.endTime,
      },
      place: {
        placeNum: null,
        placeNm: target.regionNm ?? "",
        address: target.planAddress ?? "",
      },
    });

    setIsEditModalOpen(true);
  };

  const [planNotes, setPlanNotes] = useState<PlanNoteMap>({});

  const handleChangeNote = (planNum: number, nextValue: string) => {
    setPlanNotes((prev) => ({ ...prev, [planNum]: nextValue }));
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
      reset();
      clearRegions();
      toast("일정이 저장되었습니다");
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
      <PageLoading message="AI가 일정을 생성하고 있어요" isHeaderDark={false} />
    );
  }

  if (isDetail && isDetailLoading) {
    return (
      <PageLoading message="일정을 불러오는 중이에요" isHeaderDark={false} />
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
              // editDraft 변경사항을 planList와 scheduleResult에 반영 후 수정 API 호출
              if (scheduleResult) {
                const updatedPlans = planList.map((p) =>
                  p.planNum === editDraft.planNum
                    ? {
                        ...p,
                        planNm: editDraft.plan.planNm,
                        startTime: editDraft.plan.startTime,
                        endTime: editDraft.plan.endTime,
                        regionNm: editDraft.place.placeNm,
                        planAddress: editDraft.place.address,
                      }
                    : p
                );
                const updatedSchedule = {
                  ...scheduleResult,
                  planRegistResDTOList: updatedPlans,
                };
                setPlanList(updatedPlans);
                setScheduleResult(updatedSchedule);
                updateMutation.mutate(updatedSchedule);
              }
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
          if (deletePlanNum == null || !scheduleResult) {
            handleCloseDeleteModal();
            return;
          }
          // 해당 계획을 목록에서 제거 후 수정 API 호출
          const updatedPlans = planList.filter(
            (p) => p.planNum !== deletePlanNum
          );
          const updatedSchedule = {
            ...scheduleResult,
            planRegistResDTOList: updatedPlans,
          };
          setPlanList(updatedPlans);
          setScheduleResult(updatedSchedule);
          updateMutation.mutate(updatedSchedule);
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
          plans={planList}
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
            onChangeScheduleName: handleChangeScheduleName,
          }}
          plans={planList}
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
