import LocationListItem from "./LocationListItem";

import type {
  EditPlanPlace,
  OnSelectPlace,
} from "@/types/main/plan/bottom-modal/planFromTypes";

import EmptyStateSection from "../common/EmptyStateSection";

interface SearchLocationSectionprops {
  searchLocations: EditPlanPlace[]; // 검색된 장소 목록
  onClickAddLocation: OnSelectPlace; // 장소 추가
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
          {searchLocations.map((loc) => (
            <div key={loc.placeNum}>
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
