import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

interface SkeletonScheduleRoutesContentProps {
  /** 표시할 계획 카드 수. 마법봉 생성은 슬롯 수를 미리 알 수 있어 넘겨준다 */
  count?: number;
  /**
   * ScheduleRoutesContent 의 mode 와 1:1로 맞춘다.
   *  - create: 생성 직후 화면 (카드 88px, 메모 없음, 제목 옆 편집 버튼 있음)
   *  - detail: 저장된 일정 상세 (카드 135px, 메모 입력 줄 + 일정 메모 줄 포함)
   *  - share : 공유 링크 조회 (카드 88px, 조회 전용이라 편집 버튼 없음)
   *
   * 같은 카드처럼 보이지만 상세에는 메모 줄이 하나 더 있어 47px 더 높고,
   * 공유는 readOnly 라 제목 옆 28px 원형 버튼이 아예 없다.
   */
  variant?: "create" | "detail" | "share";
}

/**
 * ScheduleRoutesContent 스켈레톤
 *
 * 실제 화면 구조를 그대로 따라간다(실측 기준):
 *  - 흰 헤더 블록(p-6): 날짜 21px + 일정명 30px + 우측 원형 버튼 28px
 *    (detail 은 그 아래 일정 메모 줄이 하나 더 붙어 27px 높다)
 *  - 회색 목록(p-6, gap-4): 왼쪽 레일(w-11) + 카드(rounded-xl, px-5 pt-5 pb-4)
 *  - 카드 안: 장소명 21px + 지역 16px (+ detail 은 메모 줄 37px)
 *
 * 예전에는 헤더 없이 단색 100px 블록만 나열해서, 로딩이 끝나는 순간 흰 헤더가 생기며
 * 목록이 통째로 밀리고 덩어리가 글자로 바뀌어 형태까지 달라졌다.
 */
const SkeletonScheduleRoutesContent = ({
  count = 4,
  variant = "create",
}: SkeletonScheduleRoutesContentProps) => {
  const isDetail = variant === "detail";
  // 공유 화면은 조회 전용이라 제목 옆 편집 버튼이 없다
  const hasEditButton = variant !== "share";

  return (
    <div className="flex h-full w-full flex-col bg-gray-5">
      {/* 헤더 — ScheduleRouteInfoHeader 자리 */}
      <div className="flex w-full flex-col gap-2 bg-gray-white p-6">
        <div className="px-1">
          <SkeletonBlock width="w-[88px]" height="h-[21px]" />
        </div>
        <div className="flex items-center justify-between px-1">
          <SkeletonBlock width="w-[132px]" height="h-[30px]" />
          {hasEditButton && (
            <SkeletonBlock width="w-7" height="h-7" rounded="rounded-full" />
          )}
        </div>
        {/* 일정 메모 줄 — 상세에만 있다. 빠뜨리면 헤더가 27px 짧아 목록이 통째로 밀린다.
         * 실제 화면은 mt-2 를 주지만 여기는 부모 gap-2 가 이미 8px 을 만든다 */}
        {isDetail && (
          <div className="px-1">
            <SkeletonBlock width="w-[96px]" height="h-[19px]" />
          </div>
        )}
      </div>

      {/* 계획 목록 — PlanDetailCard 자리 */}
      <div className="flex w-full flex-1 flex-col gap-4 p-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex gap-3">
            {/* 왼쪽 타임라인 레일 (순번 배지 + 시간 + 점선) */}
            <div className="flex w-11 shrink-0 flex-col items-center gap-2 pt-1">
              <SkeletonBlock width="w-6" height="h-6" rounded="rounded-full" />
              <SkeletonBlock width="w-[37px]" height="h-[44px]" />
              <div className="w-px flex-1 border-l border-dashed border-gray-20" />
            </div>

            {/* 오른쪽 카드 — 높이는 실측값으로 고정한다.
             * 안쪽 줄 높이를 합산해서 맞추려 하면 실제 카드의 items-baseline 때문에
             * 몇 px 씩 어긋난다. 바깥 치수를 고정해야 전환할 때 목록이 안 밀린다. */}
            <div
              className={`flex min-w-0 flex-1 flex-col gap-4 rounded-xl bg-gray-white px-5 pt-5 pb-4 shadow-md ${
                isDetail ? "h-[135px]" : "h-[88px]"
              }`}
            >
              <div className="flex flex-col gap-2">
                {/* 장소명 */}
                <SkeletonBlock width="w-32" height="h-[21px]" />
                {/* 지역 */}
                <SkeletonBlock width="w-16" height="h-4" />
              </div>
              {/* 메모 입력 줄 (상세 전용) */}
              {isDetail && (
                <SkeletonBlock
                  width="w-full"
                  height="h-[37px]"
                  rounded="rounded-lg"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonScheduleRoutesContent;
