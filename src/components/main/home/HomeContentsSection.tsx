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
      <div className="flex flex-col w-full mt-6">
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
