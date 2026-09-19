import type React from "react";

import SectionHeader from "@/components/common/SectionHeader";
import Chip from "@/components/common/Chip";
import EmptyContent from "@/components/common/EmptyContent";
import SkeletonBlock from "@/components/common/loading/SkeletonBlock";
import type { PopularTagDTO } from "@/api/types";

interface Props {
  tags: PopularTagDTO[];
  isLoading: boolean;
}

/**
 * 로딩 중 칩 자리 너비. 태그 길이가 제각각이라 같은 폭으로 깔면 부자연스럽다.
 * ⚠️ Tailwind 는 소스의 완성된 클래스 문자열만 스캔한다 — 템플릿 리터럴로 만들면 안 나온다.
 */
const SKELETON_CHIP_WIDTHS = ["w-16", "w-24", "w-20", "w-28", "w-14"] as const;

/** 지금 인기 있는 태그 — 칩 가로 스크롤 */
const TrendingScheduleSection: React.FC<Props> = ({ tags, isLoading }) => {
  const renderContent = () => {
    // 실제로는 pill 칩이 가로로 늘어선다(높이 28px). 통짜 막대 하나를 깔면
    // 로딩이 끝나는 순간 형태가 통째로 바뀌어 보인다.
    if (isLoading)
      return (
        <div className="hide-scrollbar -mx-5.5 flex gap-2 overflow-hidden px-5.5">
          {SKELETON_CHIP_WIDTHS.map((width, idx) => (
            <SkeletonBlock
              key={idx}
              width={width}
              height="h-7"
              rounded="rounded-full"
              className="shrink-0"
            />
          ))}
        </div>
      );
    if (tags.length === 0)
      return <EmptyContent message="인기 있는 태그가 없습니다." />;

    return (
      <div className="hide-scrollbar -mx-5.5 flex gap-2 overflow-x-auto px-5.5">
        {tags.map((tag) => (
          <Chip key={tag.rankNo} label={`# ${tag.tagNm}`} />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full">
      <SectionHeader title="지금 인기 있는 태그" />
      {renderContent()}
    </section>
  );
};

export default TrendingScheduleSection;
