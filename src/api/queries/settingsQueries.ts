/**
 * 앱 설정(Settings) 관련 API 요청 함수
 * 인증된 사용자 대상이므로 accessToken 이 자동 주입되는 http 인스턴스를 사용한다.
 */

import { http } from "../client";
import { ENDPOINTS } from "../endpoints";

import type { BaseResponse, SettingItemDTO, SettingType, SettingValue } from "../types";

/**
 * 설정 목록 조회
 * - 응답 data 형태가 명세에 구체화되어 있지 않아 unknown 으로 받고 매퍼에서 정규화한다.
 */
export const getSettings = async () => {
  const response = await http.get<BaseResponse<SettingItemDTO[] | unknown>>(
    ENDPOINTS.SETTINGS.LIST
  );
  return response.data;
};

/**
 * 설정 수정
 * - settingType, value 를 path parameter 로 전달 (요청 body 없음)
 */
export const updateSetting = async (
  settingType: SettingType,
  value: SettingValue
) => {
  const response = await http.patch<BaseResponse<unknown>>(
    ENDPOINTS.SETTINGS.UPDATE(settingType, value)
  );
  return response.data;
};
