import type { SettingType } from "@/api/types";

/**
 * 설정 화면의 토글 상태
 * - 서버가 실제로 내려준 항목만 키로 가진다. (미존재 항목은 키 없음)
 * - 미존재 항목의 기본값(ON) 처리는 UI 렌더 시점에서 수행한다.
 */
export type SettingsState = Partial<Record<SettingType, boolean>>;

/** 설정 토글 항목 UI 구성 */
export interface SettingToggleConfig {
  /** 서버 설정 종류 (PATCH path parameter 로 사용) */
  type: SettingType;
  /** 화면에 노출할 라벨 */
  label: string;
  /** 부가 설명 (선택) */
  description?: string;
}
