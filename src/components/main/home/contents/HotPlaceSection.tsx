import type React from "react";

import SectionHeader from "@/components/common/SectionHeader";
import EmptyContent from "@/components/common/EmptyContent";
import HotPlaceCard, { type HotPlaceData } from "./HotPlaceCard";
import SkeletonHotPlaceCarousel from "./SkeletonHotPlaceCarousel";
import type { PopularRegionDTO } from "@/api/types";

interface Props {
  regions: PopularRegionDTO[];
  isLoading: boolean;
}

/** API 응답 → HotPlaceCard 데이터 변환 */
const toHotPlace = (region: PopularRegionDTO): HotPlaceData => {
  const name =
    region.regionLevel4 ||
    region.regionLevel3 ||
    region.regionLevel2 ||
    region.regionLevel1;
  return {
    rank: region.rankNo,
    name,
    // 이름과 같은 값이면 (level1만 있는 지역) 중복 표기 생략
    area: region.regionLevel1 !== name ? region.regionLevel1 : undefined,
  };
};

/** 오늘의 핫플레이스 — 가로 스크롤 캐러셀 (화면 밖으로 블리드) */
const HotPlaceSection: React.FC<Props> = ({ regions, isLoading }) => {
  const places = regions.map(toHotPlace);

  const renderContent = () => {
    if (isLoading) return <SkeletonHotPlaceCarousel />;
    if (places.length === 0)
      return <EmptyContent message="인기 지역 정보가 없습니다." />;

    return (
      <div className="hide-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6">
        {places.map((place) => (
          <HotPlaceCard key={`${place.rank}-${place.name}`} place={place} />
        ))}
      </div>
    );
  };

  return (
    <section className="mb-8 w-full">
      <SectionHeader title="오늘의 핫플레이스" />
      {renderContent()}
    </section>
  );
};

export default HotPlaceSection;
