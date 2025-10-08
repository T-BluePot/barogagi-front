import { PlanInfoItem } from "./PlanInfoItem";

import CircleIcon from "@mui/icons-material/Circle";

interface PlanInfoProps {
  timeValue: string;
  locationValue: string;
}

export const PlanInfo = ({ timeValue, locationValue }: PlanInfoProps) => {
  return (
    <div className="flex items-center gap-3">
      <PlanInfoItem variant="time" value={timeValue} />

      <CircleIcon className="!text-[4px] text-gray-60" />

      <PlanInfoItem variant="location" value={locationValue} />
    </div>
  );
};
