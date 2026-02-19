import { useQuery } from "@tanstack/react-query";
import HomeContentsSection from "@/components/main/home/HomeContentsSection";
import HomeGreetingSection from "@/components/main/home/HomeGreetingSection";
import {
  getMySchedulesSummary,
  getPopularTags,
  getPopularRegions,
} from "@/api/queries";
import { homeKeys } from "@/api/keyFactories";
import type { TagInfoDTO, PopularRegionDTO } from "@/api/types";

const HomePage = () => {
  const { data: scheduleData, isLoading: isScheduleLoading } = useQuery({
    queryKey: homeKeys.mySchedules(),
    queryFn: getMySchedulesSummary,
  });

  const { data: tagsData, isLoading: isTagsLoading } = useQuery({
    queryKey: homeKeys.popularTags(),
    queryFn: getPopularTags,
  });

  const { data: regionsData, isLoading: isRegionsLoading } = useQuery({
    queryKey: homeKeys.popularRegions(),
    queryFn: getPopularRegions,
  });

  const popularTags: TagInfoDTO[] = tagsData?.tagInfoList ?? [];
  const popularRegions: PopularRegionDTO[] = Array.isArray(regionsData?.data)
    ? regionsData.data
    : [];

  return (
    <div className="flex flex-col h-full">
      <HomeGreetingSection />
      <HomeContentsSection
        scheduleData={scheduleData ?? null}
        isScheduleLoading={isScheduleLoading}
        popularTags={popularTags}
        isTagsLoading={isTagsLoading}
        popularRegions={popularRegions}
        isRegionsLoading={isRegionsLoading}
      />
    </div>
  );
};

export default HomePage;
