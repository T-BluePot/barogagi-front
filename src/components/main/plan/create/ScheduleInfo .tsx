import { ScheduleInfoItem } from "./ScheduleInfoItem";

import CircleIcon from "@mui/icons-material/Circle";

interface ScheduleInfoProps {
  timeValue: string;
  locationValue: string;
}

export const ScheduleInfo = ({
  timeValue,
  locationValue,
}: ScheduleInfoProps) => {
  return (
    <div className="flex items-center gap-3">
      <ScheduleInfoItem variant="time" value={timeValue} />

      <CircleIcon className="!text-[4px] text-gray-60" />

      <ScheduleInfoItem variant="location" value={locationValue} />
    </div>
  );
};
