import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePlanEditStore } from "@/stores/planEditStore";
import type { EditPlanPlace } from "@/types/main/plan/bottom-modal/planFromTypes";
import { LOCATION_SEARCH_TEXT } from "@/constants/texts/main/plan/locationSearch";
import { useDebouncedKeyword } from "@/utils/useDebouncedKeyword";
import { mockRecentLocations, mockLocations } from "@/mock/locations";

import SearchBackHeader from "@/components/main/plan/common/SearchBackHeader";
import RecentSearchSection from "@/components/main/plan/search/RecentSearchSection";
import SearchLocationSection from "@/components/main/plan/search/SearchLocationSection";

const LocationSearchPage = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState<string>("");

  const debouncedValue = useDebouncedKeyword({ value });
  const hasValue = debouncedValue.length > 0;

  const updatePlace = usePlanEditStore((state) => state.updatePlace);
  const handleAddLocation = (place: EditPlanPlace) => {
    updatePlace(place);
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-[500]">
      <div className="flex flex-col w-full h-full overflow-hidden bg-gray-white">
        <div className="shrink-0 sticky top-0 z-10">
          <SearchBackHeader
            onClick={() => navigate(-1)}
            searchProps={{
              searchPlaceholder: LOCATION_SEARCH_TEXT.HEADER.PLACEHOLDER,
              value: value,
              setValue: setValue,
              onClearSearchInput: () => setValue(""),
            }}
          />
        </div>
        {!hasValue ? (
          <RecentSearchSection
            recentLocations={mockRecentLocations}
            onClickClear={() => {}}
            onClickAddLocation={handleAddLocation}
          />
        ) : (
          <SearchLocationSection
            searchLocations={mockLocations}
            onClickAddLocation={handleAddLocation}
          />
        )}
      </div>
    </div>
  );
};
export default LocationSearchPage;
