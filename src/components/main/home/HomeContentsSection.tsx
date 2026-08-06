import type React from "react";
import HeroCourseCard from "./HeroCourseCard";
import HotPlaceSection from "./contents/HotPlaceSection";
import TrendingScheduleSection from "./contents/TrendingScheduleSection";
import MyScheduleSection from "./contents/MyScheduleSection";
import type { TagInfoDTO, PopularRegionDTO, HotPlaceDTO } from "@/api/types";

type Props = {
  popularTags: TagInfoDTO[];
  isTagsLoading: boolean;
  /** 인기 지역(popular) — 히어로 카드의 지역 셀렉트가 계속 소비한다 */
  popularRegions: PopularRegionDTO[];
  /** 오늘의 핫플레이스(hot-place) — 캐러셀 전용 */
  hotPlaces: HotPlaceDTO[];
  isHotPlacesLoading: boolean;
};

const HomeContentsSection: React.FC<Props> = ({
  popularTags,
  isTagsLoading,
  popularRegions,
  hotPlaces,
  isHotPlacesLoading,
}) => {
  return (
    <div className="pb-tabbar flex flex-1 flex-col w-full px-5.5 items-baseline bg-gray-white overflow-x-hidden">
      {/* AI 일정 생성 히어로 카드 (지역 선택 포함) */}
      <HeroCourseCard regions={popularRegions} />
      {/* 섹션 간 간격은 레퍼런스 리듬(18px)으로 부모 gap에서 일괄 관리 */}
      <div className="mt-5 flex w-full flex-col gap-4.5">
        <HotPlaceSection places={hotPlaces} isLoading={isHotPlacesLoading} />
        <TrendingScheduleSection tags={popularTags} isLoading={isTagsLoading} />
        {/* 나의 일정: 목록이 아래로 늘어나므로 메인 최하단에 배치.
            자체적으로 일정 목록 조회 (plan 탭과 캐시 공유) */}
        <MyScheduleSection />
      </div>
    </div>
  );
};

export default HomeContentsSection;
