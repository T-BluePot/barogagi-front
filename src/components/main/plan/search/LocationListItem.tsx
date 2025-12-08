import { useState } from "react";
import clsx from "clsx";

import AddLocationModal from "./AddLocationModal";
import { LocationIcon } from "./LocationIcon";

// 타입: EditPlanDraft["place"] + 핸들러 공통 타입
import type {
  EditPlanPlace,
  OnSelectPlace,
} from "@/types/main/plan/bottom-modal/planFromTypes";

interface ModalProps {
  // 확인 클릭 시 이 아이템의 location 전체를 부모로 전달
  handleConfirm: OnSelectPlace;
}

export interface LocationListItemProps {
  location: EditPlanPlace; // { placeNum, placeNm, address }
  addModalProps: ModalProps;
}

const LocationListItem = ({
  location,
  addModalProps,
}: LocationListItemProps) => {
  const subTextClass = `typo-description text-gray-60`;
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-row px-6 py-4 justify-between items-center border-b border-gray-5 active:bg-gray-5">
      {/* 등록 모달 */}
      <AddLocationModal
        isOpen={isAddModalOpen}
        locationNm={location.placeNm}
        handleConfirm={() => {
          // 이 아이템이 가진 location 전체를 부모로 전달
          addModalProps.handleConfirm(location);
          setIsAddModalOpen(false);
        }}
        handleCancel={() => setIsAddModalOpen(false)}
      />

      {/* 장소 정보 */}
      <div className="flex flex-row items-center gap-5">
        <LocationIcon />
        <div className="flex flex-col items-baseline gap-1">
          <p className="typo-subtitle">{location.placeNm}</p>
          <p className={subTextClass}>{location.address}</p>
        </div>
      </div>

      {/* 등록 버튼 */}
      <button type="button" onClick={() => setIsAddModalOpen(true)}>
        <div className={clsx(subTextClass, "active:underline")}>등록</div>
      </button>
    </div>
  );
};

export default LocationListItem;
