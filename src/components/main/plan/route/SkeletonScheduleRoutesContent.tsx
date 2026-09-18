import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

interface SkeletonScheduleRoutesContentProps {
  /** 표시할 계획 카드 수. 마법봉 생성은 슬롯 수를 미리 알 수 있어 넘겨준다 */
  count?: number;
}

/**
 * ScheduleRoutesContent 스켈레톤
 *
 * 실제 화면 구조를 그대로 따라간다(실측 기준):
 *  - 흰 헤더 블록(p-6): 날짜 21px + 일정명 30px + 우측 원형 버튼 28px
 *  - 회색 목록(p-6, gap-4): 왼쪽 레일(w-11) + 카드(h-88, rounded-xl)
 *
 * 예전에는 헤더 없이 100px 블록만 나열해서, 로딩이 끝나는 순간 흰 헤더가 생기며
 * 목록이 통째로 밀리고 카드도 레일 너비만큼 들여쓰기가 생겨 화면이 튀었다.
 */
const SkeletonScheduleRoutesContent = ({
  count = 4,
}: SkeletonScheduleRoutesContentProps) => {
  return (
    <div className="flex h-full w-full flex-col bg-gray-5">
      {/* 헤더 — ScheduleRouteInfoHeader 자리 */}
      <div className="flex w-full flex-col gap-2 bg-gray-white p-6">
        <div className="px-1">
          <SkeletonBlock width="w-[88px]" height="h-[21px]" />
        </div>
        <div className="flex items-center justify-between px-1">
          <SkeletonBlock width="w-[132px]" height="h-[30px]" />
          <SkeletonBlock width="w-7" height="h-7" rounded="rounded-full" />
        </div>
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

            <div className="min-w-0 flex-1">
              <SkeletonBlock
                width="w-full"
                height="h-[88px]"
                rounded="rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonScheduleRoutesContent;
