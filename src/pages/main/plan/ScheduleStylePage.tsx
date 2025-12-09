import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SCHEDULE_STYLE_TEXT } from "@/constants/texts/main/plan/scheduleStyle";

import type { ActiveMap } from "@/components/main/plan/ScheduleStyleTagContainer";

import StyleTagSection from "@/components/main/plan/create/StyleTagSction";
import SectionSpacer from "@/components/main/plan/common/SectionSpacer";
import StyleNoteSction from "@/components/main/plan/create/StyleNoteSction";
import Button from "@/components/common/buttons/CommonButton";

import { mockStlyes } from "@/mock/styles";
import { ROUTES } from "@/constants/routes";

const ScheduleStylePage = () => {
  const navigate = useNavigate();

  const [actives, setActives] = useState<ActiveMap>({});

  const isAllInactive = (actives: ActiveMap): boolean => {
    return Object.values(actives).every((v) => !v);
  };

  // 여행 참고사항 입력값 상태
  const [schedulelNotes, setScheduleNotes] = useState<string>("");

  return (
    <div className="flex flex-col w-full h-full bg-gray-white">
      <div className="flex flex-col">
        <StyleTagSection
          styles={mockStlyes}
          actives={actives}
          setActives={setActives}
        />
        <SectionSpacer />
        <StyleNoteSction
          schedulelNotes={schedulelNotes}
          setScheduleNotes={setScheduleNotes}
        />
      </div>
      <div className="mt-auto w-full p-6">
        <Button
          label={SCHEDULE_STYLE_TEXT.NEXT_BUTTON}
          isDisabled={isAllInactive(actives)}
          onClick={() => {
            // 추후 선택된 일정 넘기기 로직 추가
            navigate(ROUTES.PLAN.CREATE);
          }}
        />
      </div>
    </div>
  );
};

export default ScheduleStylePage;
