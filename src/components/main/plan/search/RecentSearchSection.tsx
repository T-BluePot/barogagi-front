import { useState } from "react";

import RecentSearchHeader from "./RecentSearchHeader";
import LocationListItem from "./LocationListItem";

import ClearAllModal from "./ClearAllModal";

import type {
  EditPlanPlace,
  OnSelectPlace,
} from "@/types/main/plan/bottom-modal/planFromTypes";

interface RecentSearchSectionProps {
  onClickClear: () => void; // 최근 검색어 비우기
  recentLocations: EditPlanPlace[]; // 최근 추가한 장소 (최대 10개, 로컬에서 저장)
  onClickAddLocation: OnSelectPlace; // 장소 추가
}

const RecentSearchSection = ({
  onClickClear,
  recentLocations,
  onClickAddLocation,
}: RecentSearchSectionProps) => {
  const [isClearAllModalOpen, setIsClearAllModalOpen] =
    useState<boolean>(false);
  const hasRecentLocations = recentLocations && recentLocations.length !== 0;
  return (
    <div className="flex flex-col h-full overflow-auto">
      <ClearAllModal
        isOpen={isClearAllModalOpen}
        handleClearAll={() => {
          onClickClear();
          setIsClearAllModalOpen(false);
        }}
        handleCancel={() => setIsClearAllModalOpen(false)}
      />
      <RecentSearchHeader onclick={() => setIsClearAllModalOpen(true)} />
      {hasRecentLocations && (
        <div className="flex flex-col w-full h-full overflow-y-auto hide-scrollbar">
          {recentLocations.map((loc) => (
            <div key={loc.placeNum}>
              <LocationListItem
                location={loc}
                addModalProps={{
                  handleConfirm: onClickAddLocation,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSearchSection;
