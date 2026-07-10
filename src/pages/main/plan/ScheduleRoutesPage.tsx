import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { arrayMove } from "@dnd-kit/sortable";

import { ROUTES } from "@/constants/routes";
import type { ScheduleRoutesPageProps } from "@/types/main/plan/scheduleRoutes";
import type { PlanNoteMap } from "@/types/main/plan/bottom-modal/planFromTypes";

import { usePlanEditStore } from "@/stores/planEditStore";

import SkeletonScheduleRoutesContent from "@/components/main/plan/route/SkeletonScheduleRoutesContent";
import ScheduleRoutesContent from "@/components/main/plan/route/ScheduleRoutesContent";
import ScheduleInfoBottomSheet from "@/components/main/plan/route/ScheduleInfoBottomSheet";
import ScheduleDetailMenu from "@/components/main/plan/route/ScheduleDetailMenu";
import { BackHeader } from "@/components/common/headers/BackHeader";

import { CreateScheduleModal } from "@/components/main/plan/create/CreateScheduleModal";
import PlanFormModal from "@/components/main/plan/common/modal/PlanFormModal";
import DeletePlanModal from "@/components/main/plan/create/DeletePlanModal";
import DeleteLastPlanScheduleModal from "@/components/main/plan/create/DeleteLastPlanScheduleModal";
import DeleteScheduleModal from "@/components/main/plan/DeleteScheduleModal";
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
import {
  toCommonPlan,
  toUserPlaceReq,
  toAIReq,
  toUserCustomReq,
} from "@/utils/api/planMapper";
import { useUpdateScheduleMutation } from "@/hooks/mutations/useUpdateScheduleMutation";
import { useDeleteScheduleMutation } from "@/hooks/mutations/useDeleteScheduleMutation";
import { timeValueToHHmm, hhmmToTimeValue } from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import { getScheduleMemo, setScheduleMemo } from "@/utils/scheduleMemoStorage";
import { useLoadingStore } from "@/stores/loadingStore";

