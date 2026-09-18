import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// === constants ===
import { ROUTES } from "@/constants/routes";
import { EASE_FITPL } from "@/constants/motion";
import { MAGIC_SCHEDULE_TEXT } from "@/constants/texts/main/plan/magicSchedule";

// === components ===
import { PageTitle } from "@/components/auth/common/PageTitle";
import { BUTTON_COLOR } from "@/components/common/buttons/buttonStyles";
import MagicSummaryRow from "@/components/main/plan/magic/MagicSummaryRow";
import MagicTimeBandSelector from "@/components/main/plan/magic/MagicTimeBandSelector";
import MagicSlotPreview from "@/components/main/plan/magic/MagicSlotPreview";

// === store ===
import { useScheduleDraftStore } from "@/stores/scheduleStore";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";

// === utils ===
import { parseServerDateToLocalDate } from "@/utils/dateFormatters";
import { formatDateToKorean } from "@/utils/date";
import { generateScheduleNm } from "@/utils/main/plan/generateScheduleNm";
import { toggleMagicBand } from "@/utils/main/plan/magicTimeBands";

import type { MagicTimeBand } from "@/types/api/scheduleTypes";

/** 마법봉 지팡이 — CTA 안에서 흔들리는 장식 아이콘 */
const WandIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <path
      d="M4.5 19.5 15 9"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="m14 7.5 2.5-2.5 2.5 2.5-2.5 2.5z"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <path
      d="M7 4v3M5.5 5.5h3M19 14v2.5M17.75 15.25h2.5"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 마법봉 생성 확인 화면.
 *
 * 앞 단계(날짜·지역)를 요약해 보여주고 시간대만 추가로 받는다.
 * 각 행의 "변경"으로 해당 단계에 바로 돌아갈 수 있어 뒤로가기를 반복할 필요가 없다.
 *
 * 실제 API 호출은 다음 화면(ScheduleRoutesPage variant="create")이 담당한다 —
 * 일반 생성과 로딩·에러·저장 흐름을 공유하기 위해서다.
 */
const MagicSchedulePage = () => {
  const navigate = useNavigate();

  const draft = useScheduleDraftStore((s) => s.draft);
  const setDraft = useScheduleDraftStore((s) => s.setDraft);
  const selectedRegions = useRegionSelectionStore((s) => s.selectedRegions);

  const hasRequired =
    !!draft.startDate && draft.scheduleRegionRegistReqDTOList.length > 0;

  // 새로고침 등으로 날짜/지역이 비어 직접 진입한 경우 앞 단계로 돌려보낸다
  useEffect(() => {
    if (!hasRequired) navigate(ROUTES.PLAN.DATE, { replace: true });
  }, [hasRequired, navigate]);

  if (!hasRequired) return null;

  const dateLabel = formatDateToKorean(
    parseServerDateToLocalDate(draft.startDate!)
  );
  const regionLabel = selectedRegions.map((r) => r.regionNm).join(", ");

  const handleToggleBand = (band: MagicTimeBand) => {
    setDraft({
      magicTimeBands: toggleMagicBand(draft.magicTimeBands, band),
    });
  };

  const handleSubmit = () => {
    // 일정명은 여기서 확정한다. 마법봉은 스타일 단계를 건너뛰는데,
    // 결과 화면의 "다시 만들기"가 draft 기반 buildRequest() 를 타면서 일정명을 요구한다.
    setDraft({ scheduleNm: generateScheduleNm(selectedRegions) });
    navigate(ROUTES.PLAN.CREATE);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto bg-gray-white hide-scrollbar">
      <div className="flex flex-col px-6">
        <PageTitle
          type="main"
          title={MAGIC_SCHEDULE_TEXT.TITLE}
          subTitle={MAGIC_SCHEDULE_TEXT.SUB_TITLE}
        />

        {/* 타이틀 아래 영역은 gap-6(24px) 한 곳에서 간격을 잡는다.
         * 블록마다 mt-* 를 붙이면 값이 흩어져 한쪽만 어긋나기 쉽다.
         * 타이틀과의 간격은 PageTitle 자체 mb-8 이 담당한다. */}
        <div className="flex flex-col gap-6">
          {/* 앞 단계 선택값 — 각 행에서 바로 되돌아갈 수 있다.
           * 행 구분선은 각 행의 border-bottom 이 담당한다(맨 위에는 선을 두지 않는다). */}
          <div className="flex flex-col">
            <MagicSummaryRow
              label={MAGIC_SCHEDULE_TEXT.SUMMARY.DATE}
              value={dateLabel}
              onChange={() => navigate(ROUTES.PLAN.DATE)}
            />
            <MagicSummaryRow
              label={MAGIC_SCHEDULE_TEXT.SUMMARY.REGION}
              value={regionLabel}
              onChange={() => navigate(ROUTES.PLAN.LOCATION)}
            />
          </div>

          <MagicTimeBandSelector
            selected={draft.magicTimeBands}
            onToggle={handleToggleBand}
          />

          <MagicSlotPreview bands={draft.magicTimeBands} />
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="mt-auto w-full p-6">
        <motion.button
          type="button"
          onClick={handleSubmit}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.12, ease: EASE_FITPL }}
          className={`flex w-full max-w-xl items-center justify-center gap-2 h-[52px] rounded-full px-4 typo-body shadow-magic-cta ${BUTTON_COLOR.magic}`}
        >
          <motion.span
            aria-hidden
            className="inline-flex"
            // 마법봉을 휙휙 두 번 털고 쉰다 — 장식이라 접근성 트리에서는 감춘다.
            // 흔드는 구간만 짧게 잡는다. 느리게 돌면 "흔든다"가 아니라 "떠 있다"로 읽힌다.
            animate={{ rotate: [0, -18, 14, 0] }}
            transition={{
              duration: 0.45,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeInOut",
            }}
          >
            <WandIcon />
          </motion.span>
          {MAGIC_SCHEDULE_TEXT.SUBMIT}
        </motion.button>
      </div>
    </div>
  );
};

export default MagicSchedulePage;
