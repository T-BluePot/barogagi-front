import type React from "react";

import SectionHeader from "@/components/common/SectionHeader";
import Chip from "@/components/common/Chip";
import EmptyContent from "@/components/common/EmptyContent";
import SkeletonBlock from "@/components/common/loading/SkeletonBlock";
import type { TagInfoDTO } from "@/api/types";

interface Props {
  tags: TagInfoDTO[];
  isLoading: boolean;
}

/** 지금 인기 있는 태그 — 칩 가로 스크롤 */
const TrendingScheduleSection: React.FC<Props> = ({ tags, isLoading }) => {
  const renderContent = () => {
    if (isLoading)
      return <SkeletonBlock width="w-full" height="h-8" rounded="rounded-full" />;
    if (tags.length === 0)
      return <EmptyContent message="인기 있는 일정이 없습니다." />;

    return (
      <div className="hide-scrollbar -mx-5.5 flex gap-2 overflow-x-auto px-5.5">
        {tags.map((tag) => (
          <Chip key={tag.tagNum} label={`# ${tag.tagNm}`} />
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
