import type { SettingItemDTO, SettingValue } from "@/api/types";
import type { SettingsState } from "@/types/settingsTypes";

/** "ON" | true → true, "OFF" | false → false, 그 외 → undefined */
const parseValue = (raw: unknown): boolean | undefined => {
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "string") {
    const v = raw.trim().toUpperCase();
    if (v === "ON" || v === "TRUE" || v === "Y") return true;
    if (v === "OFF" || v === "FALSE" || v === "N") return false;
  }
  return undefined;
};

/** 배열 형태의 설정 항목들을 SettingsState 로 변환 */
const fromItemList = (items: SettingItemDTO[]): SettingsState => {
  const state: Record<string, boolean> = {};
  for (const item of items) {
    const key = item?.settingType ?? item?.type;
    const value = parseValue(item?.value ?? item?.status);
    if (typeof key === "string" && value !== undefined) {
      state[key] = value;
    }
  }
  return state as SettingsState;
};

/**
 * 설정 목록 조회(GET) 응답 data 를 UI 상태(SettingsState)로 정규화
 *
 * 응답 형태가 명세에 구체화되어 있지 않아 가능한 형태를 방어적으로 처리한다.
 *   (1) 배열         : [{ settingType, value }, ...]
 *   (2) 래핑된 배열  : { settings | settingList | list: [...] }
 *   (3) 객체 맵      : { PUSH_NOTIFICATION: "ON", ... }
 *
 * 서버가 실제로 내려준 항목만 매핑한다.
 * (미존재 항목의 기본값 ON 처리는 UI 렌더 시점에서 수행)
 */
export const toSettingsState = (data: unknown): SettingsState => {
  if (!data) return {};

  if (Array.isArray(data)) return fromItemList(data as SettingItemDTO[]);

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;

    // (2) 래핑된 배열
    const wrapped = obj.settings ?? obj.settingList ?? obj.list;
    if (Array.isArray(wrapped)) return fromItemList(wrapped as SettingItemDTO[]);

    // (3) 객체 맵
    const state: Record<string, boolean> = {};
    for (const [key, raw] of Object.entries(obj)) {
      const value = parseValue(raw);
      if (value !== undefined) state[key] = value;
    }
    return state as SettingsState;
  }

  return {};
};

/** boolean 토글 상태를 서버 enum 값으로 변환 */
export const toSettingValue = (isOn: boolean): SettingValue =>
  isOn ? "ON" : "OFF";
