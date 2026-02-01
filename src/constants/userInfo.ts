/** 성별 옵션 목록 */
export const GENDER_LIST = [
  { id: "female", label: "여성" },
  { id: "male", label: "남성" },
  { id: "other", label: "기타" },
] as const;

export type GenderType = (typeof GENDER_LIST)[number]["id"];

/** 성별 라벨 조회 */
export const getGenderLabel = (id: string | null): string | undefined =>
  GENDER_LIST.find((g) => g.id === id)?.label;
