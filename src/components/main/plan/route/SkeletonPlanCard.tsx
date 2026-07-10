import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

interface SkeletonPlanCardProps {
  index?: number;
  startTime?: string;
  endTime?: string;
}

/**
 * 재생성 중 "재추천되는 슬롯" 자리 표시 스켈레톤.
 * 시간대(레일: 순번·시작~종료)는 재생성 후에도 유지되므로 그대로 보여주고,
 * 바뀌는 카드 본문(장소·태그·이미지)만 스켈레톤 블록으로 대체한다.
 * 레일 마크업은 PlanDetailCard와 동일하게 맞춰 나열 시 어긋나지 않게 함.
 */
const SkeletonPlanCard = ({
  index,
  startTime,
  endTime,
}: SkeletonPlanCardProps) => {
  return (
    <article className="flex gap-3">
      {/* 왼쪽 타임라인 레일 */}
      <div className="flex w-11 shrink-0 flex-col items-center gap-2 pt-1">
        {index != null && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-main text-white typo-tag">
            {index + 1}
          </span>
        )}
        {startTime && (
          <div className="flex flex-col items-center gap-1">
            <span className="typo-caption text-gray-black tabular-nums">
              {startTime}
            </span>
            {endTime && (
              <>
                <span className="w-2 h-px bg-gray-20" />
                <span className="typo-tag text-gray-40 tabular-nums">
                  {endTime}
                </span>
              </>
            )}
          </div>
        )}
        <div className="w-px flex-1 border-l border-dashed border-gray-20" />
      </div>

      {/* 오른쪽 카드 본문 자리 — 스켈레톤 */}
      <div className="flex-1 min-w-0">
        <SkeletonBlock width="w-full" height="h-[100px]" rounded="rounded-xl" />
      </div>
    </article>
  );
};

export default SkeletonPlanCard;
