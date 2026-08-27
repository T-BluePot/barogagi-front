/**
 * 기기 식별자(deviceId) 발급 유틸
 *
 * 서버는 회원 한 명의 기기들을 이 값으로 구분한다.
 *   - 로그인 / 비밀번호 재설정 body 의 `deviceId`
 *   - OAuth authorize URL 의 `?deviceId=`
 *   - FCM 토큰 저장/삭제의 `deviceType` 필드
 *     ⚠️ 이름은 `deviceType` 이지만 기기 *종류* 가 아니라 이 값(기기 고유 식별자)을 넣는다.
 *        백엔드 API 문서상 로그인의 `deviceId` 와 설명이 동일하다.
 *
 * 값의 출처는 두 가지고, 어느 쪽인지 `source` 로 구분해 함께 저장한다.
 *   - "native": RN 브릿지 `getDeviceId()` — 기기에 묶인 값이라 앱 재설치에도 유지된다
 *   - "local":  웹이 생성한 UUID — 앱 데이터가 지워지면 소실된다
 *
 * `source` 를 왜 들고 있냐면, "local" 로 시작한 기기가 나중에 네이티브 지원을 받게 됐을 때
 * 정확한 값으로 **승격**할 대상인지 판단해야 하기 때문이다. 승격 절차는 아래 주의사항 참고.
 *
 * ⚠️ 한 번 발급된 값은 함부로 바꾸지 않는다.
 *    deviceId 가 바뀌면 서버는 그것을 새 기기로 인식한다. 그런데 앱 업데이트로는 FCM 토큰이
 *    갱신되지 않으므로, 같은 FCM 토큰이 옛 기기 행과 새 기기 행에 **동시에** 남는다.
 *    → 같은 기기에 푸시가 두 번 간다.
 *    그래서 승격은 "옛 deviceId 로 서버 등록을 지우는 데 성공했을 때만" 수행해야 한다.
 *    (교체 자체는 `replaceDeviceId()` 가 하고, 삭제 선행은 호출부 책임이다)
 */

import { isBridgeAvailable, waitForBridge } from "./bridgeStorage";
import type { StorageNamespace } from "./bridgeStorage";

export type DeviceIdSource = "native" | "local";

export interface DeviceIdRecord {
  id: string;
  source: DeviceIdSource;
}

/** persistent 네임스페이스 저장 키. 토큰(secure)과 분리해 로그아웃에 딸려가지 않게 한다. */
const STORAGE_KEY = "deviceId";

const STORAGE_NAMESPACE: StorageNamespace = "persistent";

/**
 * deviceId 전용 저장소 접근자.
 *
 * ⚠️ 공용 `getPersistStorage()` 를 **쓰지 않는다.** 그 어댑터는 zustand persist 용이라
 *    브릿지 read 실패를 catch 해서 `null` 로 바꿔버린다(`createBridgeStorage`).
 *    그러면 "값이 없다"와 "못 읽었다"가 구분되지 않아, 일시적 실패에 기존 deviceId 를
 *    덮어쓰게 된다. 여기서는 실패를 그대로 throw 시켜 호출부가 구분하게 한다.
 *    저장 위치와 키는 동일하다 (앱: MMKV `persistent/deviceId` / 브라우저: `localStorage.deviceId`).
 *
 * ⚠️ 반드시 `waitForBridge()` 이후에 호출한다.
 *    브릿지 유무를 **부르는 시점에** 보기 때문이다. 브릿지 주입 전에 부르면 앱 안에서도
 *    localStorage 로 새고, 나중에 브릿지가 붙은 뒤 다시 읽으면 MMKV 에는 값이 없어
 *    새 deviceId 가 발급된다(= 같은 기기에 식별자 2개).
 */
const readRaw = async (): Promise<string | null> => {
  if (isBridgeAvailable()) {
    return await window.BarogagiApp!.getData(STORAGE_NAMESPACE, STORAGE_KEY);
  }
  return localStorage.getItem(STORAGE_KEY);
};

