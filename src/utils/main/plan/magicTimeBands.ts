import type { MagicTimeBand } from "@/types/api/scheduleTypes";

/**
 * 마법봉 일정의 시간대 밴드 정의.
 *
 * 서버(`MagicScheduleReqDTO`)는 `startTime`/`endTime` **단일 범위**만 받는다.
 * 따라서 프론트에서 고른 밴드들은 항상 하나의 연속 구간으로 합쳐져야 하고,
 * 가운데가 비는 조합(아침+저녁)은 선택 단계에서 막는다 → `isBandSelectable()`
 */
export const MAGIC_TIME_BANDS = [
  { band: "MORNING", label: "아침", startTime: "09:00", endTime: "12:00" },
  { band: "AFTERNOON", label: "점심", startTime: "12:00", endTime: "17:00" },
  { band: "EVENING", label: "저녁", startTime: "17:00", endTime: "21:00" },
] as const satisfies ReadonlyArray<{
  band: MagicTimeBand;
  label: string;
  startTime: string;
  endTime: string;
}>;

/** 기본 선택: 점심 + 저녁 (12:00~21:00) */
export const DEFAULT_MAGIC_BANDS: MagicTimeBand[] = ["AFTERNOON", "EVENING"];

const bandIndex = (band: MagicTimeBand) =>
  MAGIC_TIME_BANDS.findIndex((b) => b.band === band);

/** 선택 순서와 무관하게 항상 정의 순서(아침→점심→저녁)로 정렬 */
const sortBands = (bands: MagicTimeBand[]): MagicTimeBand[] =>
  [...bands].sort((a, b) => bandIndex(a) - bandIndex(b));

/**
 * 선택된 밴드들을 하나의 시간 범위로 합친다.
 * 아무것도 선택되지 않았으면 undefined — 호출부에서 시간 필드를 아예 빼고 보내면
 * 서버 기본값(11:00~19:00)이 적용된다.
 */
export const toMagicTimeRange = (
  bands: MagicTimeBand[]
): { startTime: string; endTime: string } | undefined => {
  const sorted = sortBands(bands);
  if (sorted.length === 0) return undefined;

  const first = MAGIC_TIME_BANDS[bandIndex(sorted[0])];
  const last = MAGIC_TIME_BANDS[bandIndex(sorted[sorted.length - 1])];
  return { startTime: first.startTime, endTime: last.endTime };
};

/** "12:00~21:00" 형태의 요약 문구 (미선택 시 서버 기본값을 그대로 노출) */
export const formatMagicTimeRange = (bands: MagicTimeBand[]): string => {
  const range = toMagicTimeRange(bands);
  if (!range) return "11:00~19:00";
  return `${range.startTime}~${range.endTime}`;
};

/**
 * 해당 밴드를 토글했을 때 연속 구간이 유지되는지.
 *
 * 켜는 방향: 아침+저녁만 남는 조합이면 점심이 통째로 빠져 서버로 표현할 수 없다.
 * 끄는 방향: 가운데(점심)를 끄면 양쪽만 남아 같은 문제가 생긴다.
 */
export const isBandSelectable = (
  current: MagicTimeBand[],
  target: MagicTimeBand
): boolean => {
  const next = current.includes(target)
    ? current.filter((b) => b !== target)
    : [...current, target];

  // 전부 해제는 허용 — 시간 미전송으로 서버 기본값에 맡긴다
  if (next.length === 0) return true;

  const indexes = sortBands(next).map(bandIndex);
  return indexes[indexes.length - 1] - indexes[0] === indexes.length - 1;
};

/** 토글 결과를 계산. 연속 구간이 깨지는 조합이면 현재 상태를 그대로 돌려준다. */
export const toggleMagicBand = (
  current: MagicTimeBand[],
  target: MagicTimeBand
): MagicTimeBand[] => {
  if (!isBandSelectable(current, target)) return current;
  return sortBands(
    current.includes(target)
      ? current.filter((b) => b !== target)
      : [...current, target]
  );
};

/** 서버 기본 시간 범위 — 시간대를 하나도 고르지 않았을 때 적용된다 */
const SERVER_DEFAULT_RANGE = { startTime: "11:00", endTime: "19:00" };

/** 서버가 식사 카테고리를 고정하는 기준 시각 (점심/저녁) */
const MEAL_TIMES = [12 * 60 + 30, 18 * 60 + 30];

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const toHHMM = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")}`;

export type MagicSlotPreview = {
  startTime: string;
  endTime: string;
  /** 서버가 '식사' 카테고리로 고정하는 슬롯 */
  isMeal: boolean;
};

/**
 * 생성 전에 보여줄 슬롯 미리보기.
 *
 * ⚠️ 서버 `ScheduleCommandService.buildMagicPlans()` 의 규칙을 프론트에서 재현한 것이다.
 * 백엔드가 슬롯 분할 방식이나 식사 기준 시각을 바꾸면 여기도 같이 고쳐야 한다.
 * (규칙: 2시간 단위로 자르고 마지막 조각은 종료시간에 맞춰 짧아진다.
 *  12:30 / 18:30 을 품는 슬롯은 '식사'로 고정.)
 *
 * 어디까지나 예고일 뿐이다 — 슬롯별 장소 검색이 실패하면 그 칸은 빠진 채 응답이 온다.
 * 화면 카피에서 개수를 단정하지 말 것.
 */
export const buildMagicSlotPreview = (
  bands: MagicTimeBand[]
): MagicSlotPreview[] => {
  const range = toMagicTimeRange(bands) ?? SERVER_DEFAULT_RANGE;

  const start = toMinutes(range.startTime);
  const end = toMinutes(range.endTime);
  if (start >= end) return [];

  const slots: MagicSlotPreview[] = [];
  let cursor = start;
  while (cursor < end) {
    const next = Math.min(cursor + 120, end);
    slots.push({
      startTime: toHHMM(cursor),
      endTime: toHHMM(next),
      isMeal: false,
    });
    cursor = next;
  }

  // 식사 시각을 품는 첫 슬롯만 식사로 고정 (서버와 동일하게 시각당 한 칸)
  MEAL_TIMES.forEach((mealTime) => {
    const target = slots.find(
      (slot) =>
        !slot.isMeal &&
        mealTime >= toMinutes(slot.startTime) &&
        mealTime < toMinutes(slot.endTime)
    );
    if (target) target.isMeal = true;
  });

  return slots;
};
