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

  // 인사 문구 결정용: 다가오는 일정 존재 여부 / 인기 지역명(1순위)
  const hasUpcomingSchedule = scheduleData?.userInfoResponseDTO != null;
  const topRegion = popularRegions[0];
  const popularRegionName = topRegion
    ? topRegion.regionLevel4 ||
      topRegion.regionLevel3 ||
      topRegion.regionLevel2 ||
      topRegion.regionLevel1
    : undefined;

  return (
    <div className="flex flex-col h-full">
      <HomeGreetingSection
        userName={userData?.nickName}
        hasUpcomingSchedule={hasUpcomingSchedule}
        popularRegionName={popularRegionName}
        isLoading={isScheduleLoading || isRegionsLoading}
      />
      <HomeContentsSection
        popularTags={popularTags}
        isTagsLoading={isTagsLoading}
        popularRegions={popularRegions}
        isRegionsLoading={isRegionsLoading}
      />
    </div>
  );
};

export default HomePage;
