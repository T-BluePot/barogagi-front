export const GENDER_LIST = [
  { id: "female", label: "여성" },
  { id: "male", label: "남성" },
  { id: "other", label: "기타" },
] as const;

export type GenderType = (typeof GENDER_LIST)[number]["id"];

export function getGenderLabel(gender: GenderType | null): string | undefined {
  return GENDER_LIST.find((g) => g.id === gender)?.label ?? undefined;
}
