import LocationPinIcon from "@mui/icons-material/LocationPin";

export const LocationIcon = () => {
  return (
    <div className="flex justify-center items-center w-8 h-8 rounded-full bg-gray-10">
      <LocationPinIcon
        sx={{
          color: "#8ed71b",
          fontSize: 16,
        }}
      />
    </div>
  );
};
