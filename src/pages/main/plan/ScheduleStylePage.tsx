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

  // 여행 참고사항 입력값 상태
  const [scheduleNotes, setScheduleNotes] = useState<string>(
    draft.comment ?? "" // ← store에서 초기값
  );

  // === 추천 알정 생성 ===
  const selectedRegions = useRegionSelectionStore((s) => s.selectedRegions);

  const handleNext = () => {
    setDraft({ scheduleNm: generateScheduleNm(selectedRegions) });
    navigate(ROUTES.PLAN.CREATE);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-white">
      <div className="flex flex-col">
        <StyleTagSection
          styles={styleTags}
          actives={actives}
          setActives={setActives}
        />
        <SectionSpacer />
        <StyleNoteSection
          scheduleNotes={scheduleNotes}
          setScheduleNotes={setScheduleNotes}
          onBlur={() => setDraft({ comment: scheduleNotes })}
        />
      </div>
      <div className="mt-auto w-full p-6">
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
