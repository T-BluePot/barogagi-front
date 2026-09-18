import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

/**
 * Calendar(react-datepicker) 스켈레톤
 *
 * 실제 달력 치수를 따라간다(실측 기준):
 *  - 년/월 헤더 블록 65px
 *  - 요일 이름 행 48px (셀 자체는 27px 이지만 행 여백까지 48px)
 *  - 주 행 67px x 5주 (날짜 칸은 54x62)
 *
 * 예전에는 요일 행 없이 4주 x 32px 원만 깔아서 실제 달력보다 한참 짧았다.
 * 로딩이 끝나면 아래 목록이 통째로 밀려 내려갔다.
 *
 * 5주로 고정한 이유: 달에 따라 4~6주로 달라지는데 로딩 시점에는 알 수 없다.
 * 가장 흔한 5주에 맞춘다.
 */
const SkeletonCalendar = () => {
  return (
    <div className="flex w-full flex-col">
      {/* 년/월 헤더 */}
      <div className="flex h-[65px] items-center justify-center">
        <SkeletonBlock width="w-28" height="h-[21px]" />
      </div>

      {/* 요일 이름 */}
      <div className="grid grid-cols-7">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div key={idx} className="flex h-[48px] items-center justify-center">
            <SkeletonBlock width="w-5" height="h-3" />
          </div>
        ))}
      </div>

      {/* 날짜 칸 */}
      <div className="grid grid-cols-7">
        {Array.from({ length: 35 }).map((_, idx) => (
          <div key={idx} className="flex h-[67px] items-center justify-center">
            <SkeletonBlock width="w-8" height="h-8" rounded="rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonCalendar;
