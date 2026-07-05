import type React from "react";
import HeroCourseCard from "./HeroCourseCard";
import HotPlaceSection from "./contents/HotPlaceSection";
import TrendingScheduleSection from "./contents/TrendingScheduleSection";
import MyScheduleSection from "./contents/MyScheduleSection";
import type { TagInfoDTO, PopularRegionDTO } from "@/api/types";

type Props = {
  popularTags: TagInfoDTO[];
  isTagsLoading: boolean;
  popularRegions: PopularRegionDTO[];
  isRegionsLoading: boolean;
};

const HomeContentsSection: React.FC<Props> = ({
  popularTags,
  isTagsLoading,
  popularRegions,
  isRegionsLoading,
}) => {
  return (
    <div className="flex flex-1 flex-col w-full px-5.5 items-baseline bg-gray-white overflow-x-hidden">
      {/* AI 일정 생성 히어로 카드 (지역 선택 포함) */}
      <HeroCourseCard regions={popularRegions} />
      {/* 섹션 간 간격은 레퍼런스 리듬(18px)으로 부모 gap에서 일괄 관리 */}
      <div className="mt-5 flex w-full flex-col gap-4.5">
        <HotPlaceSection regions={popularRegions} isLoading={isRegionsLoading} />
        {/* 나의 일정: 자체적으로 일정 목록 조회 (plan 탭과 캐시 공유) */}
        <MyScheduleSection />
        <TrendingScheduleSection tags={popularTags} isLoading={isTagsLoading} />
      </div>
    </div>
  );
};

export default HomeContentsSection;
