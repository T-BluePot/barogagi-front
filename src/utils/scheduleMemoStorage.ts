import { getPersistStorage } from "@/utils/bridgeStorage";

/**
 * 일정 레벨 메모 로컬 저장 — 서버에 일정 메모 필드가 아직 없어 클라(브릿지 persistent)에 임시 저장.
 * 백엔드 필드가 생기면 서버 저장으로 이관 예정. scheduleNum 키로 앱 재시작 후에도 유지.
 */
const storage = getPersistStorage("persistent");
const memoKey = (scheduleNum: number) => `schedule:memo:${scheduleNum}`;

export const getScheduleMemo = async (scheduleNum: number): Promise<string> =>
  (await storage.getItem(memoKey(scheduleNum))) ?? "";

export const setScheduleMemo = async (
  scheduleNum: number,
  memo: string
): Promise<void> => {
  const trimmed = memo.trim();
  if (trimmed) {
    await storage.setItem(memoKey(scheduleNum), trimmed);
  } else {
    await storage.removeItem(memoKey(scheduleNum));
  }
};
