import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { scheduleKeys } from "@/api/keyFactories";
import { getSharedSchedule } from "@/api/queries";
import type { BaseResponse } from "@/api/types";
import { SHARE_TEXT } from "@/constants/texts/main/share";

/**
 * 공유 링크가 만료됐거나 존재하지 않을 때 서버가 내려주는 응답 코드.
 * 만료와 미존재가 같은 코드로 합쳐져 있어 구분하지 않는다(백엔드와 합의).
 */
export const SHARE_EXPIRED_CODE = "SS400";

/** 만료·미존재 링크를 다른 에러와 구분하기 위한 전용 에러 */
export class ShareLinkExpiredError extends Error {
  constructor(message?: string) {
    super(message ?? SHARE_TEXT.LINK_ERROR);
    this.name = "ShareLinkExpiredError";
  }
}

/** 응답 바디에서 code 를 안전하게 추출 (HTTP 2xx/에러 응답 공통) */
const readCode = (data: unknown): string | undefined =>
  (data as BaseResponse<unknown> | undefined)?.code;

/**
 * 공유 링크로 진입한 일정 조회 훅 (비로그인 사용자 대상)
 *
 * 에러 코드 분기 주의:
 * - 만료/없는 링크는 code "SS400" 으로 온다.
 * - 백엔드가 오류를 실제 HTTP status(예: 404)로 내려주도록 바뀌어, axios 가 throw 한다.
 *   따라서 정상 응답의 code 검사뿐 아니라 **AxiosError 응답 바디의 code 도** 함께 본다.
 *   (예전엔 실패도 HTTP 200 이라 code 만 봤으나 지금은 status + code 둘 다 고려)
 *
 * 응답 data 는 기존 일정 상세와 동일한 ScheduleDetailResDTO 구조다.
 */
export const useSharedScheduleQuery = (shareToken: string | undefined) => {
  const query = useQuery({
    queryKey: scheduleKeys.sharedView(shareToken ?? ""),
    queryFn: async () => {
      try {
        const res = await getSharedSchedule(shareToken as string);

        if (res.code === SHARE_EXPIRED_CODE) {
          throw new ShareLinkExpiredError(res.message);
        }
        if (!res.code.startsWith("S")) {
          throw new Error(res.message ?? SHARE_TEXT.LINK_ERROR);
        }
        return res.data;
      } catch (err) {
        if (err instanceof ShareLinkExpiredError) throw err;

        // 만료/미존재가 HTTP 4xx 로 오면 axios 가 throw → 바디 code 로 만료를 판별
        if (err instanceof AxiosError) {
          const body = err.response?.data as BaseResponse<unknown> | undefined;
          if (readCode(body) === SHARE_EXPIRED_CODE) {
            throw new ShareLinkExpiredError(body?.message);
          }
        }
        throw err;
      }
    },
    enabled: Boolean(shareToken),
    // 만료·미존재 링크는 재시도해도 결과가 바뀌지 않는다
    retry: false,
  });

  return {
    schedule: query.data,
    isLoading: query.isLoading,
    /** 만료됐거나 존재하지 않는 링크 — 전용 Empty State 를 띄울 것 */
    isExpired: query.error instanceof ShareLinkExpiredError,
    isError: query.isError,
  };
};
