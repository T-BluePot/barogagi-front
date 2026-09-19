import { useParams } from "react-router-dom";

import ScheduleRoutesContent from "@/components/main/plan/route/ScheduleRoutesContent";
import SkeletonScheduleRoutesContent from "@/components/main/plan/route/SkeletonScheduleRoutesContent";
import { useSharedScheduleQuery } from "@/hooks/queries/useSharedScheduleQuery";
import { toCommonPlan } from "@/utils/api/planMapper";
import { SHARED_VIEW_TEXT } from "@/constants/texts/main/share";
import { PLAY_STORE_URL } from "@/constants/externalLinks";
import { openExternal } from "@/utils/openExternal";

/** "2026-03-01" 또는 "2026-03-01 ~ 2026-03-03" */
const formatPeriod = (startDate: string, endDate: string) =>
  startDate === endDate ? startDate : `${startDate} ~ ${endDate}`;

/** 하단 설치 유도 CTA — 공유 링크로 들어온 미가입자 전환용 */
const InstallCta = () => (
  <div className="pb-safe bg-gray-white border-gray-10 shrink-0 border-t">
    <div className="flex items-center gap-2.5 px-5 py-3.5">
      {/* 앱 아이콘. 흰 배경 위에 흰 아이콘이라 경계가 안 잡히므로 옅은 그림자로 띄운다.
          alt 는 비운다 — 바로 옆에 브랜드명이 텍스트로 있어 읽어주면 중복이다. */}
      <img
        src="/favicon.png"
        alt=""
        aria-hidden
        className="shadow-raised h-11 w-11 shrink-0 rounded-xl"
      />
      <div className="min-w-0 flex-1">
        <p className="typo-subtitle text-gray-black">
          {SHARED_VIEW_TEXT.CTA_BRAND}
        </p>
        {/* break-keep — 없으면 한국어가 어절 중간에서 끊긴다 ("...볼까 / 요?").
            CSS 기본 word-break 는 한국어 어절 경계를 지켜주지 않는다. */}
        <p className="typo-caption text-gray-60 break-keep">
          {SHARED_VIEW_TEXT.CTA_QUESTION}
        </p>
      </div>
      <button
        type="button"
        onClick={() => openExternal(PLAY_STORE_URL)}
        className="bg-peach ease-fitpl typo-caption text-gray-white hover:bg-peach-hover active:bg-peach-active h-9 shrink-0 cursor-pointer rounded-full px-3.5 font-medium transition-colors duration-200"
      >
        {SHARED_VIEW_TEXT.CTA_BUTTON}
      </button>
    </div>
  </div>
);

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
    <span className="typo-title-02 text-gray-black">{title}</span>
    <span className="typo-caption text-gray-50">{description}</span>
  </div>
);

/**
 * 공유 링크로 진입하는 공개 페이지 (`/share/:shareToken`)
 *
 * - **비로그인 사용자가 대상이다.** 조회는 API-KEY만으로 통과한다(실측 확인).
 * - 이 경로는 `headerConfig.ts` 에 `{ type: "none" }` 으로 등록돼 있어야 한다.
 *   등록하지 않으면 MainLayout 이 기본값(common)으로 CommonHeader 를 그리고,
 *   그 헤더가 getMe() 를 호출해 401 → 인터셉터가 강제 로그아웃 → /auth/login 으로 튕긴다.
 * - 화면은 일정 상세와 같은 ScheduleRoutesContent 를 mode="share" 로 재사용한다.
 *   (편집·⋮메뉴·메모입력·순서변경·계획추가가 모두 빠진 조회 전용)
 */
const SharedSchedulePage = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { schedule, isLoading, isExpired, isError } =
    useSharedScheduleQuery(shareToken);

  if (isLoading) {
    return (
      <div className="bg-gray-5 h-dvh">
        <SkeletonScheduleRoutesContent />
      </div>
    );
  }

  // 만료·미존재(SS400)와 그 외 오류를 구분해 안내
  if (isExpired || isError || !schedule) {
    return (
      <div className="bg-gray-white flex h-dvh flex-col">
        <EmptyState
          title={
            isExpired
              ? SHARED_VIEW_TEXT.EMPTY_TITLE
              : SHARED_VIEW_TEXT.ERROR_TITLE
          }
          description={
            isExpired
              ? SHARED_VIEW_TEXT.EMPTY_DESCRIPTION
              : SHARED_VIEW_TEXT.ERROR_DESCRIPTION
          }
        />
        <InstallCta />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <div className="min-h-0 flex-1">
        <ScheduleRoutesContent
          mode="share"
          header={{
            scheduleDate: formatPeriod(schedule.startDate, schedule.endDate),
            scheduleName: schedule.scheduleNm,
          }}
          plans={schedule.planDetailVOList.map(toCommonPlan)}
        />
      </div>
      <InstallCta />
    </div>
  );
};

export default SharedSchedulePage;
