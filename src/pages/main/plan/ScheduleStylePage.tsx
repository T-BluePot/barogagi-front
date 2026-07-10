import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// === constants ===
import { SCHEDULE_STYLE_TEXT } from "@/constants/texts/main/plan/scheduleStyle";
import { ROUTES } from "@/constants/routes";

// === component ===
import type { ActiveMap } from "@/components/main/plan/ScheduleStyleTagContainer";
import StyleTagSection from "@/components/main/plan/create/StyleTagSection";
import SectionSpacer from "@/components/layout/SectionSpacer";
import StyleReferenceSection from "@/components/main/plan/create/StyleReferenceSection";
import Button from "@/components/common/buttons/CommonButton";

// === server ===
import { searchTags } from "@/api/queries";
import type { TagRegistReqDTO } from "@/api/types";
import { generateScheduleNm } from "@/utils/main/plan/generateScheduleNm";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import { useScheduleDraftStore } from "@/stores/scheduleStore";

const ScheduleStylePage = () => {
  const navigate = useNavigate();
  const { setDraft, draft } = useScheduleDraftStore();

  const [styleTags, setStyleTags] = useState<TagRegistReqDTO[]>([]);
  const [actives, setActives] = useState<ActiveMap>({});

  useEffect(() => {
    const fetchTags = async () => {
      const res = await searchTags({ tagType: "S", categoryNum: null });
      const tags = res.data ?? [];
      setStyleTags(tags);

      // 태그 목록 로드 후 store에 저장된 선택값 반영
      const savedTagNums = new Set(
        draft.scheduleTagRegistReqDTOList.map((t) => t.tagNum)
      );
      const initialActives: ActiveMap = {};
      tags.forEach((tag) => {
        initialActives[tag.tagNum] = savedTagNums.has(tag.tagNum);
      });
      setActives(initialActives);
    };

    fetchTags();
  }, []);

  const isAllInactive = (actives: ActiveMap): boolean => {
    return Object.values(actives).every((v) => !v);
  };

  // actives가 바뀔 때마다 store 업데이트
  useEffect(() => {
    if (styleTags.length === 0) return;
    const selectedTags = styleTags.filter((tag) => actives[tag.tagNum]);
    setDraft({ scheduleTagRegistReqDTOList: selectedTags });
  }, [actives, styleTags]);

  // === 참고사항 추가 옵션 ===
  // 연령대/인원수: 즉시 draft 반영 / 목적·참고사항: 로컬 state 후 blur 시 draft 반영
  const ages = draft.ages ?? [];
  const people = draft.people ?? 2;

  const toggleAge = (age: string) => {
    const next = ages.includes(age)
      ? ages.filter((a) => a !== age)
      : [...ages, age];
    setDraft({ ages: next });
  };

  const changePeople = (delta: number) => {
    // 하한 0 = 미선택(빈 값)으로 리셋 가능. 0이면 buildComment에서 서버 전송 제외됨
    setDraft({ people: Math.max(0, Math.min(10, people + delta)) });
  };

  const [purpose, setPurpose] = useState<string>(draft.purpose ?? "");
  const [scheduleNotes, setScheduleNotes] = useState<string>(
    draft.comment ?? ""
  );

  // === 추천 일정 생성 ===
  const selectedRegions = useRegionSelectionStore((s) => s.selectedRegions);

  const handleNext = () => {
    setDraft({ scheduleNm: generateScheduleNm(selectedRegions) });
    navigate(ROUTES.PLAN.CREATE);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-white">
      <div className="flex flex-1 flex-col overflow-y-auto hide-scrollbar">
        <StyleTagSection
          styles={styleTags}
          actives={actives}
          setActives={setActives}
        />
        <SectionSpacer />
        <StyleReferenceSection
          ages={ages}
          onToggleAge={toggleAge}
          people={people}
          onChangePeople={changePeople}
          purpose={purpose}
          onChangePurpose={setPurpose}
          onBlurPurpose={() => setDraft({ purpose })}
          note={scheduleNotes}
          onChangeNote={setScheduleNotes}
          onBlurNote={() => setDraft({ comment: scheduleNotes })}
        />
      </div>
      <div className="w-full p-6">
        <Button
          label={SCHEDULE_STYLE_TEXT.NEXT_BUTTON}
          isDisabled={isAllInactive(actives)}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default ScheduleStylePage;
