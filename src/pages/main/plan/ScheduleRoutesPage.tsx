import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import type { ScheduleRoutesPageProps } from "@/types/main/plan/scheduleRoutes";
import type { PlanNoteMap } from "@/types/main/plan/bottom-modal/planFromTypes";

import { usePlanEditStore } from "@/stores/planEditStore";

import SkeletonScheduleRoutesContent from "@/components/main/plan/route/SkeletonScheduleRoutesContent";
import ScheduleRoutesContent from "@/components/main/plan/route/ScheduleRoutesContent";

import { CreateScheduleModal } from "@/components/main/plan/create/CreateScheduleModal";
import PlanFormModal from "@/components/main/plan/common/modal/PlanFormModal";
import DeletePlanModal from "@/components/main/plan/create/DeletePlanModal";
import DeleteLastPlanScheduleModal from "@/components/main/plan/create/DeleteLastPlanScheduleModal";
import PlanNameInputModal from "@/components/main/plan/common/modal/PlanNameInputModal";
import { SelectTimeConfirmModal } from "@/components/main/plan/common/modal/SelectTimeConfirmModal";

// === server ===
import { useQueryClient } from "@tanstack/react-query";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import { useScheduleDraftStore } from "@/stores/scheduleStore";
import { createSchedule, saveSchedule, getScheduleDetail } from "@/api/queries";
import { scheduleKeys } from "@/api/keyFactories";
import type {
  PlanRegistResDTO,
  ScheduleRegistResDTO,
  BaseResponse,
  ScheduleListResDTO,
  UserAddedPlaceDTO,
} from "@/api/types";
import { toCommonPlan } from "@/utils/api/planMapper";
import { useUpdateScheduleMutation } from "@/hooks/mutations/useUpdateScheduleMutation";
import { useDeleteScheduleMutation } from "@/hooks/mutations/useDeleteScheduleMutation";
import { timeValueToHHmm, hhmmToTimeValue } from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import { useLoadingStore } from "@/stores/loadingStore";

