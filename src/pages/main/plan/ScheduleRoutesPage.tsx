import { useEffect, useState } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";

import type { ScheduleRoutesPageProps } from "@/types/main/plan/scheduleRoutes";
import type { PlanNoteMap } from "@/types/main/plan/bottom-modal/planFromTypes";
import {
  findScheduleByNum,
  filterPlansByScheduleNum,
  findPlanByNum,
} from "@/utils/main/plan/filterList";
import { usePlanEditStore } from "@/stores/planEditStore";

import ScheduleRoutesContent from "@/components/main/plan/route/ScheduleRoutesContent";

import { CreateScheduleModal } from "@/components/main/plan/create/CreateScheduleModal";
import PlanFormModal from "@/components/main/plan/common/modal/PlanFormModal";
import DeletePlanModal from "@/components/main/plan/create/DeletePlanModal";

import { mockSchedules } from "@/mock/schedules";
import { mockPlans } from "@/mock/plans"; // 추후 실제 데이터로 변경

const ScheduleRoutesPage = ({ variant }: ScheduleRoutesPageProps) => {
  const navigate = useNavigate();

  // --- 넘어온 화면 확인용
  const isCreate = variant === "create";
  const isDetail = variant === "detail";

  const { id } = useParams<{ id: string }>(); // /plan/:id/detail 에서 사용
  // 내 일정 페이지에서 넘어온 num 기반 필터된 plan 리스트

  // ----- 헤더 영역 -----
  const [scheduleName, setScheduleName] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());

  const scheduleNum = id ? Number(id) : undefined;

  // ----- 현재 페이지에서 사용할 plan 리스트: scheduleNum 기준 필터 -----
  const plansForPage = filterPlansByScheduleNum(
    isDetail,
    mockPlans,
    scheduleNum
  );

  // ----- 일정 이름 / 날짜 초기 세팅 -----
  useEffect(() => {
    // create 모드: 기본값 세팅
    if (!isDetail) {
      setScheduleName("오늘의 일정");
      setScheduleDate(new Date());
      return;
    }

    // detail 모드인데 id가 없는 경우: 방어 코드
    if (!scheduleNum || Number.isNaN(scheduleNum)) {
      setScheduleName("오늘의 일정");
      setScheduleDate(new Date());
      return;
    }

    // mockSchedules 에서 현재 schedule 찾기
    const currentSchedule = findScheduleByNum(mockSchedules, scheduleNum);

    if (!currentSchedule) {
      // 해당 schedule 이 없으면 기본값 사용
      setScheduleName("오늘의 일정");
      setScheduleDate(new Date());
      return;
    }

    // 찾은 schedule 기반으로 이름 / 날짜 세팅
    setScheduleName(currentSchedule.scheduleNm);

    // startDate 를 Date 객체로 변환 (예: "2025-01-02")
    setScheduleDate(new Date(currentSchedule.startDate));
  }, [isDetail, scheduleNum]);

  // ----- 일정 list 영역 -----

  // ----- 일정 삭제하기 modal -----
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [deletePlanNum, setDeletePlanNum] = useState<number | null>(null); // 삭제할 일정 num

  const handleRequestDelete = (planNum: number) => {
    setDeletePlanNum(planNum);
    setIsDeleteModalOpen(true);
  };

  // ----- 일정 수정하기 bottom modal -----
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const { draft: editDraft, setDraft } = usePlanEditStore();

  const handleRequestEdit = (planNum: number) => {
    const target = findPlanByNum(plansForPage, planNum);
    if (!target) return;

    // 서버에서 받은 원본 데이터를 기반으로 "초기 드래프트" 생성
    setDraft({
      planNum: target.plan.planNum, // 대표 식별자 (PK)

      // Plan 섹션
      plan: {
        planNm: target.plan.planNm,
        startTime: target.plan.startTime,
        endTime: target.plan.endTime,
      },

      // Place 섹션
      place: {
        placeNum: target.place.placeNum, // FK
        placeNm: target.place.regionNm, // UI 표시용 장소명
        address: target.place.address, // UI 표시용 주소
      },

      // Tags 섹션 필요 시 아래 활성화
      // tags: {
      //   selectedTagNums: target.tags.map(t => t.tagNum),
      // },
    });

    setIsEditModalOpen(true);
  };

  // 컴포넌트 내부에서 사용할 메모 저장 변수
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

  return (
    <div className="flex flex-col w-full h-full bg-gray-5">
      {/* 일정 생성 모달 */}
      <CreateScheduleModal
        isConfirmOpen={isCreateModalOpen}
        onConfirmCancel={handleCloseCreateModal}
        onConfirmConfirm={() => {
          // 일정 생성 API 호출
          handleCloseCreateModal();
          navigate("/plan");
        }}
      />
      {/* 팝메뉴- 일정 수정 및 삭제 모달 */}

      {editDraft && (
        <PlanFormModal
          action={{
            isOpen: isEditModalOpen,
            onClose: () => {
              // 서버 연동 시 변경사항 저장 로직 추가
              setIsEditModalOpen(false);
            },
            onConfirm: () => {},
            onClickEditTitle: () => {},
          }}
          info={{
            mode: "Edit",
            // --- 일정 기본 정보 ---
            planNum: editDraft.planNum,
            planNm: editDraft.plan.planNm,
            startTime: editDraft.plan.startTime,
            endTime: editDraft.plan.endTime,
            address: editDraft.place.address,
            onClickAddress: () => navigate("search"),
            onClickTime: () => {},
            // --- 일정 노트 아이템 관련 ---
            note: planNotes[editDraft.planNum],
            noteValue: planNotes[editDraft.planNum] ?? "",
            onChangeNote: (next: string) =>
              handleChangeNote(editDraft.planNum, next),
          }}
        />
      )}
      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClickCancel={() => setIsDeleteModalOpen(false)}
        onClickConfirm={() => {
          // 추후 서버 연결 시 deletePlanNum를 넘겨 삭제하는 로직 추가
          setIsDeleteModalOpen(false);
        }}
      />
      {/* 공통 콘텐츠 영역 */}
      {isCreate && (
        <ScheduleRoutesContent
          header={{
            scheduleDate,
            scheduleName,
            onChangeScheduleName: setScheduleName,
          }}
          plans={plansForPage}
          // isEditable false → create 모드로 동작
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
          plans={plansForPage}
          // isEditable true → detail 모드로 동작: popMenu 연동
          isEditable={isDetail}
          onRequestEdit={handleRequestEdit}
          onRequestDelete={handleRequestDelete}
        />
      )}
      {/* 자식 검색 라우트 */}
      <Outlet />
    </div>
  );
};

export default ScheduleRoutesPage;
