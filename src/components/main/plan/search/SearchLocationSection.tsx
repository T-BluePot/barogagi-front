import LocationListItem from "./LocationListItem";
import type { location } from "@/mock/locations";

interface SearchLocationSectionprops {
  searchLocations: location[]; // 검색된 장소 목록
  onClickAddLocation: () => void; // 장소 추가
}

const SearchLocationSection = ({
  searchLocations,
  onClickAddLocation,
}: SearchLocationSectionprops) => {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto hide-scrollbar">
      {searchLocations.map((loc, idx) => (
        <div key={idx}>
          <LocationListItem
            locationNm={loc.locationNm}
            locationAdress={loc.locationAddress}
            onClick={onClickAddLocation}
          />
        </div>
      ))}
    </div>
  );
};

export default SearchLocationSection;
