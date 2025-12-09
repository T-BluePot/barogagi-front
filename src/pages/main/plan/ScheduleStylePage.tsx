import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SCHEDULE_STYLE_TEXT } from "@/constants/texts/main/plan/scheduleStyle";

import type { ActiveMap } from "@/components/main/plan/ScheduleStyleTagContainer";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { ScheduleStyleTagContainer } from "@/components/main/plan/ScheduleStyleTagContainer";
import TextInput from "@/components/common/inputs/TextInput";
import Button from "@/components/common/buttons/CommonButton";

import { mockStlyes } from "@/mock/styles";
import { ROUTES } from "@/constants/routes";

const ScheduleStylePage = () => {
  const navigate = useNavigate();

  const sectionClass = "flex flex-col";

  const [actives, setActives] = useState<ActiveMap>({});

  const isAllInactive = (actives: ActiveMap): boolean => {
    return Object.values(actives).every((v) => !v);
  };

  // 여행 참고사항 입력값 상태
  const [schedulelNotes, setScheduleNotes] = useState<string>("");

  return (
    <div className="flex flex-col w-full h-full bg-gray-white">
      <div className="flex flex-col mt-6 gap-8 px-6">
        <div className={sectionClass}>
          <PageTitle
            type="main"
            title={SCHEDULE_STYLE_TEXT.TITLE}
            subTitle={SCHEDULE_STYLE_TEXT.SUB_TITLE}
          />
          <div className="flex flex-wrap gap-4">
            <ScheduleStyleTagContainer
              styles={mockStlyes}
              actives={actives}
              setActives={setActives}
            />
          </div>
        </div>
        <div className={sectionClass}>
          <PageTitle
            type="main"
            title={SCHEDULE_STYLE_TEXT.SEC_TITLE}
            subTitle={SCHEDULE_STYLE_TEXT.SEC_SUB_TITLE}
          />
          <TextInput
            size="large"
            placeholder={SCHEDULE_STYLE_TEXT.PLACEHOLDER}
            value={schedulelNotes}
            onChange={setScheduleNotes}
          />
        </div>
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
