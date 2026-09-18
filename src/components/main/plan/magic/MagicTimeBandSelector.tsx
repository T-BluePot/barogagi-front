import toast from "react-hot-toast";

import { MAGIC_SCHEDULE_TEXT } from "@/constants/texts/main/plan/magicSchedule";

import type { MagicTimeBand } from "@/types/api/scheduleTypes";
import {
  MAGIC_TIME_BANDS,
  formatMagicTimeRange,
  isBandSelectable,
} from "@/utils/main/plan/magicTimeBands";

interface MagicTimeBandSelectorProps {
  selected: MagicTimeBand[];
  onToggle: (band: MagicTimeBand) => void;
}

/**
 * 마법봉 시간대 선택 — 아침/점심/저녁 세그먼트.
 *
 * 낱개 칩이 아니라 붙어 있는 세그먼트 바로 그린 이유:
 * 서버가 단일 시간 범위만 받아서 선택은 항상 연속 구간이어야 하는데,
 * 고른 칸들이 하나의 덩어리로 채워지면 그 규칙이 설명 없이 보인다.
 *
 * 연속이 깨지는 조작은 눌렀을 때 토스트로만 알린다. 안내 문구를 화면에 상시 띄우면
 * 정상적으로 고르는 중에도 경고가 따라다녀 잔소리처럼 읽힌다.
 */
const MagicTimeBandSelector = ({
  selected,
  onToggle,
}: MagicTimeBandSelectorProps) => {
  const handleClick = (band: MagicTimeBand, label: string) => {
    if (isBandSelectable(selected, band)) {
      onToggle(band);
      return;
    }
    // 못 고르는 이유가 두 가지다 — 떨어진 시간대를 더하려 했거나, 가운데를 빼려 했거나.
    // 빼는 쪽은 어느 칸이 문제인지 이름으로 짚어준다("가운데"보다 바로 읽힌다).
    toast(
      selected.includes(band)
        ? MAGIC_SCHEDULE_TEXT.TIME.BLOCKED_REMOVE(label)
        : MAGIC_SCHEDULE_TEXT.TIME.BLOCKED_ADD
    );
  };

  return (
    <section>
      {/* 공용 SectionHeader(17px/700)를 쓰지 않는다.
       * 페이지 타이틀이 20px/600 이라 700 짜리 하위 헤더가 더 무겁게 읽힌다.
       * 여기서는 한 단계 아래인 typo-subtitle(16px/600)로 위계를 맞춘다. */}
      <div className="mb-3 flex flex-col">
        <h2 className="typo-subtitle text-gray-black">
          {MAGIC_SCHEDULE_TEXT.TIME.TITLE}
        </h2>
        <span className="mt-0.5 typo-description text-gray-50">
          {selected.length > 0
            ? formatMagicTimeRange(selected)
            : MAGIC_SCHEDULE_TEXT.TIME.EMPTY}
        </span>
      </div>

      <div className="flex overflow-hidden rounded-2xl border border-gray-20">
        {MAGIC_TIME_BANDS.map(({ band, label, startTime, endTime }, index) => {
          const isSelected = selected.includes(band);
          const isBlocked = !isBandSelectable(selected, band);
          // 색이 바뀌는 자리에는 선을 긋지 않는다. 선택 칸끼리는 한 덩어리로 보여야 하고,
          // 선택/미선택 경계는 배경색 차이가 이미 경계 역할을 한다.
          const prevSelected =
            index > 0 && selected.includes(MAGIC_TIME_BANDS[index - 1].band);
          const needsDivider = index > 0 && !isSelected && !prevSelected;

          return (
            <button
              key={band}
              type="button"
              role="switch"
              aria-checked={isSelected}
              // disabled 로 막지 않는다 — 탭이 들어와야 토스트로 이유를 알릴 수 있다
              aria-disabled={isBlocked || undefined}
              onClick={() => handleClick(band, label)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-3 transition-colors duration-200 ease-fitpl ${
                needsDivider ? "border-l border-gray-20" : ""
              } ${
                isSelected
                  ? // peach(#ff8a65)는 아래 CTA 옆에서 탁해 보이고, 마법봉 코랄(#ff5f38)은
                    // 칩 세 칸을 채우기엔 너무 진하다 → 중간값인 peach-active 를 쓴다.
                    "bg-peach-active text-white"
                  : isBlocked
                  ? "bg-gray-5 text-gray-30"
                  : "bg-gray-white text-gray-60"
              }`}
            >
              <span className="typo-body">{label}</span>
              <span
                className={`typo-description ${
                  isSelected ? "text-white/80" : ""
                }`}
              >
                {`${startTime}~${endTime}`}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MagicTimeBandSelector;
