import type { StateStorage } from "zustand/middleware";

import {
  getPersistStorage,
  isBridgeAvailable,
  waitForBridge,
} from "@/utils/bridgeStorage";

/**
 * 일정 레벨 메모 로컬 저장 — 서버에 일정 메모 필드가 아직 없어 클라(브릿지 persistent)에 임시 저장.
 * 백엔드 필드가 생기면 서버 저장으로 이관 예정. scheduleNum 키로 앱 재시작 후에도 유지.
 */
const memoKey = (scheduleNum: number) => `schedule:memo:${scheduleNum}`;

/**
 * 저장소는 **읽고 쓰는 시점에** 고른다.
 *
 * ⚠️ 모듈 로드 시점에 `getPersistStorage()` 를 잡아두면 안 된다.
 *    앱에서는 RN 브릿지(window.BarogagiApp) 주입이 화면 코드보다 늦을 수 있는데,
 *    그 순간 브라우저 저장소(WebView localStorage)로 굳어 그 실행 내내 유지된다.
 *    → 앱을 켤 때마다 저장 위치가 달라져 어제 쓴 메모가 오늘 안 보인다.
 *    토큰 쪽(`tokenCache.bootstrapTokens`)이 `waitForBridge` 를 먼저 기다리는 것과 같은 이유.
 *
 * 메모를 읽고 쓰는 시점은 일정 상세 화면 진입 이후라 대기 비용은 사실상 없다
 * (브라우저면 즉시 반환, 앱이면 이미 주입돼 있다).
 */
const resolveStorage = async (): Promise<StateStorage> => {
  await waitForBridge();
  return getPersistStorage("persistent");
};

/**
 * 예전에 브라우저 저장소로 새어나간 메모를 **꺼내면서 지운다**.
 *
 * 저장소를 모듈 로드 시점에 잡던 시절, 앱에서도 메모가 localStorage 에 저장된 적이 있다.
 * 그대로 두면 이번 수정 이후 그 메모들이 안 보이게 되므로 읽을 때 옮겨온다.
 * 브라우저에서는 어차피 같은 저장소를 쓰므로 하지 않는다.
 *
 * ⚠️ **네이티브에 값이 있어도 반드시 호출해 잔재를 치워야 한다.**
 *    "네이티브가 비었을 때만" 뒤지게 두면, 나중에 사용자가 메모를 지워 네이티브가
 *    비는 순간 남아 있던 잔재가 다시 딸려 올라온다(= 지운 메모가 부활).
 */
const takeLegacyMemo = (key: string): string | null => {
  if (!isBridgeAvailable()) return null;

  try {
    const legacy = localStorage.getItem(key);
    if (!legacy) return null;
    localStorage.removeItem(key);
    return legacy;
  } catch {
    return null; // WebView 가 localStorage 를 막아둔 경우
  }
};

export const getScheduleMemo = async (scheduleNum: number): Promise<string> => {
  const key = memoKey(scheduleNum);
  try {
    const storage = await resolveStorage();
    // 네이티브 값보다 먼저 잔재를 걷어낸다 — 남겨두면 나중에 되살아난다
    const legacy = takeLegacyMemo(key);
    const saved = await storage.getItem(key);

    // 빈 문자열도 "저장된 값"이다. 없을 때만 null 이 온다
    if (saved !== null) return saved;
    if (legacy === null) return "";

    await storage.setItem(key, legacy);
    return legacy;
  } catch (err) {
    // 메모는 임시 로컬 저장이라 실패해도 화면은 계속 떠야 한다
    console.error("일정 메모 불러오기 실패", err);
    return "";
  }
};

export const setScheduleMemo = async (
  scheduleNum: number,
  memo: string
): Promise<void> => {
  const trimmed = memo.trim();
  try {
    const storage = await resolveStorage();
    if (trimmed) {
      await storage.setItem(memoKey(scheduleNum), trimmed);
    } else {
      await storage.removeItem(memoKey(scheduleNum));
    }
  } catch (err) {
    // 브릿지 저장 실패를 흡수해 unhandled rejection 방지 (메모는 임시 로컬 저장이라 치명적이지 않음)
    console.error("일정 메모 저장 실패", err);
  }
};
