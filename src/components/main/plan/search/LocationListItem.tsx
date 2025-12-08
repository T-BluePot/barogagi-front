import { useState } from "react";
import clsx from "clsx";

import AddLocationModal from "./AddLocationModal";
import type { EditPlanDraft } from "@/types/main/plan/bottom-modal/planFromTypes";

import { LocationIcon } from "./LocationIcon";
interface modalProps {
  // 이 아이템의 place 섹션 전체를 부모로 넘김
  handleConfirm: (location: EditPlanDraft["place"]) => void;
}

export interface LocationListItemProps {
  location: EditPlanDraft["place"];
  addModalProps: modalProps;
}

const LocationListItem = ({
  location,
  addModalProps,
}: LocationListItemProps) => {
  const subTextClass = `typo-description text-gray-60`;

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-row px-6 py-4 justify-between items-center border-b border-gray-5 active:bg-gray-5">
      <AddLocationModal
        isOpen={isAddModalOpen}
        locationNm={location.placeNm}
        handleConfirm={() => {
          addModalProps.handleConfirm(location);
          setIsAddModalOpen(false);
        }}
        handleCancel={() => setIsAddModalOpen(false)}
      />
      {/* 장소 정보 */}
      <div className="flex flex-row items-center gap-5">
        <LocationIcon />
        <div className="flex flex-col items-baseline gap-1">
          <p className="typo-subtitle"> {location.placeNm}</p>
          <p className={subTextClass}> {location.address}</p>
        </div>
      </div>
      <button onClick={() => setIsAddModalOpen(true)}>
        <div className={clsx(subTextClass, "active:underline")}>등록</div>
      </button>
    </div>
  );
};

export default LocationListItem;
