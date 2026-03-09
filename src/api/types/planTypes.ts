import type { PlanSource, TagType } from "@/types/api/scheduleTypes";

/**
 * 일정(Schedule) 관련 API 타입 정의
 */

/** 태그 정보 */
export interface TagReqType {
  tagType: TagType;
  categoryNum: number | null;
}

export interface TagRegistReqDTO {
  tagNum: number;
  tagNm?: string;
}

export interface TagRegistResDTO {
  tagNum: number;
  tagNm?: string;
}

/** 지역 정보 */
export interface RegionRegistReqDTO {
  regionNum: number;
  regionLevel1?: string;
  regionLevel2?: string;
  regionLevel3?: string;
  regionLevel4?: string;
}

/** 사용자가 수동 추가한 장소 정보 */
export interface UserAddedPlaceDTO {
  placeName: string;
  placeUrl?: string;
  addressName?: string;
}

/** 세부 일정(Plan) 요청 DTO */
export interface PlanRegistReqDTO {
  startTime?: string; // HH:mm
  endTime?: string;
  itemNum?: number;
  categoryNum?: number;
  regionRegistReqDTOList?: RegionRegistReqDTO[];
  planTagRegistReqDTOList?: TagRegistReqDTO[];
  isRandomCategory?: "Y" | "N";
  isUserAdded?: "Y" | "N";
  userAddedPlaceDTO?: UserAddedPlaceDTO;
  planNm?: string;
}

/** 일정(Schedule) 생성 요청 DTO (POST /schedule/create) */
export interface ScheduleRegistReqDTO {
  scheduleNm: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  comment?: string;
  scheduleTagRegistReqDTOList?: TagRegistReqDTO[];
  scheduleRegionRegistReqDTOList?: RegionRegistReqDTO[];
  planRegistReqDTOList?: PlanRegistReqDTO[];
}

/** 세부 일정(Plan) 응답 DTO */
export interface PlanRegistResDTO {
  planSource: PlanSource;
  startTime: string;
  endTime: string;
  itemNum: number;
  itemNm: string;
  categoryNum: number;
  categoryNm: string;
  planNum?: number;
  planNm?: string;
  planLink?: string;
  planDescription?: string;
  planAddress?: string;
  regionNm?: string;
  regionNum: number;
  planTagRegistResDTOList: TagRegistResDTO[];
}

/** 일정(Schedule) 응답 DTO (POST /schedule/save, GET /schedule/detail 등) */
export interface ScheduleRegistResDTO {
  scheduleNum: number;
  scheduleNm: string;
  startDate: string;
  endDate: string;
  scheduleTagRegistResDTOList: TagRegistResDTO[];
  planRegistResDTOList: PlanRegistResDTO[];
}

/** 일정 카테고리 응답 타입 */
export interface ScheduleCategoryResponseType {
  categoryNum: number;
  categoryNm: string;
}

/** 일정 카테고리 상세 응답 타입 */
export interface ScheduleCategoryItemResponseType {
  itemNum: number;
  itemNm: string;
}
