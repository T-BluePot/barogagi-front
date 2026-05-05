import SkeletonBlock from "@/components/common/SkeletonBlock";

/**
 * Calendar 스켈레톤
 * - 상단 헤더(년/월) + 7x4 그리드 원형으로 달력 형태 표현
 */
const SkeletonCalendar = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* 상단 년/월 헤더 */}
      <SkeletonBlock width="w-28" height="h-5" rounded="rounded-sm" className="mx-auto" />
      {/* 7x4 = 28개 원형 그리드 */}
      <div className="grid grid-cols-7 gap-3 px-2">
        {Array.from({ length: 28 }).map((_, idx) => (
          <SkeletonBlock
            key={idx}
            width="w-8"
            height="h-8"
            rounded="rounded-full"
            className="mx-auto"
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonCalendar;
