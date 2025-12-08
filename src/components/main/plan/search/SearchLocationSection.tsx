import LocationListItem from "./LocationListItem";
import type { location } from "@/mock/locations";

import EmptyStateSection from "../common/EmptyStateSection";

interface SearchLocationSectionprops {
  searchLocations: location[]; // 검색된 장소 목록
  onClickAddLocation: () => void; // 장소 추가
}

const SearchLocationSection = ({
  searchLocations,
  onClickAddLocation,
}: SearchLocationSectionprops) => {
  const isEmpty = searchLocations.length === 0;
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto hide-scrollbar">
      {isEmpty ? (
        <EmptyStateSection />
      ) : (
        <>
          {searchLocations.map((loc, idx) => (
            <div key={idx}>
              <LocationListItem
                locationNm={loc.locationNm}
                locationAdress={loc.locationAddress}
                addModalProps={{
                  handleConfirm: onClickAddLocation,
                }}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SearchLocationSection;
