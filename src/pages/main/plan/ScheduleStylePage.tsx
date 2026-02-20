import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// === constants ===
import { SCHEDULE_STYLE_TEXT } from "@/constants/texts/main/plan/scheduleStyle";
import { ROUTES } from "@/constants/routes";

// === component ===
import type { ActiveMap } from "@/components/main/plan/ScheduleStyleTagContainer";
import StyleTagSection from "@/components/main/plan/create/StyleTagSection";
import SectionSpacer from "@/components/layout/SectionSpacer";
import StyleNoteSection from "@/components/main/plan/create/StyleNoteSection";
import Button from "@/components/common/buttons/CommonButton";

import { mockStlyes } from "@/mock/styles";

// === server ===
import { searchTags } from "@/api/queries";

const ScheduleStylePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      const res = await searchTags({
        categoryNum: 11, // 여행 스타일 태그
      });

      console.log("태그 응답값:", res);
    };

    fetchTags();
  }, []);
  const [actives, setActives] = useState<ActiveMap>({});

  const isAllInactive = (actives: ActiveMap): boolean => {
    return Object.values(actives).every((v) => !v);
  };

  // 여행 참고사항 입력값 상태
  const [scheduleNotes, setScheduleNotes] = useState<string>("");

  return (
    <div className="flex flex-col w-full h-full bg-gray-white">
      <div className="flex flex-col">
        <StyleTagSection
          styles={mockStlyes}
          actives={actives}
          setActives={setActives}
        />
        <SectionSpacer />
        <StyleNoteSection
          scheduleNotes={scheduleNotes}
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
