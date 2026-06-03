import type { SettingToggleConfig } from "@/types/settingsTypes";

/** 설정 페이지 공통 텍스트 */
export const SETTINGS_PAGE_TEXT = {
  NOTIFICATION_SECTION: {
    TITLE: "알림",
  },
  ERROR: "설정을 불러오지 못했습니다.",
};

/**
 * 알림 설정 토글 항목 구성 (서버 settingType 기준)
 * - 설정 항목이 추가되면 이 배열에만 항목을 추가하면 화면에 반영된다.
 */
export const NOTIFICATION_SETTINGS: SettingToggleConfig[] = [
  {
    type: "PUSH_NOTIFICATION",
    label: "알림 수신",
    description: "일정 및 서비스 관련 푸시 알림을 받아요.",
  },
  {
    type: "MARKETING_NOTIFICATION",
    label: "마케팅 정보 수신",
    description: "이벤트·혜택 등 마케팅 정보 알림을 받아요.",
  },
];
