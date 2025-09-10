import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SELECT_LOCATION_TEXT } from "@/constants/texts/main/plan/selectLocation";
import { safeBack } from "@/utils/safeBack";

import { mockRegions } from "@/mock/regions";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitle } from "@/components/auth/common/PageTitle";
import Button from "@/components/common/buttons/CommonButton";
import { SearchComponent } from "@/components/main/plan/SearchComponent";
import { RegionTagContainer } from "@/components/main/plan/RegionTagContainer";
import { ROUTES } from "@/constants/routes";

const SelectLocationPage = () => {
  const navigate = useNavigate();

  const [serchText, setSearchText] = useState<string>("");

  // 지역 선택용 변수
  const [selectedRegionNums, setSelectedRegionNums] = useState<number[]>([]);

  const hasSelection = !!selectedRegionNums.length;

  // SearchComponent에서 지역 선택했을 때 실행됨
  const handleSelectRegion = (regionNum: number) => {
    if (selectedRegionNums.length >= 3) {
      alert(SELECT_LOCATION_TEXT.ALERT_TAG); // 테스트 전용
      return;
    } // 태그 3개 제한
    if (selectedRegionNums.includes(regionNum)) return; // 중복 방지
    setSelectedRegionNums([...selectedRegionNums, regionNum]);
  };
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-white">
      <BackHeader
        label={SELECT_LOCATION_TEXT.HEADER_TITLE}
        onClick={() => safeBack(navigate, ROUTES.PLAN.DATE)}
      />
      <div className="flex flex-1 flex-col w-full p-6">
        <div className="flex flex-col w-full gap-4 pb-8">
          <PageTitle
            type="main"
            title={SELECT_LOCATION_TEXT.TITLE}
            subTitle={SELECT_LOCATION_TEXT.SUB_TITLE}
          />
          <RegionTagContainer
            regions={mockRegions}
            selectedRegionNums={selectedRegionNums}
            handleRemoveRegion={(regionNum) =>
              setSelectedRegionNums((prev) =>
                prev.filter((n) => n !== regionNum)
              )
            }
          />
        </div>
        <SearchComponent
          searchPlaceholder={SELECT_LOCATION_TEXT.PLACEHOLDER}
          value={serchText}
          setValue={setSearchText}
          onClearSearchInput={() => setSearchText("")}
          regions={mockRegions}
          handleAddCurrentLocation={() => {
            //추후 사용자 현재 위치 추가 로직
          }}
          handleSelectRegion={(regionNum) => {
            handleSelectRegion(regionNum);
            setSearchText("");
          }}
        />

        <div className="fixed w-full bottom-0 items-center p-6">
          <Button
            label={
              !hasSelection
                ? SELECT_LOCATION_TEXT.NEXT_BUTTON.disabled
                : SELECT_LOCATION_TEXT.NEXT_BUTTON.enabled
            }
            isDisabled={!hasSelection}
            onClick={() => {
              // 추후 선택된 일정 넘기기 로직 추가
              navigate(ROUTES.PLAN.TRAVEL_STYLE);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectLocationPage;
