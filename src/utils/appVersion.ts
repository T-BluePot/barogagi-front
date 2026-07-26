import { isNativeApp, waitForBridge } from "./bridgeStorage";

/**
 * 앱 버전 비교 유틸.
 *
 * ⚠️ 임계값(minVersion / latestVersion)은 이 파일이 알 수 없다.
 *    서버 정책 API 도, 확정 스펙도 아직 없다 → **인자로만 받고 기본값·더미값을 넣지 않는다.**
 */

/**
 * dot 구분 버전 문자열을 비교한다.
 *
 * - `a > b` → 1 / `a < b` → -1 / 같으면 0
 * - 자리수가 다르면 부족한 쪽을 0 으로 패딩한다 (`"1.2"` === `"1.2.0"`)
 * - 숫자로 변환할 수 없는 세그먼트(`"1.2.1-beta"` 의 `"1-beta"` 등)는 0 으로 취급한다.
 *   throw 하지 않는 것이 중요하다 — 버전 문자열 하나 때문에 부팅이 깨지면 안 된다.
 */
export const compareVersion = (a: string, b: string): number => {
  const parse = (v: string): number[] =>
    v
      .trim()
      .split(".")
      .map((segment) => {
        const n = Number.parseInt(segment, 10);
        return Number.isNaN(n) ? 0 : n;
      });

  const left = parse(a);
  const right = parse(b);
  const length = Math.max(left.length, right.length);

  for (let i = 0; i < length; i += 1) {
    const l = left[i] ?? 0;
    const r = right[i] ?? 0;
    if (l !== r) return l > r ? 1 : -1;
  }
  return 0;
};

/** `current` 가 `target` 보다 낮은 버전인지 */
export const isVersionBelow = (current: string, target: string): boolean =>
  compareVersion(current, target) < 0;

/**
 * 현재 앱 버전을 브릿지로 조회한다.
 *
 * 반환 `null` 은 **"버전 미확인"** 이다. 호출부는 이때 아무 안내도 띄우지 않는다.
 * null 이 되는 경우:
 * - 웹 브라우저 직접 접속 (앱이 아니므로 업데이트 개념이 없다)
 * - `getAppVersion` 이 없는 구버전 앱 (이 RPC 는 앱 신규 배포 후부터 존재한다)
 * - 브릿지 호출 실패
 */
export const getCurrentAppVersion = async (): Promise<string | null> => {
  // 부팅 직후에는 브릿지 주입이 페이지 스크립트보다 늦을 수 있다 (bootstrapTokens 와 같은 이유)
  await waitForBridge();

  if (typeof window.BarogagiApp?.getAppVersion === "function") {
    try {
      const version = await window.BarogagiApp.getAppVersion();
      if (version) return version;
    } catch (err) {
      // 조회 실패로 부팅을 막지 않는다 — throw 대신 null
      console.error("[appVersion] getAppVersion 실패", err);
    }
    return null;
  }

  // 앱이 아니면(웹 브라우저) 업데이트 안내 대상이 아니다
  if (!isNativeApp()) return null;

  // 앱이지만 RPC 가 없는 구버전. dev 편의용 fallback 만 허용한다(운영에서는 보통 미설정).
  return import.meta.env.VITE_APP_VERSION ?? null;
};
