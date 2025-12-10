import ScheduleStyleSectionLayout from "./ScheduleStyleSectionLayout";
import TextInput from "@/components/common/inputs/TextInput";

import { SCHEDULE_STYLE_TEXT } from "@/constants/texts/main/plan/scheduleStyle";

const StyleNoteSection = ({
  schedulelNotes,
  setScheduleNotes,
}: {
  schedulelNotes: string;
  setScheduleNotes: (value: string) => void;
}) => {
  return (
    <ScheduleStyleSectionLayout
      title={SCHEDULE_STYLE_TEXT.SEC_TITLE}
      subTitle={SCHEDULE_STYLE_TEXT.SEC_SUB_TITLE}
    >
      <TextInput
        size="large"
        placeholder={SCHEDULE_STYLE_TEXT.PLACEHOLDER}
        value={schedulelNotes}
        onChange={setScheduleNotes}
      />
    </ScheduleStyleSectionLayout>
  );
};

export default StyleNoteSection;
