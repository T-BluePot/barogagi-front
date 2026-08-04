/**
 * 기타(Common) 관련 API 요청 함수 (태그, 지역, 인증, 약관, 장소)
 */
import { apiKeyHttp } from "../client";
import { ENDPOINTS } from "../endpoints";

// === type ===
import type {
  BaseResponse,
  TermsProcessRequestType,
  ScheduleCategoryResponseType,
  ScheduleCategoryItemResponseType,
  TermsResponseType,
  TagReqType,
  TagRegistResDTO,
  KakaoPlaceDTO,
} from "../types";
import type { RegionSearchItemType } from "@/types/api/scheduleTypes";

// === Tag ===
export const searchTags = async (data: TagReqType) => {
  const response = await apiKeyHttp.post<BaseResponse<TagRegistResDTO[]>>(
    ENDPOINTS.TAG.SEARCH,
    data
  );
  return response.data;
};

// === Region: 지역 검색 ===
export const searchRegions = async (query: string) => {
  const response = await apiKeyHttp.get<BaseResponse<RegionSearchItemType[]>>(
    ENDPOINTS.REGION.SEARCH,
    { params: { regionQuery: query } }
  );
  return response.data;
};

// === Place: 카카오 api 장소 검색 ===
export const searchPlaces = async (keyword: string) => {
  const response = await apiKeyHttp.get<BaseResponse<KakaoPlaceDTO[]>>(
    ENDPOINTS.PLACE.SEARCH,
    { params: { searchKeyword: keyword } }
  );
  return response.data;
};

export const getGeocode = async (regionNum: number) => {
  const response = await apiKeyHttp.get<BaseResponse<unknown>>(
    ENDPOINTS.REGION.GEOCODE,
    { params: { regionNum } }
  );
  return response.data;
};

// === Verification ===

/**
 * 전화번호 중복 확인
 *
 * `handleTelError` 가 S400(중복)·C101·A100·COMMON-500 을 모달/toast 로 인라인 처리한다
 * (VerifyPage). 전역 승격되면 인라인 에러와 전체화면이 이중 노출되고,
 * 오류 화면은 래치라 앱 재실행 전까지 가입 플로우로 못 돌아온다.
 * → 승격에서 제외한다. (QA 시나리오 h — docs/qa-error-screen.md)
 */
export const checkTel = async (tel: string) => {
  const response = await apiKeyHttp.get<BaseResponse<unknown>>(
    ENDPOINTS.USERS.CHECK_TEL,
    { params: { tel }, _skipGlobalError: true }
  );
  return response.data;
};

export const sendVerificationCode = async (data: unknown) => {
  const response = await apiKeyHttp.post<BaseResponse<unknown>>(
    ENDPOINTS.VERIFICATION.SEND,
    data
  );
  return response.data;
};

export const verifyVerificationCode = async (data: unknown) => {
  const response = await apiKeyHttp.post<BaseResponse<unknown>>(
    ENDPOINTS.VERIFICATION.VERIFY,
    data
  );
  return response.data;
};

// === Terms ===

/**
 * 약관 목록 조회
 *
 * 실패 시 `TermsPage` 가 `ErrorModal` 로 안내하고 랜딩으로 되돌린다.
 * → 전역 오류 화면 승격에서 제외한다.
 */
export const getTermsList = async (type?: string) => {
  const response = await apiKeyHttp.get<BaseResponse<TermsResponseType>>(
    ENDPOINTS.TERMS.LIST,
    {
      params: { termsType: type },
      _skipGlobalError: true,
    }
  );

  return response.data;
};

export const agreeTerms = async (
  userId: string,
  termsAgreeList: TermsProcessRequestType[],
  type?: string
) => {
  const response = await apiKeyHttp.post<BaseResponse<unknown>>(
    ENDPOINTS.TERMS.AGREE,
    {
      userId: userId,
      termsAgreeList: termsAgreeList,
      termsType: type,
    }
  );
  return response.data;
};

/** 일정 카테고리 */
export const getScheduleCategories = async () => {
  const response = await apiKeyHttp.get<
    BaseResponse<ScheduleCategoryResponseType[]>
  >(ENDPOINTS.CATEGORY.LIST);
  return response.data;
};

/** 일정 카테고리 상세 조회 */
export const getScheduleCategoryDetail = async (categoryNum: number) => {
  const response = await apiKeyHttp.get<
    BaseResponse<ScheduleCategoryItemResponseType[]>
  >(ENDPOINTS.ITEM.LIST, {
    params: { categoryNum },
  });
  return response.data;
};
