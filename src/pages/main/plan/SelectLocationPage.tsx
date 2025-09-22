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

  const [searchText, setSearchText] = useState<string>("");
  const [selectedRegionNums, setSelectedRegionNums] = useState<number[]>([]);
  const hasSelection = !!selectedRegionNums.length;

  // 지역 선택 처리
  const handleSelectRegion = (regionNum: number) => {
    // 태그 3개 제한
    if (selectedRegionNums.length >= 3) {
      alert(SELECT_LOCATION_TEXT.ALERT_TAG); // 테스트 전용
      return;
    }
    // 중복 방지
    if (selectedRegionNums.includes(regionNum)) return;
    setSelectedRegionNums([...selectedRegionNums, regionNum]);
  };

  return (
    // h-dvh: 동적 뷰포트 높이를 사용해 모바일 브라우저 바 높이 변화에도 안정적
    // overflow-hidden: 페이지 바깥 스크롤을 차단
    <div className="flex h-dvh flex-col w-full bg-gray-white overflow-hidden">
      {/* 상단 헤더는 고정 높이 영역 */}
      <BackHeader
        label={SELECT_LOCATION_TEXT.HEADER_TITLE}
        onClick={() => safeBack(navigate, ROUTES.PLAN.DATE)}
      />

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
      <div className="flex-none w-full">
        <div className="flex justify-center items-center p-6">
          <div className="w-full max-w-screen-sm">
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
    </div>
  );
};

export default SelectLocationPage;
