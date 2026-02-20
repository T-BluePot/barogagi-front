import type {
  TagRegistReqDTO,
  RegionRegistReqDTO,
  UserAddedPlaceDTO,
} from "@/api/types";

export type PlanSource = "AI" | "USER_PLACE" | "USER_CUSTOM"; // 서버 응답

// 플랜 드래프트 기반 타입
type PlanDraftBaseType = {
  source: PlanSource;

  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  itemNum?: number;

  categoryNum?: number; // isRandomCategory="Y"면 빌드 시 제거
  isRandomCategory?: "Y" | "N"; // 랜덤 카테고리 옵션

  regionRegistReqDTOList?: RegionRegistReqDTO[];
};

/** 1) 서비스/AI 기반 플랜 */
export type AIPlanDraftType = PlanDraftBaseType & {
  source: "AI";
  isUserAdded: "N";
  planTagRegistReqDTOList?: TagRegistReqDTO[];
};

/** 2) 사용자 커스터마이징 - 카카오 장소 선택 */
export type UserPlacePlanDraftType = PlanDraftBaseType & {
  source: "USER_PLACE";
  isUserAdded: "Y";

  // 카카오 장소 선택 결과를 그대로 담는 위치
  userAddedPlaceDTO: UserAddedPlaceDTO;
  planTagRegistReqDTOList?: never;
};

/** 3) 사용자 커스터마이징 - 텍스트 입력 */
export type UserCustomPlanDraftType = PlanDraftBaseType & {
  source: "USER_CUSTOM";
  isUserAdded: "Y";

  // 명세: 세부일정명을 planNm에 담아 보내기
  planNm: string;
  planTagRegistReqDTOList?: never;
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
  comment?: string;

  scheduleTagRegistReqDTOList: TagRegistReqDTO[];
  planRegistReqDTOList: PlanDraftType[];
};