const ScheduleRoutesPage = ({ variant }: ScheduleRoutesPageProps) => {
  const navigate = useNavigate();

  const isCreate = variant === "create";
  const isDetail = variant === "detail";

  // ----- create: 일정 생성 로직 -----
  const queryClient = useQueryClient();
  const { buildRequest, reset } = useScheduleDraftStore();
  const { clearRegions } = useRegionSelectionStore();
  const updateMutation = useUpdateScheduleMutation();
  const deleteScheduleMutation = useDeleteScheduleMutation();
  const { showLoading, hideLoading } = useLoadingStore();

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
    showLoading("AI가 일정을 생성하고 있어요");

    const fetchCreateSchedule = async () => {
      try {
        const req = buildRequest();
        const res = await createSchedule(req);
        console.log("[create 응답]", JSON.stringify(res.data, null, 2));

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
        hideLoading();
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
        console.log("[detail 응답]", JSON.stringify(res.data, null, 2));
        if (ignore) return;

        if (res.code !== "S202") {
          toast(res.message ?? "일정을 불러오지 못했습니다");
          navigate(-1);
          return;
        }

        // ScheduleDetailResDTO → 공통 state로 변환 후 저장
        // detail API에 태그가 포함되지 않으므로 목록 캐시에서 복원
        const listCache = queryClient.getQueryData<
          BaseResponse<ScheduleListResDTO>
        >(scheduleKeys.lists());
        const allItems = [
          ...(listCache?.data?.upcomingSchedules ?? []),
          ...(listCache?.data?.pastSchedules ?? []),
        ];
        const cachedTags =
          allItems.find((s) => s.scheduleNum === res.data.scheduleNum)
            ?.scheduleTagRegistResDTOList ?? [];

        const convertedPlans = res.data.planDetailVOList.map(toCommonPlan);
        setScheduleResult({
          scheduleNum: res.data.scheduleNum,
          scheduleNm: res.data.scheduleNm,
          startDate: res.data.startDate,
          endDate: res.data.endDate,
          scheduleTagRegistResDTOList: cachedTags,
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

  // 입력 중에는 로컬 state만 갱신 (실시간 표시용)
  const handleChangeScheduleName = (next: string) => {
    setScheduleName(next);
  };

  // 포커스 아웃 시점에 변경분이 있으면 scheduleResult 갱신 + detail에서만 서버 반영
  // 옵티미스틱 업데이트: 실패 시 이전 상태로 롤백
  const handleCommitScheduleName = (finalName: string) => {
    if (!scheduleResult) return;
    if (finalName === (scheduleResult.scheduleNm ?? "")) return;

    const prevSchedule = scheduleResult;
    const updatedSchedule = { ...scheduleResult, scheduleNm: finalName };
    setScheduleResult(updatedSchedule);
    setScheduleName(finalName);

    if (isDetail) {
      updateMutation.mutate(updatedSchedule, {
        onError: () => {
          setScheduleResult(prevSchedule);
          setScheduleName(prevSchedule.scheduleNm ?? "");
        },
      });
    }
  };

  // ----- 일정 삭제하기 modal -----
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletePlanNum, setDeletePlanNum] = useState<number | null>(null);
  // 마지막 plan 삭제 시도 → 일정 자체 삭제 확인 모달
  const [isLastPlanDeleteModalOpen, setIsLastPlanDeleteModalOpen] =
    useState<boolean>(false);

  const handleRequestDelete = (planNum: number) => {
    setDeletePlanNum(planNum);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletePlanNum(null);
  };

  const handleConfirmDeleteSchedule = () => {
    if (!scheduleResult) {
      setIsLastPlanDeleteModalOpen(false);
      return;
    }
    // 중복 클릭으로 mutate가 여러 번 호출되는 것을 방지
    if (deleteScheduleMutation.isPending) return;
    deleteScheduleMutation.mutate(scheduleResult.scheduleNum, {
      onSuccess: () => {
        setIsLastPlanDeleteModalOpen(false);
        navigate(ROUTES.PLAN.LIST);
      },
    });
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
        address: target.planAddress ?? target.regionNm ?? "",
      },
    });

    setIsEditModalOpen(true);
  };

  // 장소 검색 페이지에서 선택한 장소를 draft에 직접 반영하는 콜백
  // Outlet context로 LocationSearchPage에 전달하여 store 타이밍 문제 우회
  const handlePlaceSelect = (place: UserAddedPlaceDTO) => {
    const currentDraft = editDraft ?? usePlanEditStore.getState().draft;
    if (!currentDraft) return;
    setDraft({
      ...currentDraft,
      place: {
        placeNum: null,
        placeNm: place.placeName,
        address: place.addressName ?? place.placeName,
      },
    });
    setIsEditModalOpen(true);
  };

  const [planNotes, setPlanNotes] = useState<PlanNoteMap>({});

  const handleChangeNote = (planNum: number, nextValue: string) => {
    setPlanNotes((prev) => ({ ...prev, [planNum]: nextValue }));
  };

  // ----- 계획 제목 수정 모달 -----
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);

  const handleEditTitleClick = () => setIsNameModalOpen(true);

  const handleNameConfirm = (planNm: string) => {
    if (editDraft) {
      setDraft({ ...editDraft, plan: { ...editDraft.plan, planNm } });
    }
    setIsNameModalOpen(false);
  };

  // ----- 계획 시간 수정 모달 -----
  const [isTimeModalOpen, setIsTimeModalOpen] = useState<boolean>(false);

  const handleTimeClick = () => setIsTimeModalOpen(true);

  const handleTimeConfirm = (start: TimeValue, end: TimeValue) => {
    if (editDraft) {
      setDraft({
        ...editDraft,
        plan: {
          ...editDraft.plan,
          startTime: timeValueToHHmm(start),
          endTime: timeValueToHHmm(end),
        },
      });
    }
    setIsTimeModalOpen(false);
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
      await queryClient.invalidateQueries({
        queryKey: scheduleKeys.lists(),
      });
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
    return <SkeletonScheduleRoutesContent />;
  }

  if (isDetail && isDetailLoading) {
    return <SkeletonScheduleRoutesContent />;
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
              // 옵티미스틱 업데이트: 실패 시 이전 상태로 롤백
              if (scheduleResult) {
                const originalPlan = planList.find(
                  (p) => p.planNum === editDraft.planNum
                );
                const hasChanged =
                  !!originalPlan &&
                  (editDraft.plan.planNm !== (originalPlan.planNm ?? "") ||
                    editDraft.plan.startTime !== originalPlan.startTime ||
                    editDraft.plan.endTime !== originalPlan.endTime ||
                    editDraft.place.placeNm !== (originalPlan.regionNm ?? "") ||
                    editDraft.place.address !==
                      (originalPlan.planAddress ?? originalPlan.regionNm ?? ""));

                if (hasChanged) {
                  const prevPlans = planList;
                  const prevSchedule = scheduleResult;

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
                  updateMutation.mutate(updatedSchedule, {
                    onError: () => {
                      setPlanList(prevPlans);
                      setScheduleResult(prevSchedule);
                    },
                  });
                }
              }
              setIsEditModalOpen(false);
              clearDraft();
            },
            onConfirm: () => {},
            onClickEditTitle: handleEditTitleClick,
          }}
          info={{
            mode: "Edit",
            planNum: editDraft.planNum,
            planNm: editDraft.plan.planNm,
            startTime: editDraft.plan.startTime,
            endTime: editDraft.plan.endTime,
            address: editDraft.place.address,
            onClickAddress: () => navigate("search"),
            onClickTime: handleTimeClick,
            note: planNotes[editDraft.planNum],
            noteValue: planNotes[editDraft.planNum] ?? "",
            onChangeNote: (next: string) =>
              handleChangeNote(editDraft.planNum, next),
          }}
        />
      )}

      <PlanNameInputModal
        isOpen={isNameModalOpen}
        initialValue={editDraft?.plan.planNm}
        onConfirm={handleNameConfirm}
        onCancel={() => setIsNameModalOpen(false)}
      />

      <SelectTimeConfirmModal
        isOpen={isTimeModalOpen}
        initialStartTime={
          editDraft?.plan.startTime
            ? hhmmToTimeValue(editDraft.plan.startTime)
            : undefined
        }
        initialEndTime={
          editDraft?.plan.endTime
            ? hhmmToTimeValue(editDraft.plan.endTime)
            : undefined
        }
        onConfirm={handleTimeConfirm}
        onCancel={() => setIsTimeModalOpen(false)}
      />

      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClickCancel={handleCloseDeleteModal}
        onClickConfirm={() => {
          if (deletePlanNum == null || !scheduleResult) {
            handleCloseDeleteModal();
            return;
          }
          // 마지막 계획이면 일정 자체가 삭제되므로 별도 확인 모달로 분기
          if (planList.length <= 1) {
            handleCloseDeleteModal();
            setIsLastPlanDeleteModalOpen(true);
            return;
          }
          // 해당 계획을 목록에서 제거 후 수정 API 호출
          // 옵티미스틱 업데이트: 실패 시 이전 상태로 롤백
          const prevPlans = planList;
          const prevSchedule = scheduleResult;

          const updatedPlans = planList.filter(
            (p) => p.planNum !== deletePlanNum
          );
          const updatedSchedule = {
            ...scheduleResult,
            planRegistResDTOList: updatedPlans,
          };
          setPlanList(updatedPlans);
          setScheduleResult(updatedSchedule);
          updateMutation.mutate(updatedSchedule, {
            onError: () => {
              setPlanList(prevPlans);
              setScheduleResult(prevSchedule);
            },
          });
          handleCloseDeleteModal();
        }}
      />

      <DeleteLastPlanScheduleModal
        isOpen={isLastPlanDeleteModalOpen}
        onClickCancel={() => setIsLastPlanDeleteModalOpen(false)}
        onClickConfirm={handleConfirmDeleteSchedule}
      />

      {isCreate && (
        <ScheduleRoutesContent
          header={{
            scheduleDate,
            scheduleName,
            onChangeScheduleName: handleChangeScheduleName,
            onCommitScheduleName: handleCommitScheduleName,
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
            onCommitScheduleName: handleCommitScheduleName,
          }}
          plans={planList}
          isEditable={isDetail}
          onRequestEdit={handleRequestEdit}
          onRequestDelete={handleRequestDelete}
        />
      )}
      <Outlet context={{ onPlaceSelect: handlePlaceSelect }} />
    </div>
  );
};

export default ScheduleRoutesPage;
