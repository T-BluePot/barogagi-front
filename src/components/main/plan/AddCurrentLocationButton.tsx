import MyLocationIcon from "@mui/icons-material/MyLocation";

interface LocationBtnProps {
  handleAddCurrentLocation: () => void;
}

const AddCurrentLocationButton = ({
  handleAddCurrentLocation,
}: LocationBtnProps) => {
  return (
    <button
      className="flex flex-row justify-center items-center h-12 p-2 gap-2 rounded-[8px] border border-gray-20 cursor-pointer"
      onClick={handleAddCurrentLocation}
    >
      <MyLocationIcon className="!text-[16px] text-gray-60" />
      <span className="typo-caption text-gray-60">현재 위치 추가하기</span>
    </button>
  );
};

export default AddCurrentLocationButton;
