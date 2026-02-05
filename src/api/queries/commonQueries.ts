/**
 * 기타(Common) 관련 API 요청 함수 (태그, 지역, 인증, 약관, 장소)
 */
import { http } from "../http";
import { ENDPOINTS } from "../endpoints";
import { getApiKey } from "../apiKey";

import type { BaseResponse, TermsProcessRequestType } from "../types";
import type { TermsResponseType } from "../types";

// === Tag ===
export const searchTags = async (data: unknown) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.TAG.SEARCH,
    data
  );
  return response.data;
};

// === Region ===
export const searchRegions = async (query: string) => {
  const response = await http.get<BaseResponse<unknown>>(
    ENDPOINTS.REGION.SEARCH,
    { params: { regionQuery: query } }
  );
  return response.data;
};

export const getGeocode = async (regionNum: number) => {
  const response = await http.get<BaseResponse<unknown>>(
    ENDPOINTS.REGION.GEOCODE,
    { params: { regionNum } }
  );
  return response.data;
};

// === Verification ===
export const sendVerificationCode = async (data: unknown) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.VERIFICATION.SEND,
    data
  );
  return response.data;
};

export const verifyVerificationCode = async (data: unknown) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.VERIFICATION.VERIFY,
    data
  );
  return response.data;
};

// === Terms ===
export const getTermsList = async (type?: string) => {
  const response = await http.get<BaseResponse<TermsResponseType>>(
    ENDPOINTS.TERMS.LIST,
    {
      params: { termsType: type },
      headers: {
        // Swagger에서 요구하는 헤더 이름 그대로
        "API-KEY": getApiKey(),
      },
    }
  );

  return response.data;
};

export const agreeTerms = async (
  userId: string,
  termsAgreeList: TermsProcessRequestType[]
) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.TERMS.AGREE,
    {
      apiSecretKey: getApiKey(),
      userId: userId,
      termsAgreeList: termsAgreeList,
    }
  );
  return response.data;
};

// === Place ===
export const searchPlaces = async (keyword: string) => {
  const response = await http.get<BaseResponse<unknown>>(
    ENDPOINTS.PLACE.SEARCH,
    { params: { searchKeyword: keyword } }
  );
  return response.data;
};