// 순서 변경 시 시간 재계산용 헬퍼 (HH:mm ↔ 분)
const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (min: number) => {
  const clamped = Math.max(0, Math.min(min, 1439));
  return `${String(Math.floor(clamped / 60)).padStart(2, "0")}:${String(
    clamped % 60
  ).padStart(2, "0")}`;
};

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

  // create: "유지" 체크된 카드 index 집합 (로컬 상태 — 서버 DTO에 넣지 않음)
  // create 플랜은 planNum이 없어 index로 식별하며, 다시 만들기 시 유지 대상 표시에 사용
  const [keptIndexes, setKeptIndexes] = useState<Set<number>>(new Set());

  const toggleKept = (index: number) =>
    setKeptIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

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
        console.log("[create 요청]", JSON.stringify(req, null, 2));
        const res = await createSchedule(req);
        console.log("[create 응답] code:", res.code, "message:", res.message);
        console.log("[create 응답] data:", res.data);

        // HTTP 200이지만 에러 코드로 내려오는 경우 처리 (catch에 안 걸림)
        if (res.code !== "S201") {
          toast(res.message ?? "일정 생성에 실패했습니다.");
          navigate(-1);
          return;
        }

        // 성공 코드인데 data가 비어 있으면(서버가 계획을 못 만든 경우) 빈 화면 대신 실패 처리
        if (!res.data) {
          toast(res.message ?? "생성된 일정이 비어 있어요. 다시 시도해주세요");
          navigate(-1);
          return;
        }

        setScheduleResult(res.data);
        setPlanList(res.data.planRegistResDTOList ?? []);
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

        // 서버가 내려준 메모를 로컬 입력 state로 복원 (없으면 빈 맵)
        const initialNotes: PlanNoteMap = {};
        convertedPlans.forEach((p) => {
          if (p.planNum != null && p.planMemo != null) {
            initialNotes[p.planNum] = p.planMemo;
          }
        });
        setPlanNotes(initialNotes);
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

  // 빠른 연속 commit 시 stale 롤백을 무시하기 위한 토큰
  // 더 새로운 commit이 끼어든 뒤 이전 mutation이 늦게 실패해도 UI를 잘못 되돌리지 않게 함
  const scheduleNameCommitTokenRef = useRef(0);

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
      const myToken = ++scheduleNameCommitTokenRef.current;
      updateMutation.mutate(updatedSchedule, {
        onError: () => {
          // 더 새로운 commit이 이미 발사됐으면 이 onError의 롤백은 stale이므로 무시
          if (myToken !== scheduleNameCommitTokenRef.current) return;
          setScheduleResult(prevSchedule);
          setScheduleName(prevSchedule.scheduleNm ?? "");
        },
      });
    }
  };

  // ----- 일정 정보 바텀시트 (detail 전용: 이름 + 일정 메모) -----
  // 일정 레벨 메모는 서버 필드가 없어 브릿지 로컬 저장(scheduleMemoStorage) 사용
  const [scheduleMemo, setScheduleMemoState] = useState<string>("");
  const [isInfoSheetOpen, setIsInfoSheetOpen] = useState(false);

  // detail 진입 시 로컬 저장된 일정 메모 로드
  useEffect(() => {
    if (isDetail && scheduleNum && !Number.isNaN(scheduleNum)) {
      getScheduleMemo(scheduleNum).then(setScheduleMemoState);
    }
  }, [isDetail, scheduleNum]);

  // 시트 "저장하기": 이름은 기존 옵티미스틱 커밋 재사용, 메모는 로컬 저장
  const handleSaveInfo = (name: string, memo: string) => {
    if (name && name !== scheduleName) handleCommitScheduleName(name);
    if (scheduleNum && !Number.isNaN(scheduleNum)) {
      setScheduleMemo(scheduleNum, memo);
    }
    setScheduleMemoState(memo);
    setIsInfoSheetOpen(false);
  };

  // ----- 일정 삭제하기 modal -----
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletePlanNum, setDeletePlanNum] = useState<number | null>(null);
  // 마지막 plan 삭제 시도 → 일정 자체 삭제 확인 모달
  const [isLastPlanDeleteModalOpen, setIsLastPlanDeleteModalOpen] =
    useState<boolean>(false);
  // 헤더 kebab "일정 삭제" → 일정 삭제 확인 모달
  const [isDeleteScheduleModalOpen, setIsDeleteScheduleModalOpen] =
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
      setIsDeleteScheduleModalOpen(false);
      return;
    }
    // 중복 클릭으로 mutate가 여러 번 호출되는 것을 방지
    if (deleteScheduleMutation.isPending) return;
    // 토스트는 useDeleteScheduleMutation 훅 내부 onError/onSuccess가 처리하므로 여기선 생략
    // 성공/실패 무관하게 모달은 정리, 성공 시에만 목록으로 이동
    deleteScheduleMutation.mutate(scheduleResult.scheduleNum, {
      onSuccess: () => navigate(ROUTES.PLAN.LIST),
      onSettled: () => {
        setIsLastPlanDeleteModalOpen(false);
        setIsDeleteScheduleModalOpen(false);
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
        placeUrl: target.planLink ?? "",
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
      plan: {
        ...currentDraft.plan,
        // 이름이 비어 있으면 장소명으로 자동 채움 (장소만 골라도 계획명이 확보돼 저장 가능)
        planNm: currentDraft.plan.planNm.trim() || place.placeName,
      },
      place: {
        placeNum: null,
        placeNm: place.placeName,
        address: place.addressName ?? place.placeName,
        placeUrl: place.placeUrl ?? "",
      },
    });
    setIsEditModalOpen(true);
  };

  const [planNotes, setPlanNotes] = useState<PlanNoteMap>({});

  const handleChangeNote = (planNum: number, nextValue: string) => {
    setPlanNotes((prev) => ({ ...prev, [planNum]: nextValue }));
  };

  // 인라인 메모 blur 시 커밋 — 변경분 있으면 옵티미스틱 updateSchedule
  const handleCommitNote = (planNum: number) => {
    if (!scheduleResult) return;
    const originalPlan = planList.find((p) => p.planNum === planNum);
    if (!originalPlan) return;
    const nextMemo = planNotes[planNum] ?? "";
    if (nextMemo === (originalPlan.planMemo ?? "")) return; // 변경 없음

    const prevPlans = planList;
    const prevSchedule = scheduleResult;
    const updatedPlans = planList.map((p) =>
      p.planNum === planNum ? { ...p, planMemo: nextMemo } : p
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
  };

  // ----- 순서 변경 모드 (detail 전용) -----
  // 앱 헤더 kebab "목록 편집"이 진입시키므로 페이지가 상태를 소유하고 콘텐츠에 내려줌
  const [reorderMode, setReorderMode] = useState<boolean>(false);

  // 순서 변경 일괄 저장: reorder 모드 진입 후 첫 변경 시점의 상태를 롤백용으로 보관
  const reorderSnapshotRef = useRef<{
    plans: PlanRegistResDTO[];
    schedule: ScheduleRegistResDTO;
  } | null>(null);
  const [reorderDirty, setReorderDirty] = useState(false);
  // 순서 변경 세션 기준값: 첫 블록 시작(anchor) + 위치별 공백(idle)
  const reorderMetaRef = useRef<{ anchor: number; gaps: number[] } | null>(null);
  // 빠른 재정렬-완료-재정렬 시, 늦게 실패한 이전 커밋의 stale 롤백을 무시하기 위한 토큰
  const reorderCommitTokenRef = useRef(0);

  // reorder 중: 로컬만 재정렬 + 시간 재계산(PUT 안 함). 첫 변경 시 롤백용 스냅샷 저장.
  // 각 블록 진행시간(종료−시작) 유지, anchor부터 순서대로 재부여, 위치별 공백 보존.
  const handleReorder = (from: number, to: number) => {
    if (!scheduleResult || from === to) return;
    if (!reorderDirty) {
      reorderSnapshotRef.current = { plans: planList, schedule: scheduleResult };
      // 원본 기준: 첫 블록 시작(anchor) + 위치별 공백(idle) 캡처
      reorderMetaRef.current = {
        anchor: toMin(planList[0]?.startTime ?? "00:00"),
        gaps: planList
          .slice(0, -1)
          .map((p, i) =>
            Math.max(0, toMin(planList[i + 1].startTime) - toMin(p.endTime))
          ),
      };
      setReorderDirty(true);
    }
    const meta = reorderMetaRef.current;
    const moved = arrayMove(planList, from, to);
    let cursor = meta?.anchor ?? toMin(moved[0]?.startTime ?? "00:00");
    const reflowed = moved.map((p, i) => {
      const dur = Math.max(0, toMin(p.endTime) - toMin(p.startTime));
      const start = cursor;
      const end = cursor + dur;
      cursor = end + (meta?.gaps[i] ?? 0); // 다음 블록 시작 = 종료 + 위치별 공백
      return { ...p, startTime: toHHMM(start), endTime: toHHMM(end) };
    });
    setPlanList(reflowed);
    setScheduleResult({ ...scheduleResult, planRegistResDTOList: reflowed });
  };

  // "완료": 변경분 있으면 한 번만 PUT. 실패 시 스냅샷으로 롤백.
  const handleReorderCommit = () => {
    if (!reorderDirty || !scheduleResult) {
      setReorderDirty(false);
      return;
    }
    const snapshot = reorderSnapshotRef.current;
    const myToken = ++reorderCommitTokenRef.current;
    updateMutation.mutate(scheduleResult, {
      onError: () => {
        // 더 최신 재정렬 커밋이 이미 시작됐으면 이 롤백은 stale이므로 무시
        if (myToken !== reorderCommitTokenRef.current) return;
        if (snapshot) {
          setPlanList(snapshot.plans);
          setScheduleResult(snapshot.schedule);
        }
      },
    });
    setReorderDirty(false);
    reorderSnapshotRef.current = null;
    reorderMetaRef.current = null;
  };

  // 콘텐츠 하단 "완료" 탭 — 순서 변경 모드 종료 + 누적 변경분 일괄 저장
  const handleExitReorder = () => {
    setReorderMode(false);
    handleReorderCommit();
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

  // ----- 계획 추가 (add) : 기존 편집 모달/검색/서브모달 재사용, onClose에서 append -----
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // 서버 상태 변경(추가 등) 후 상세를 다시 불러와 로컬 계획을 서버 데이터로 동기화.
  // 신규 계획이 서버 planNum을 부여받아 이후 메모 커밋/수정/삭제가 정상 동작하게 함.
  const reloadPlansFromServer = async () => {
    if (!scheduleNum || Number.isNaN(scheduleNum)) return;
    try {
      const res = await getScheduleDetail(scheduleNum);
      if (res.code !== "S202") return;
      const convertedPlans = res.data.planDetailVOList.map(toCommonPlan);
      setPlanList(convertedPlans);
      setScheduleResult((prev) =>
        prev ? { ...prev, planRegistResDTOList: convertedPlans } : prev
      );
      // 서버 메모를 로컬 노트로 복원 (planNum 확보 후) — 기존 입력값은 보존
      setPlanNotes((prev) => {
        const next: PlanNoteMap = { ...prev };
        convertedPlans.forEach((p) => {
          if (
            p.planNum != null &&
            p.planMemo != null &&
            next[p.planNum] == null
          ) {
            next[p.planNum] = p.planMemo;
          }
        });
        return next;
      });
    } catch {
      // 조용히 실패 — 옵티미스틱 상태 유지 (다음 상호작용/새로고침 때 재동기화)
    }
  };

  const handleRequestAdd = () => {
    const lastEnd = planList[planList.length - 1]?.endTime || "09:00";
    // 새 계획 기본값: 이전 계획 종료 시각부터 1시간 (블록 기본 용량)
    const [h, m] = lastEnd.split(":").map(Number);
    const endTotal = Math.min(h * 60 + m + 60, 23 * 60 + 59);
    const defaultEnd = `${String(Math.floor(endTotal / 60)).padStart(2, "0")}:${String(endTotal % 60).padStart(2, "0")}`;
    setDraft({
      planNum: 0, // add 모드에선 미사용 (append 시 planNum 없이 신규 생성)
      plan: { planNm: "", startTime: lastEnd, endTime: defaultEnd },
      place: { placeNum: null, placeNm: "", address: "", placeUrl: "" },
    });
    setIsAddModalOpen(true);
  };

  const handleAddClose = () => {
    const draft = editDraft;
    const name = draft?.plan.planNm.trim() ?? "";
    if (draft && name && scheduleResult) {
      const newPlan: PlanRegistResDTO = {
        // 사용자 추가 계획 — 서버 update 예시(2026-07-08)대로: isUserAdded:"Y"로
        // 아이템 조회 스킵. itemNum/categoryNum/planNum은 보내지 않음(신규 insert).
        planSource: draft.place.placeUrl ? "USER_PLACE" : "USER_CUSTOM",
        isUserAdded: "Y",
        planNm: name,
        startTime: draft.plan.startTime,
        endTime: draft.plan.endTime,
        // 장소(카카오): URL + 주소. USER_CUSTOM은 없음.
        planLink: draft.place.placeUrl || undefined,
        planAddress: draft.place.address || undefined,
      };
      const prevPlans = planList;
      const prevSchedule = scheduleResult;
      const updatedPlans = [...planList, newPlan];
      const updatedSchedule = {
        ...scheduleResult,
        planRegistResDTOList: updatedPlans,
      };
      setPlanList(updatedPlans);
      setScheduleResult(updatedSchedule);
      updateMutation.mutate(updatedSchedule, {
        onSuccess: () => {
          // 서버에서 새 planNum을 받아오도록 상세 재조회 (신규 계획 메모 커밋 정상화)
          reloadPlansFromServer();
        },
        onError: () => {
          setPlanList(prevPlans);
          setScheduleResult(prevSchedule);
        },
      });
    }
    setIsAddModalOpen(false);
    clearDraft();
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

  // ----- 일정 다시 만들기 (재생성) -----
  // 체크(유지)된 계획은 USER_PLACE로 고정하고, 나머지는 AI 슬롯으로 재추천 요청
  const isRegeneratingRef = useRef(false);
  // 재생성 중 표시 상태 — 오버레이/로딩(터치 차단)은 유지하고, 재추천 슬롯에만 스켈레톤 표시
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (isRegeneratingRef.current) return;
    isRegeneratingRef.current = true;
    setIsRegenerating(true);
    // 오버레이 로딩으로 다른 영역 터치 차단 (반투명이라 아래 스켈레톤은 비쳐 보임)
    showLoading("AI가 일정을 다시 생성하고 있어요");
    try {
      const req = buildRequest();
      req.scheduleNm = scheduleName || req.scheduleNm;
      req.planRegistReqDTOList = planList.flatMap((p, i) => {
        const isUserMade =
          p.planSource === "USER_PLACE" || p.planSource === "USER_CUSTOM";
        // 사용자가 만든 계획은 항상 유지, AI 계획은 체크 시 유지
        const keep = isUserMade || keptIndexes.has(i);
        if (!keep) return [toAIReq(p)]; // 미체크 AI → 재추천
        // 유지 계획인데 이름·지역이 모두 비면(비정상) placeName 빈 문자열 전송을 막기 위해 제외
        const hasName = !!(p.planNm?.trim() || p.regionNm?.trim());
        if (!hasName) return [];
        if (p.planSource === "USER_CUSTOM") return [toUserCustomReq(p)];
        return [toUserPlaceReq(p)]; // USER_PLACE 또는 체크된 AI → 장소 고정
      });
      const res = await createSchedule(req);
      if (res.code !== "S201") {
        toast(res.message ?? "일정 재생성에 실패했습니다.");
        return;
      }
      const nextPlans = res.data?.planRegistResDTOList ?? [];
      setScheduleResult(res.data);
      setPlanList(nextPlans);
      // 재생성 후 체크 초기화 (유지 여부는 planSource로 판별하므로 수동 체크 불필요)
      setKeptIndexes(new Set());
    } catch (err) {
      if (err instanceof AxiosError) {
        toast(err.response?.data?.message ?? "일정 재생성에 실패했습니다.");
      } else if (err instanceof Error) {
        toast(err.message);
      } else {
        toast("일정 재생성에 실패했습니다.\n다시 시도해주세요");
      }
    } finally {
      isRegeneratingRef.current = false;
      setIsRegenerating(false);
      hideLoading();
    }
  };

  // ----- 로딩 중 -----
  if (isCreate && isLoading) {
    return <SkeletonScheduleRoutesContent />;
  }

  if (isDetail && isDetailLoading) {
    return (
      <div className="flex flex-col w-full h-full bg-gray-5">
        <div className="bg-gray-white">
          <BackHeader onClick={() => navigate(-1)} />
        </div>
        <SkeletonScheduleRoutesContent />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-gray-5">
      <CreateScheduleModal
        isConfirmOpen={isCreateModalOpen}
        onConfirmCancel={handleCloseCreateModal}
        onConfirmConfirm={handleSaveSchedule}
      />

      {editDraft && !isAddModalOpen && (
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
                // 메모: 입력값과 원본을 빈 문자열 기준으로 비교 (지움도 변경으로 인식)
                const nextMemo = planNotes[editDraft.planNum] ?? "";
                const memoChanged =
                  !!originalPlan && nextMemo !== (originalPlan.planMemo ?? "");
                const hasChanged =
                  !!originalPlan &&
                  (editDraft.plan.planNm !== (originalPlan.planNm ?? "") ||
                    editDraft.plan.startTime !== originalPlan.startTime ||
                    editDraft.plan.endTime !== originalPlan.endTime ||
                    editDraft.place.placeNm !== (originalPlan.regionNm ?? "") ||
                    editDraft.place.placeUrl !==
                      (originalPlan.planLink ?? "") ||
                    editDraft.place.address !==
                      (originalPlan.planAddress ?? originalPlan.regionNm ?? "") ||
                    memoChanged);

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
                          planLink: editDraft.place.placeUrl,
                          planAddress: editDraft.place.address,
                          // 지운 경우 ""로 전송해 서버가 메모 없음을 명확히 인식하도록 함
                          planMemo: nextMemo,
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

      {editDraft && isAddModalOpen && (
        <PlanFormModal
          action={{
            isOpen: isAddModalOpen,
            onClose: handleAddClose,
            onConfirm: () => {},
            onClickEditTitle: handleEditTitleClick,
          }}
          info={{
            mode: "UserCustom",
            planNum: editDraft.planNum,
            planNm: editDraft.plan.planNm || undefined,
            startTime: editDraft.plan.startTime,
            endTime: editDraft.plan.endTime,
            address: editDraft.place.address,
            onClickAddress: () => navigate("search"),
            onClickTime: handleTimeClick,
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

      <DeleteScheduleModal
        isOpen={isDeleteScheduleModalOpen}
        onClickCancel={() => setIsDeleteScheduleModalOpen(false)}
        onClickConfirm={handleConfirmDeleteSchedule}
      />

      <ScheduleInfoBottomSheet
        isOpen={isInfoSheetOpen}
        initialName={scheduleName}
        initialMemo={scheduleMemo}
        onClose={() => setIsInfoSheetOpen(false)}
        onSave={handleSaveInfo}
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
            onRegenerate: handleRegenerate,
            keptCount: planList.filter(
              (p, i) =>
                p.planSource === "USER_PLACE" ||
                p.planSource === "USER_CUSTOM" ||
                keptIndexes.has(i)
            ).length,
          }}
          keptIndexes={keptIndexes}
          onToggleKept={toggleKept}
          isRegenerating={isRegenerating}
        />
      )}
      {isDetail && (
        <div className="bg-gray-white">
          <BackHeader onClick={() => navigate(-1)}>
            <div className="flex w-full justify-end">
              <ScheduleDetailMenu
                onEnterReorder={() => setReorderMode(true)}
                onDeleteSchedule={() => setIsDeleteScheduleModalOpen(true)}
              />
            </div>
          </BackHeader>
        </div>
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
          onAddPlan={handleRequestAdd}
          notes={planNotes}
          onChangeNote={handleChangeNote}
          onCommitNote={handleCommitNote}
          onReorder={handleReorder}
          reorderMode={reorderMode}
          onExitReorder={handleExitReorder}
          onOpenInfoSheet={() => setIsInfoSheetOpen(true)}
          scheduleMemo={scheduleMemo}
        />
      )}
      <Outlet context={{ onPlaceSelect: handlePlaceSelect }} />
    </div>
  );
};

export default ScheduleRoutesPage;
