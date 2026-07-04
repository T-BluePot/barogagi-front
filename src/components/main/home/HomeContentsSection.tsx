import type React from "react";
import HeroCourseCard from "./HeroCourseCard";
import HotPlaceSection from "./contents/HotPlaceSection";
import TrendingScheduleSection from "./contents/TrendingScheduleSection";
import UpcomingScheduleSection from "./contents/UpcomingScheduleSection";
import type {
  HomeScheduleResponseDTO,
  TagInfoDTO,
  PopularRegionDTO,
} from "@/api/types";

type Props = {
  scheduleData: HomeScheduleResponseDTO | null;
  isScheduleLoading: boolean;
  popularTags: TagInfoDTO[];
  isTagsLoading: boolean;
  popularRegions: PopularRegionDTO[];
  isRegionsLoading: boolean;
};

const HomeContentsSection: React.FC<Props> = ({
  scheduleData,
  isScheduleLoading,
  popularTags,
  isTagsLoading,
  popularRegions,
  isRegionsLoading,
}) => {
  return (
    <div className="flex flex-1 flex-col w-full px-6 items-baseline bg-gray-white overflow-x-hidden">
      {/* AI 일정 생성 히어로 카드 (지역 선택 포함) */}
      <HeroCourseCard regions={popularRegions} />
      <div className="flex flex-col w-full mt-5">
        <HotPlaceSection
          regions={popularRegions}
          isLoading={isRegionsLoading}
        />
        <UpcomingScheduleSection
          scheduleData={scheduleData}
          isLoading={isScheduleLoading}
        />
        <TrendingScheduleSection tags={popularTags} isLoading={isTagsLoading} />
      </div>
    </div>
  );
};

export default HomeContentsSection;
