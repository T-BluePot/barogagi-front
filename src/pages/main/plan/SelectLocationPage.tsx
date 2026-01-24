import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAlertModalStore } from "@/stores/alertModalStore";

import { ROUTES } from "@/constants/routes";
import { SELECT_LOCATION_TEXT } from "@/constants/texts/main/plan/selectLocation";

import { mockRegions } from "@/mock/regions";

import { PageTitle } from "@/components/auth/common/PageTitle";
import RegionSearchContainer from "@/components/main/plan/create/RegionSearchContainer";
import { RegionTagContainer } from "@/components/main/plan/RegionTagContainer";
import ButtonWithText from "@/components/common/buttons/ButtonWithText";

const SelectLocationPage = () => {
  const navigate = useNavigate();
  const { openAlertModal } = useAlertModalStore();

  const [searchText, setSearchText] = useState<string>("");
  const [selectedRegionNums, setSelectedRegionNums] = useState<number[]>([]);
  const hasSelection = !!selectedRegionNums.length;

  // 지역 선택 처리
  const handleSelectRegion = (regionNum: number) => {
    setSelectedRegionNums((prev) => {
      if (prev.length >= 3) {
        openAlertModal({
          title: "알림",
          content: SELECT_LOCATION_TEXT.ALERT_TAG,
        });
        return prev;
      }
      if (prev.includes(regionNum)) return prev;
      return [...prev, regionNum];
    });
  };

  return (
    <div className="flex h-full flex-col w-full bg-gray-white overflow-auto">
      {/* 본문: 내부 스크롤만 허용하기 위해 min-h-0 + overflow-hidden */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* 좌우 패딩 및 상단 영역 묶음 */}
        <div className="flex flex-1 min-h-0 overflow-hidden flex-col p-6 gap-0 w-full">
          {/* 타이틀 + 선택 태그 영역: 내용만큼만 차지 */}
          <div className="flex-none w-full">
            <div className="flex flex-col w-full pb-4">
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
            <RegionSearchContainer
              searchInput={{
                searchPlaceholder: SELECT_LOCATION_TEXT.PLACEHOLDER,
                value: searchText,
                setValue: setSearchText,
                onClearSearchInput: () => setSearchText(""),
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
        <ButtonWithText
          textLabel={
            SELECT_LOCATION_TEXT.NEXT_BUTTON.ADD_CURRENT_LOCATION_LABEL
          }
          onClickText={() => {
            // TODO: 서버 연동 시 현재 위치 추가하기 로직 작성
          }}
          button={{
            label: !hasSelection
              ? SELECT_LOCATION_TEXT.NEXT_BUTTON.DISABLED
              : SELECT_LOCATION_TEXT.NEXT_BUTTON.ENABLED,

            isDisabled: !hasSelection,
            onClick: () => {
              // 추후 선택된 일정 넘기기 로직 추가
              navigate(ROUTES.PLAN.SETTING);
            },
          }}
        />
      </div>
    </div>
  );
};

export default SelectLocationPage;
