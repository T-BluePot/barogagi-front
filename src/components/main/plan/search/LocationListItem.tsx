import { useState } from "react";
import clsx from "clsx";

import { LocationIcon } from "./LocationIcon";
import AddLocationModal from "./AddLocationModal";

interface modalProps {
  handleConfirm: () => void;
}

export interface LocationListItemProps {
  locationNm: string;
  locationAdress: string;
  addModalProps: modalProps;
}

const LocationListItem = ({
  locationNm,
  locationAdress,
  addModalProps,
}: LocationListItemProps) => {
  const subTextClass = `typo-description text-gray-60`;

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-row px-6 py-4 justify-between items-center border-b border-gray-5 active:bg-gray-5">
      <AddLocationModal
        isOpen={isAddModalOpen}
        locationNm={locationNm}
        handleConfirm={addModalProps?.handleConfirm}
        handleCancel={() => setIsAddModalOpen(false)}
      />
      {/* 장소 정보 */}
      <div className="flex flex-row items-center gap-5">
        <LocationIcon />
        <div className="flex flex-col items-baseline gap-1">
          <p className="typo-subtitle"> {locationNm}</p>
          <p className={subTextClass}> {locationAdress}</p>
        </div>
      </div>
      <button onClick={() => setIsAddModalOpen(true)}>
        <div className={clsx(subTextClass, "active:underline")}>등록</div>
      </button>
    </div>
  );
};

export default LocationListItem;
