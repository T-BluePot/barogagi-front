import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { LOCATION_SEARCH_TEXT } from "@/constants/texts/main/plan/locationSearch";
import { useDebouncedKeyword } from "@/utils/useDebouncedKeyword";

// === component ===
import SearchBackHeader from "@/components/main/plan/common/SearchBackHeader";
import RecentSearchSection from "@/components/main/plan/search/RecentSearchSection";
import SearchLocationSection from "@/components/main/plan/search/SearchLocationSection";

// === server ===
import { searchPlaces } from "@/api/queries";
import type { UserAddedPlaceDTO, KakaoPlaceDTO } from "@/api/types";
import { useUserPlaceStore } from "@/stores/userPlaceStore";

const LocationSearchPage = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserAddedPlaceDTO[]>([]);

  const debouncedValue = useDebouncedKeyword(value);
  const hasValue = debouncedValue.length > 0;

  // --- 검색 리스트 불러오기 로직
  useEffect(() => {
    if (!hasValue) {
      setSearchResults([]);
      return;
    }
    let ignore = false;

    searchPlaces(debouncedValue)
      .then((res) => {
        if (ignore) return;
        const mapped = (res.data ?? []).map((item: KakaoPlaceDTO) => ({
          placeName: item.place_name,
          placeUrl: item.place_url,
          addressName: item.address_name,
        }));
        setSearchResults(mapped);
      })
      .catch((err) => {
        if (ignore) return;
        console.error("[searchPlaces err]", err);
        setSearchResults([]);
      });

    return () => {
      ignore = true;
    };
  }, [debouncedValue]);

  const { setPlace, recentPlaces, clearRecentPlaces } = useUserPlaceStore();
  const context = useOutletContext<{
    onPlaceSelect?: (place: UserAddedPlaceDTO) => void;
  } | null>();

  const handleAddLocation = (place: UserAddedPlaceDTO) => {
    if (context?.onPlaceSelect) {
      context.onPlaceSelect(place);
    } else {
      setPlace(place);
    }
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-[500] pt-safe pb-safe bg-gray-white">
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
            recentLocations={recentPlaces}
            onClickClear={clearRecentPlaces}
            onClickAddLocation={handleAddLocation}
          />
        ) : (
          <SearchLocationSection
            searchLocations={searchResults}
            onClickAddLocation={handleAddLocation}
          />
        )}
      </div>
    </div>
  );
};
export default LocationSearchPage;
