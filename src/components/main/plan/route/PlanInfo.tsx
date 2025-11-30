import { PlanInfoItem } from "./PlanInfoItem";

interface PlanInfoProps {
  timeValue: string;
  locationValue: string;
}

export const PlanInfo = ({ timeValue, locationValue }: PlanInfoProps) => {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <div className="flex items-center">
        <PlanInfoItem variant="time" value={timeValue} />
        <div className="p-1" />
      </div>
      <PlanInfoItem variant="location" value={locationValue} />
    </div>
  );
};
