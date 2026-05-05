import { useQuery } from "@tanstack/react-query";
import HomeContentsSection from "@/components/main/home/HomeContentsSection";
import HomeGreetingSection from "@/components/main/home/HomeGreetingSection";
import {
  getMySchedulesSummary,
  getPopularTags,
  getPopularRegions,
} from "@/api/queries";
import { getMe } from "@/api/queries/authQueries";
import { homeKeys } from "@/api/keyFactories";
import { authKeys } from "@/api/keyFactories";
import type { TagInfoDTO, PopularRegionDTO, BaseResponse } from "@/api/types";
import type { UserData } from "@/types/profileTypes";
import { useDebugStore } from "@/stores/debugStore"; // [임시] 디버그

const HomePage = () => {
  const { forceLoading } = useDebugStore(); // [임시] 디버그
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

  const { data: userResponse } = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
  });

  const userData = (userResponse as unknown as BaseResponse<UserData>)?.data;
  const popularTags: TagInfoDTO[] = tagsData?.tagInfoList ?? [];
  const popularRegions: PopularRegionDTO[] = Array.isArray(regionsData?.data)
    ? regionsData.data
    : [];

  return (
    <div className="flex flex-col h-full">
      <HomeGreetingSection userName={userData?.nickName} />
      <HomeContentsSection
        scheduleData={scheduleData ?? null}
        isScheduleLoading={forceLoading || isScheduleLoading}
        popularTags={popularTags}
        isTagsLoading={forceLoading || isTagsLoading}
        popularRegions={popularRegions}
        isRegionsLoading={forceLoading || isRegionsLoading}
      />
    </div>
  );
};

export default HomePage;
