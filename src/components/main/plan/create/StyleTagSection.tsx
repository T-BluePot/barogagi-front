import ScheduleStyleSectionLayout from "./ScheduleStyleSectionLayout";
import {
  ScheduleStyleTagContainer,
  type ScheduleStyleTagContainerProps,
} from "../ScheduleStyleTagContainer";

import { SCHEDULE_STYLE_TEXT } from "@/constants/texts/main/plan/scheduleStyle";

const StyleTagSection = (props: ScheduleStyleTagContainerProps) => {
  return (
    <ScheduleStyleSectionLayout
      title={SCHEDULE_STYLE_TEXT.TITLE}
      subTitle={SCHEDULE_STYLE_TEXT.SUB_TITLE}
    >
      <div className="flex flex-wrap gap-4">
        <ScheduleStyleTagContainer {...props} />
      </div>
    </ScheduleStyleSectionLayout>
  );
};

export default StyleTagSection;
