import LocationListItem from "./LocationListItem";
import EmptyStateSection from "../common/EmptyStateSection";

import type { UserAddedPlaceDTO } from "@/api/types";
import type { OnSelectPlace } from "@/types/main/plan/bottom-modal/planFromTypes";

interface SearchLocationSectionProps {
  searchLocations: UserAddedPlaceDTO[]; // 검색된 장소 목록
  onClickAddLocation: OnSelectPlace; // 장소 추가
}

const SearchLocationSection = ({
  searchLocations,
  onClickAddLocation,
}: SearchLocationSectionProps) => {
  const isEmpty = searchLocations.length === 0;
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto hide-scrollbar">
      {isEmpty ? (
        <EmptyStateSection />
      ) : (
        <>
          {searchLocations.map((loc, index) => (
            <div key={loc.placeUrl ?? loc.placeName ?? index}>
              <LocationListItem
                location={loc}
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
