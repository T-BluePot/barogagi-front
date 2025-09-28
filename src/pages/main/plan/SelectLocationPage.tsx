import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SELECT_LOCATION_TEXT } from "@/constants/texts/main/plan/selectLocation";

import { mockRegions } from "@/mock/regions";

import { PageTitle } from "@/components/auth/common/PageTitle";
import Button from "@/components/common/buttons/CommonButton";
import { SearchComponent } from "@/components/main/plan/SearchComponent";
import { RegionTagContainer } from "@/components/main/plan/RegionTagContainer";
import { ROUTES } from "@/constants/routes";

const SelectLocationPage = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState<string>("");
  const [selectedRegionNums, setSelectedRegionNums] = useState<number[]>([]);
  const hasSelection = !!selectedRegionNums.length;

  // 지역 선택 처리
  const handleSelectRegion = (regionNum: number) => {
    setSelectedRegionNums((prev) => {
      if (prev.length >= 3) {
        alert(SELECT_LOCATION_TEXT.ALERT_TAG); // TODO: 토스트로 교체
        return prev;
      }
      if (prev.includes(regionNum)) return prev;
      return [...prev, regionNum];
    });
  };

  return (
    <div className="flex h-full flex-col w-full bg-gray-white overflow-hidden">
      {/* 본문: 내부 스크롤만 허용하기 위해 min-h-0 + overflow-hidden */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* 좌우 패딩 및 상단 영역 묶음 */}
        <div className="flex flex-1 min-h-0 overflow-hidden flex-col p-6 gap-0 w-full">
          {/* 타이틀 + 선택 태그 영역: 내용만큼만 차지 */}
          <div className="flex-none w-full">
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
          </div>

          {/* 검색 섹션 래퍼: 남은 세로 공간 모두 차지 + 내부 스크롤만 허용 */}
          <div className="flex-1 min-h-0">
            <SearchComponent
              HeaderContentsProps={{
                searchInputProps: {
                  searchPlaceholder: SELECT_LOCATION_TEXT.PLACEHOLDER,
                  value: searchText,
                  setValue: setSearchText,
                  onClearSearchInput: () => setSearchText(""),
                },
                handleAddCurrentLocation: () => {
                  // TODO: 사용자 현재 위치 추가 로직
                },
              }}
              regions={mockRegions}
              handleSelectRegion={(regionNum) => {
                handleSelectRegion(regionNum);
                setSearchText("");
              }}
            />
          </div>
        </div>
      </div>

      {/* 하단 푸터: fixed 제거, 문서 흐름 내 마지막 행으로 배치 */}

      <div className="mt-auto w-full p-6">
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
  );
};

export default SelectLocationPage;