const writeRaw = async (value: string): Promise<void> => {
  if (isBridgeAvailable()) {
    await window.BarogagiApp!.saveData(STORAGE_NAMESPACE, STORAGE_KEY, value);
    return;
  }
  localStorage.setItem(STORAGE_KEY, value);
};

/**
 * UUID v4 문자열을 생성한다.
 *
 * `crypto.randomUUID()` 는 **secure context(https)에서만** 존재한다.
 * 실기기 테스트는 `vite --host` 로 띄운 `http://<사설IP>:8080` 에 접속하는 방식이라
 * 이 환경에서는 `randomUUID` 가 아예 없다 → 반드시 폴백이 필요하다.
 *
 * `crypto.getRandomValues()` 는 secure context 제약이 없어 http 에서도 동작하므로
 * 이쪽을 주 폴백으로 쓴다. 마지막 `Math.random()` 은 crypto 자체가 없는 환경 대비용이며,
 * 여기서 throw 하면 로그인 자체가 막히므로 품질을 낮추더라도 값은 반드시 돌려준다.
 */
const generateUuid = (): string => {
  const hasCrypto = typeof crypto !== "undefined";

  if (hasCrypto && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);

  if (hasCrypto && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    console.warn("[deviceId] crypto 미지원 환경 — Math.random 폴백 사용");
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  // RFC 4122 v4 규격 비트 고정
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
};

/**
 * 저장값 읽기 결과.
 *
 * "값이 없다"(empty)와 "읽지 못했다"(error)를 **반드시 구분한다.**
 * 둘을 뭉뚱그려 null 로 다루면, 저장소가 일시적으로 실패했을 때 멀쩡히 저장돼 있던
 * deviceId 위에 새 값을 덮어써 영구히 잃는다 → 서버에 유령 기기가 생기고,
 * 같은 FCM 토큰이 옛/새 기기 행에 동시에 남아 푸시가 중복 발송된다.
 */
type ReadResult =
  | { status: "found"; record: DeviceIdRecord }
  | { status: "empty" }
  | { status: "error" };

/** 저장된 레코드를 한 번 읽는다 (throw 금지 — 로그인 플로우를 막지 않는다) */
const readRecordOnce = async (): Promise<ReadResult> => {
  let raw: string | null;

  try {
    raw = await readRaw();
  } catch (err) {
    // 저장소 자체를 못 읽었다 — 값이 있는지 없는지 알 수 없으므로 덮어쓰면 안 된다
    console.error("[deviceId] 저장소 읽기 실패", err);
    return { status: "error" };
  }

  if (!raw) return { status: "empty" };

  try {
    const parsed = JSON.parse(raw) as Partial<DeviceIdRecord> | null;
    if (!parsed?.id) return { status: "empty" };

    // source 가 없거나 이상한 값이면 "local" 로 본다.
    // 잘못 "native" 로 봤다가는 승격 대상을 영영 놓치므로, 모호하면 승격 가능한 쪽으로 둔다.
    return {
      status: "found",
      record: {
        id: parsed.id,
        source: parsed.source === "native" ? "native" : "local",
      },
    };
  } catch (err) {
    // 읽기는 됐는데 내용이 깨졌다 — 어차피 못 쓰는 값이라 새로 발급해 덮어써도 잃을 게 없다
    console.error("[deviceId] 저장값 파싱 실패 — 새로 발급한다", err);
    return { status: "empty" };
  }
};

/** 레코드를 저장한다. 실패해도 throw 하지 않는다(세션 내에서는 캐시로 값이 유지된다). */
const writeRecord = async (record: DeviceIdRecord): Promise<void> => {
  try {
    await writeRaw(JSON.stringify(record));
  } catch (err) {
    console.error("[deviceId] 저장 실패", err);
  }
};

/**
 * 네이티브 브릿지에서 기기 식별자를 조회한다.
 *
 * @returns 조회된 값. 브릿지 없음 / 구버전 앱 / 조회 실패 / 빈 문자열이면 null.
 */
export const issueNativeDeviceId = async (): Promise<string | null> => {
  await waitForBridge();

  if (typeof window.BarogagiApp?.getDeviceId !== "function") return null;

  try {
    const id = await window.BarogagiApp.getDeviceId();
    return id && id.length > 0 ? id : null;
  } catch (err) {
    console.error("[deviceId] 브릿지 조회 실패", err);
    return null;
  }
};

/**
 * 진행 중/완료된 조회 결과 캐시.
 *
 * 여러 곳에서 동시에 호출해도 UUID 가 각각 생성돼 서로 덮어쓰지 않도록
 * **진행 중인 Promise 자체**를 공유한다. 저장이 실패한 경우에도 이 캐시 덕분에
 * 최소한 세션 내에서는 같은 값이 유지된다.
 */
let inflight: Promise<DeviceIdRecord> | null = null;

const resolveRecord = async (): Promise<DeviceIdRecord> => {
  // 저장소 선택이 브릿지 유무에 좌우되므로 무엇보다 먼저 기다린다 (storage() 주석 참고)
  await waitForBridge();

  let read = await readRecordOnce();
  // 읽기 실패는 일시적일 수 있다. 여기서 포기하고 새 값을 만들면 기존 값을 덮어쓰므로 한 번 더 시도한다.
  if (read.status === "error") read = await readRecordOnce();

  if (read.status === "found") return read.record;

  // 최초 1회: 네이티브 값이 있으면 그쪽이 정확하다(앱 재설치에도 유지되므로)
  const nativeId = await issueNativeDeviceId();
  const record: DeviceIdRecord = nativeId
    ? { id: nativeId, source: "native" }
    : { id: generateUuid(), source: "local" };

  if (read.status === "error") {
    // 저장돼 있는 값이 있는지 없는지 모르는 상태 → **저장하지 않는다.**
    // 이번 세션은 이 임시 값으로 동작하고(inflight 캐시), 다음 실행에서 저장소가
    // 정상화되면 원래 deviceId 로 돌아온다. 덮어쓰는 것보다 이쪽이 회복 가능하다.
    console.error(
      "[deviceId] 저장소 읽기 불가 — 임시 식별자로 이번 세션만 진행한다(저장 skip)"
    );
    return record;
  }

  await writeRecord(record);
  return record;
};

/** 기기 식별자를 출처(source)와 함께 반환한다. 승격 판단이 필요한 곳에서 쓴다. */
export const getDeviceIdRecord = (): Promise<DeviceIdRecord> => {
  if (!inflight) {
    inflight = resolveRecord().catch((err: unknown) => {
      // 실패를 캐시하면 이후 호출이 전부 같은 에러를 받는다 → 다음 호출에서 재시도되게 비운다
      inflight = null;
      throw err;
    });
  }
  return inflight;
};

/** 기기 식별자 문자열. 로그인·FCM 등록 등 대부분의 호출부가 쓰는 진입점. */
export const getDeviceId = async (): Promise<string> =>
  (await getDeviceIdRecord()).id;

/**
 * 저장된 기기 식별자를 교체한다 (local → native 승격용).
 *
 * ⚠️ 호출 전에 **옛 deviceId 로 서버의 FCM 등록을 삭제**해야 한다.
 *    그러지 않으면 같은 FCM 토큰이 옛/새 기기 행에 동시에 남아 푸시가 중복 발송된다
 *    (파일 상단 주의사항 참고). 삭제에 실패했다면 교체하지 말고 다음 기회로 미룬다.
 */
export const replaceDeviceId = async (record: DeviceIdRecord): Promise<void> => {
  await waitForBridge();
  await writeRecord(record);
  inflight = Promise.resolve(record);
};
