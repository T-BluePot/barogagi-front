export type GenderType = "M" | "W";

/** 성별 옵션 목록 (GenderType 기반으로 타입 안전하게 고정) */
export const GENDER_LIST = [
  { id: "W", label: "여성" },
  { id: "M", label: "남성" },
] as const satisfies ReadonlyArray<{
  id: GenderType;
  label: string;
}>;

/** 성별 라벨 조회 */
export const getGenderLabel = (
  id: GenderType | undefined
): string | undefined => {
  return GENDER_LIST.find((g) => g.id === id)?.label;
};
