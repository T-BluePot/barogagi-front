import { useState } from "react";

import Chip from "@/components/common/Chip";
import PillSelect from "@/components/common/inputs/PillSelect";
import { useStartScheduleCreation } from "@/hooks/useStartScheduleCreation";
import type { PopularRegionDTO } from "@/api/types";

interface Props {
  regions: PopularRegionDTO[];
}

/** 인기 지역 응답에서 표시용 지역명 추출 (하위 지역 우선) */
const toRegionName = (region: PopularRegionDTO) =>
  region.regionLevel4 ||
  region.regionLevel3 ||
  region.regionLevel2 ||
  region.regionLevel1;

const DEFAULT_REGION = "서울";

/**
 * AI 일정 생성 히어로 카드
 * - 우측 상단 지역 셀렉트로 코스 지역을 고르고, 카드 탭 시 일정 생성 플로우 진입
 * - 지역 옵션은 인기 지역 API 기반 (없으면 기본 "서울")
 */
const HeroCourseCard = ({ regions }: Props) => {
  const { startScheduleCreation } = useStartScheduleCreation();

  const regionOptions = [
    ...new Set(regions.map(toRegionName).filter(Boolean)),
  ];
  const options = regionOptions.length > 0 ? regionOptions : [DEFAULT_REGION];

  // 사용자가 고르기 전에는 인기 1순위 지역을 기본값으로 사용
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const region = selectedRegion ?? options[0];

  return (
    <article className="relative w-full rounded-[20px] bg-peach px-5 py-4.5 text-white shadow-[0_8px_24px_rgba(255,138,101,0.30)]">
      {/* 카드 전체 탭 영역 (셀렉트만 위에서 별도 인터랙션) */}
      <button
        type="button"
        aria-label={`${region} AI 추천 코스 만들기`}
        onClick={startScheduleCreation}
        className="absolute inset-0 rounded-[20px]"
      />

      <div className="pointer-events-none relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-[0.05em] uppercase opacity-90">
            오늘의 추천 코스
          </span>
          <span className="pointer-events-auto">
            <PillSelect
              value={region}
              options={options}
              onChange={setSelectedRegion}
              ariaLabel="코스 지역 선택"
              tone="onPeach"
            />
          </span>
        </div>

        <p className="text-[19px] font-bold leading-[1.32] tracking-[-0.02em] whitespace-pre-line">
          {`${region} 맞춤 코스,\nAI로 바로 만들어보세요!`}
        </p>

        <div className="flex gap-1.5">
          <Chip label={`# ${region}`} tone="onPeach" />
          <Chip label="# 데이트" tone="onPeach" />
          <Chip label="AI 추천" tone="onPeach" />
        </div>
      </div>
    </article>
  );
};

export default HeroCourseCard;
