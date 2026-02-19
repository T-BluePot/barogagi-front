/**
 * 메인 홈(Home) 관련 API 타입 정의
 */

/** 유저 일정 요약 정보 */
export interface UserInfoResponseDTO {
  scheduleNum: number;
  scheduleNm: string;
  startDate: string;
  planNum: number;
  categoryNm: string;
}

/** 태그 정보 */
export interface TagInfoDTO {
  tagNum: number;
  tagNm: string;
  tagType: string;
}

/** 지역 정보 */
export interface RegionInfoDTO {
  regionLevel1: string;
  regionLevel2: string;
  regionLevel3: string;
  regionLevel4: string;
}

/** GET /api/v1/home/me/schedules 응답 타입 */
export interface HomeScheduleResponseDTO {
  resultCode: string;
  message: string;
  userInfoResponseDTO: UserInfoResponseDTO | null;
  tagInfoList: TagInfoDTO[];
  regionInfoDTO: RegionInfoDTO | null;
}

/** GET /api/v1/home/tags/popular 응답 타입 */
export interface PopularTagResponseDTO {
  resultCode: string;
  message: string;
  tagInfoList: TagInfoDTO[];
}
