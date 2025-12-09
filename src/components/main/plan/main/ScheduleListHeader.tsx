import { TitleHeader } from "@/components/common/headers/TitleHeader";
import {
  ScheduleViewToggleButton,
  type ScheduleViewType,
} from "./ScheduleViewToggleButton";

import { SCHEDULE_LIST_TEXT } from "@/constants/texts/main/plan/scheduleList";

interface ScheduleListHeaderProps {
  viewType: ScheduleViewType;
  toggleViewType: () => void;
}

const ScheduleListHeader = ({
  viewType,
  toggleViewType,
}: ScheduleListHeaderProps) => {
  return (
    <div className="shrink-0 sticky top-0 z-10 bg-gray-white">
      <TitleHeader label={SCHEDULE_LIST_TEXT.HEADER}>
        <ScheduleViewToggleButton
          viewType={viewType}
          toggleViewType={toggleViewType}
        />
      </TitleHeader>
    </div>
  );
};

export default ScheduleListHeader;
