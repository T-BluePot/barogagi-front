import clsx from "clsx";
import { LocationIcon } from "./LocationIcon";

export interface LocationListItemProps {
  locationNm: string;
  locationAdress: string;
  onClick: () => void;
}

const LocationListItem = ({
  locationNm,
  locationAdress,
  onClick,
}: LocationListItemProps) => {
  const subTextClass = `typo-description text-gray-60`;
  return (
    <div className="flex flex-row px-6 py-4 justify-between items-center border-b border-gray-5 active:bg-gray-5">
      {/* 장소 정보 */}
      <div className="flex flex-row items-center gap-5">
        <LocationIcon />
        <div className="flex flex-col items-baseline gap-1">
          <p className="typo-subtitle"> {locationNm}</p>
          <p className={subTextClass}> {locationAdress}</p>
        </div>
      </div>
      <button onClick={onClick}>
        <div className={clsx(subTextClass, "active:underline")}>등록</div>
      </button>
    </div>
  );
};

export default LocationListItem;
