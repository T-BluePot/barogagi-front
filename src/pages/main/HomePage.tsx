import { useQuery } from "@tanstack/react-query";
import HomeContentsSection from "@/components/main/home/HomeContentsSection";
import HomeGreetingSection from "@/components/main/home/HomeGreetingSection";
import {
  getMySchedulesSummary,
  getPopularTags,
  getPopularRegions,
} from "@/api/queries";
import { useHotPlacesQuery } from "@/hooks/queries/useHotPlacesQuery";
import { useMeQuery } from "@/hooks/queries/useMeQuery";
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

  const { user: userData, isPending: isMePending } = useMeQuery();

  // 오늘의 핫플레이스 — 위 popularRegions 와 병존한다.
  // popular 는 히어로 카드 지역 셀렉트·인사 문구가 계속 소비하므로 지우지 않는다.
  //
  // 회원 정보에 담긴 선호 지역을 기준으로 조회한다. 미설정이면 파라미터 없이 보내
  // 서버 기본값(서울 종로구)이 온다 — 기존 동작 그대로다.
  // getMe 가 끝나기 전에는 막는다(`enabled`). 안 그러면 기본값으로 한 번, 선호 지역으로
  // 또 한 번 요청이 나가고 종로 목록이 잠깐 스쳤다 바뀐다.
  const { hotPlaces, isLoading: isHotPlacesLoading } = useHotPlacesQuery({
    areaCd: userData?.areaCd,
    sigunguCd: userData?.sigunguCd,
    enabled: !isMePending,
  });
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
        hotPlaces={hotPlaces}
        // getMe 대기 중에는 핫플레이스 쿼리가 꺼져 있어 isLoading 이 false 다.
        // 그대로 넘기면 스켈레톤 대신 "인기 장소 정보가 없습니다"가 잠깐 스친다.
        isHotPlacesLoading={isMePending || isHotPlacesLoading}
      />
    </div>
  );
};

export default HomePage;
