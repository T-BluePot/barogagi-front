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

/** 전화번호 중복 확인 */
export const checkTel = async (tel: string) => {
  const response = await apiKeyHttp.get<BaseResponse<unknown>>(
    ENDPOINTS.USERS.CHECK_TEL,
    { params: { tel } }
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
export const getTermsList = async (type?: string) => {
  const response = await apiKeyHttp.get<BaseResponse<TermsResponseType>>(
    ENDPOINTS.TERMS.LIST,
    {
      params: { termsType: type },
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
