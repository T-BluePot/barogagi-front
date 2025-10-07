import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationPinIcon from "@mui/icons-material/LocationPin";

type Variant = "time" | "location";

interface ScheduleInfoItemProps {
  variant: Variant;
  value: string;
}

export const ScheduleInfoItem = ({ variant, value }: ScheduleInfoItemProps) => {
  return (
    <div className="flex flex-row items-center gap-1">
      {variant === "time" && (
        <AccessTimeIcon className="!text-[16px] !text-gray-60" />
      )}
      {variant === "location" && (
        <LocationPinIcon className="!text-[16px] !text-gray-60" />
      )}
      <span className="typo-description text-gray-50">{value}</span>
    </div>
  );
};
