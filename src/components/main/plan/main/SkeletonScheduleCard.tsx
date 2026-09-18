import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

/**
 * ScheduleCard 스켈레톤
 *
 * 실제 카드 구조를 그대로 따라간다(실측 96px 기준):
 *  - 바깥: rounded-xl 테두리 + px-3 pt-4 pb-3.5, 내부 gap-3
 *  - 헤더: 왼쪽에 날짜 줄(16px) + 일정명 줄, 오른쪽에 삭제 버튼 24px
 *  - 마지막 빈 div 는 태그 자리(실제 카드도 태그가 없으면 빈 div 를 둔다)
 *
 * 단색 블록 하나로 깔면 높이는 맞아도 형태가 달라 전환이 눈에 띈다.
 *
 * 테두리는 실제 카드의 border-gray-black 대신 gray-20 을 쓴다. 두께는 같아서
 * 높이에 영향이 없고, 검은 테두리를 두르면 로딩 자리가 완성된 카드처럼 보인다.
 *
 * 태그가 붙은 카드는 124px 로 늘어나지만 로딩 시점에는 몇 개가 태그를 갖는지 알 수 없어
 * 태그 없는 기본 높이에 맞춘다.
 */
const SkeletonScheduleCard = () => {
  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-20 bg-gray-white px-3 pt-4 pb-3.5">
      <div className="flex w-full items-start justify-between pl-2">
        <div className="flex flex-col gap-2">
          {/* 날짜 */}
          <SkeletonBlock width="w-20" height="h-4" />
          {/* 일정명 */}
          <SkeletonBlock width="w-24" height="h-7" />
        </div>
        {/* 삭제 버튼 */}
        <SkeletonBlock width="w-6" height="h-6" rounded="rounded-full" />
      </div>
      {/* 태그 자리 */}
      <div />
    </div>
  );
};

export default SkeletonScheduleCard;
