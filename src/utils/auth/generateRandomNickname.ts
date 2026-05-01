/**
 * 랜덤 닉네임 생성 util
 * - 형식: 유저-MMDD-xxxx
 */
export const generateRandomNickname = (): string => {
  const prefix = "유저";

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const randomAlpha = Math.random().toString(36).slice(2, 6);

  return `${prefix}-${month}${day}-${randomAlpha}`;
};
