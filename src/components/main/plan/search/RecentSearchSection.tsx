import RecentSearchHeader from "./RecentSearchHeader";
import LocationListItem from "./LocationListItem";

import type { location } from "@/mock/locations";

interface RecentSearchSectionProps {
  onClickClear: () => void; // 최근 검색어 비우기
  recentLocations: location[]; // 최근 추가한 장소 (최대 10개, 로컬에서 저장)
  onClickAddLocation: () => void; // 장소 추가
}

const RecentSearchSection = ({
  onClickClear,
  recentLocations,
  onClickAddLocation,
}: RecentSearchSectionProps) => {
  const hasRecentLocations = recentLocations && recentLocations.length !== 0;
  return (
    <div className="flex flex-col h-full overflow-auto">
      <RecentSearchHeader onclick={onClickClear} />
      {hasRecentLocations && (
        <div className="flex flex-col w-full h-full overflow-y-auto hide-scrollbar">
          {recentLocations.map((loc, idx) => (
            <div key={idx}>
              <LocationListItem
                locationNm={loc.locationNm}
                locationAdress={loc.locationAddress}
                onClick={onClickAddLocation}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSearchSection;
