/**
 * 앱 설정(Settings) 관련 API 타입 정의
 *
 * 참고 (Swagger 명세)
 * - GET   /api/v1/settings                          설정 목록 조회 (성공: S200)
 * - PATCH /api/v1/settings/{settingType}/{value}    설정 수정     (성공: S202 / 실패: S400)
 *
 * settingType / value 는 명세상 enum 으로 고정되어 있으나,
 * 설정 목록 조회(GET)의 응답 data 형태는 명세에 구체화되어 있지 않다.
 * 서버가 추후 설정 항목을 추가할 수 있어, 실제 변환은 매퍼(settingsMapper)에서
 * 방어적으로 처리한다.
 */

/** 설정 항목 종류 (Swagger enum) */
export type SettingType = "PUSH_NOTIFICATION" | "MARKETING_NOTIFICATION";

/** 설정 값 (Swagger enum) */
export type SettingValue = "ON" | "OFF";

/**
 * 설정 목록 조회(GET) 응답의 개별 항목 추정 타입
 * - 응답 data 형태가 명세에 명시되지 않아, 서버가 내려줄 수 있는 키를 optional 로 정의
 * - 실제 매핑은 settingsMapper 에서 방어적으로 수행
 */
export interface SettingItemDTO {
  settingType?: SettingType | string;
  /** settingType 의 대체 키 가능성 대비 */
  type?: SettingType | string;
  value?: SettingValue | string;
  /** value 의 대체 키 가능성 대비 */
  status?: SettingValue | string;
}
