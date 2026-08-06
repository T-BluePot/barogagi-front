import type React from "react";

import SectionHeader from "@/components/common/SectionHeader";
import EmptyContent from "@/components/common/EmptyContent";
import HotPlaceCard from "./HotPlaceCard";
import SkeletonHotPlaceCarousel from "./SkeletonHotPlaceCarousel";
import {
  formatBaseYm,
  formatHotPlaceRegion,
  hasUniformSigngu,
  sortByHubRank,
  toHotPlaceCardData,
} from "@/utils/api/homeMapper";
import type { HotPlaceDTO } from "@/api/types";

interface Props {
  places: HotPlaceDTO[];
  isLoading: boolean;
}

/**
 * 오늘의 핫플레이스 — 가로 스크롤 캐러셀 (화면 밖으로 블리드)
 *
 * 데이터 소스는 `home/regions/hot-place`(한국관광공사 월배치 데이터)다.
 * 월배치 스냅샷이라 **기준월 표기가 필수**다 — 표기 없이 "오늘"로만 노출하면 사용자가 오인한다.
 */
const HotPlaceSection: React.FC<Props> = ({ places, isLoading }) => {
  // 서버 순서에 의존하지 않고 명시적으로 정렬한다 (hubRank 는 string)
  const sorted = sortByHubRank(places);
  // 목록 지역이 전부 같으면 카드별 표기를 생략하고 캡션에서 한 번만 노출한다
  const isSingleRegion = hasUniformSigngu(sorted);

  // 헤더 메타: 값이 없으면 더미 문자열을 만들지 않고 표기 자체를 생략한다
  const baseYmLabel = sorted[0] ? formatBaseYm(sorted[0].baseYm) : undefined;
  const regionLabel =
    isSingleRegion && sorted[0] ? formatHotPlaceRegion(sorted[0]) : undefined;

  const renderContent = () => {
    if (isLoading) return <SkeletonHotPlaceCarousel />;
    if (sorted.length === 0)
      return <EmptyContent message="인기 장소 정보가 없습니다." />;

    return (
      <div className="hide-scrollbar -mx-5.5 flex gap-3 overflow-x-auto px-5.5 pt-0.5 pb-1">
        {sorted.map((place) => (
          <HotPlaceCard
            // hubTatsCd 는 실측 10건 전부 유니크. 없을 때만 순위+이름으로 폴백
            key={place.hubTatsCd || `${place.hubRank}-${place.hubTatsNm}`}
            place={toHotPlaceCardData(place, !isSingleRegion)}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full">
      {/* 지역과 기준월을 세로 구분선으로 나눈다.
          가운뎃점(·)으로 붙이면 둘이 한 덩어리로 읽혀서 기계가 만든 문자열처럼 보인다.

          데이터 출처(한국관광 데이터랩) 표기 의무는 기획·법무 확인 대기 —
          확정되면 캐러셀 아래에 덧붙인다. 지금 임의 문구를 넣지 않는다. */}
      <SectionHeader
        title="오늘의 핫플레이스"
        subtitle={
          (regionLabel || baseYmLabel) && (
            <span className="flex min-w-0 items-center gap-2">
              {regionLabel && <span className="truncate">{regionLabel}</span>}
              {regionLabel && baseYmLabel && (
                <span className="h-2.5 w-px shrink-0 bg-gray-20" />
              )}
              {baseYmLabel && (
                <span className="shrink-0">{baseYmLabel} 기준</span>
              )}
            </span>
          )
        }
      />
      {renderContent()}
    </section>
  );
};

export default HotPlaceSection;
