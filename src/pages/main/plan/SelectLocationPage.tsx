import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// === constants ===
import { ROUTES } from "@/constants/routes";
import { SELECT_LOCATION_TEXT } from "@/constants/texts/main/plan/selectLocation";

// === components ===
import { PageTitle } from "@/components/auth/common/PageTitle";
import RegionSearchContainer from "@/components/main/plan/create/RegionSearchContainer";
import { RegionTagContainer } from "@/components/main/plan/RegionTagContainer";
import Button from "@/components/common/buttons/CommonButton";

// === server ===
import type { RegionSearchItemType } from "@/types/api/scheduleTypes";

// === store ===
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";

const SelectLocationPage = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState<string>("");
  const selectedRegions = useRegionSelectionStore((s) => s.selectedRegions);
  const addRegion = useRegionSelectionStore((s) => s.addRegion);
  const removeRegionByNum = useRegionSelectionStore((s) => s.removeRegionByNum);

  const hasSelection = selectedRegions.length > 0;

  const handleSelectRegion = (item: RegionSearchItemType) => {
    const result = addRegion(item);
    if (!result.ok) {
      if (result.reason === "MAX") toast("최대 3개까지 선택할 수 있어요");
      if (result.reason === "DUPLICATE") toast("이미 선택된 지역이에요");
    }
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
                selectedRegions={selectedRegions}
                onRemove={(target) => removeRegionByNum(target.regionNum)}
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
              handleSelectRegion={handleSelectRegion}
            />
          </div>
        </div>
      </div>

      {/* 하단 푸터 */}
      <div className="mt-auto w-full p-6">
        <Button
          type="button"
          isDisabled={!hasSelection}
          label={
            !hasSelection
              ? SELECT_LOCATION_TEXT.NEXT_BUTTON.DISABLED
              : SELECT_LOCATION_TEXT.NEXT_BUTTON.ENABLED
          }
          onClick={() => {
            // 추후 선택된 일정 넘기기 로직 추가
            navigate(ROUTES.PLAN.SETTING);
          }}
        />
      </div>
    </div>
  );
};

export default SelectLocationPage;
