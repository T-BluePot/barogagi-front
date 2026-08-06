import type {
  TagRegistReqDTO,
  RegionRegistReqDTO,
  UserAddedPlaceDTO,
} from "@/api/types";
import type {
  ScheduleCategoryResponseType,
  ScheduleCategoryItemResponseType,
} from "@/api/types";

export type PlanSource = "AI" | "USER_PLACE" | "USER_CUSTOM"; // 서버 응답

// 플랜 드래프트 기반 타입
export type PlanDraftBaseType = {
  source: PlanSource;
  startTime: string;
  endTime: string;
};

/** 1) 서비스/AI 기반 플랜 */
export type AIPlanDraftType = PlanDraftBaseType & {
  source: "AI";
  isUserAdded: "N";
  categoryNum?: number;
  isRandomCategory?: "Y" | "N";
  itemNum?: number;
  regionRegistReqDTOList?: RegionRegistReqDTO[];
  planTagRegistReqDTOList?: TagRegistReqDTO[];
};

/** 사용자 커스터마이징 - 기본 */
export type UserCustomPlanDraftType = PlanDraftBaseType & {
  source: "USER_CUSTOM";
  isUserAdded: "Y";
  isRandomCategory: "N";
  planNm: string;
  planTagRegistReqDTOList?: never;
};

/** 사용자 커스터마이징 - 카카오 장소 추가 */
export type UserPlacePlanDraftType = Omit<UserCustomPlanDraftType, "source"> & {
  source: "USER_PLACE";
  userAddedPlaceDTO: UserAddedPlaceDTO; // 추가
};

/**
 * 프론트 용 개별 일정
 */
export type PlanDraftType =
  | AIPlanDraftType
  | UserPlacePlanDraftType
  | UserCustomPlanDraftType;

// 지역 검색 응답 타입
export type RegionSearchItemType = {
  regionNm: string;
  regionNum: number;
};

// 일정 드래프트 타입
export type ScheduleDraftType = {
  scheduleNm?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  comment?: string; // 자유 참고사항 (원본, 서버 전송 시 아래 옵션들과 합쳐 comment로 집계)

  // 참고사항 추가 옵션 — 서버엔 별도 필드가 아니라 comment 문자열로 집계해 전송
  ages?: string[]; // 연령대 (다중)
  people?: number; // 인원수
  purpose?: string; // 목적

  scheduleTagRegistReqDTOList: TagRegistReqDTO[];
  scheduleRegionRegistReqDTOList: RegionRegistReqDTO[];
  planRegistReqDTOList: PlanDraftType[];
};

// 선택 결과로 상위에 올릴 payload
export type SelectedCategoryItemType = {
  category: ScheduleCategoryResponseType; // 카테고리(탭)
  option: ScheduleCategoryItemResponseType; // 아이템(상세 옵션)
};

export type TagType = "S" | "P";
