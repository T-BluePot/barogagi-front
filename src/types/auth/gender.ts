export const GENDER_LIST = [
  { id: "female", label: "여성" },
  { id: "male", label: "남성" },
  { id: "other", label: "기타" },
] as const;

export type GenderType = (typeof GENDER_LIST)[number]["id"];

export function getGenderLabel(gender: GenderType | null): string | undefined {
  return GENDER_LIST.find((g) => g.id === gender)?.label ?? undefined;
}

/**
 * API 성별 값을 GenderType으로 변환
 * @param apiGender API에서 받은 성별 값 ("M", "F", "O" 또는 "male", "female", "other")
 * @returns GenderType 또는 null
 */
export function mapApiGenderToGenderType(
  apiGender: string | undefined
): GenderType | null {
  if (!apiGender) return null;

  const genderMap: Record<string, GenderType> = {
    M: "male",
    F: "female",
    O: "other",
    male: "male",
    female: "female",
    other: "other",
  };

  return genderMap[apiGender] || null;
}

/**
 * GenderType을 API 성별 값으로 변환
 * @param gender GenderType 값
 * @returns API 성별 값 ("M", "F", "O") 또는 undefined
 */
export function mapGenderTypeToApiValue(
  gender: GenderType | null
): string | undefined {
  if (!gender) return undefined;

  const apiGenderMap: Record<GenderType, string> = {
    male: "M",
    female: "F",
    other: "O",
  };

  return apiGenderMap[gender];
}
