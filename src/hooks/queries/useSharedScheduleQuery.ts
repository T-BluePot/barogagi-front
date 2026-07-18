import { useQuery } from "@tanstack/react-query";

import { scheduleKeys } from "@/api/keyFactories";
import { getSharedSchedule } from "@/api/queries";
import { SHARE_TEXT } from "@/constants/texts/main/share";

/**
 * 공유 링크가 만료됐거나 존재하지 않을 때 서버가 내려주는 코드.
 * 스웨거에는 없고 실측으로 확인했다. 만료와 미존재가 같은 코드로 합쳐져 있어 구분할 수 없다.
 */
export const SHARE_EXPIRED_CODE = "SS400";

/** 만료·미존재 링크를 다른 에러와 구분하기 위한 전용 에러 */
export class ShareLinkExpiredError extends Error {
  constructor(message?: string) {
    super(message ?? SHARE_TEXT.LINK_ERROR);
    this.name = "ShareLinkExpiredError";
  }
}

/**
 * 공유 링크로 진입한 일정 조회 훅 (비로그인 사용자 대상)
 *
 * 주의: 이 API 는 **실패해도 HTTP 200** 으로 내려온다.
 *   만료/없는 링크 → HTTP 200 + code "SS400" + data null
 *   따라서 res.status 가 아니라 **code 로 분기**해야 한다.
 *   (status 로 판단하면 만료 링크가 "성공"으로 처리돼 빈 화면이 뜬다)
 *
 * 응답 data 는 기존 일정 상세와 동일한 ScheduleDetailResDTO 구조다(실측 대조 완료).
 */
export const useSharedScheduleQuery = (shareToken: string | undefined) => {
  const query = useQuery({
    queryKey: scheduleKeys.sharedView(shareToken ?? ""),
    queryFn: async () => {
      const res = await getSharedSchedule(shareToken as string);

      if (res.code === SHARE_EXPIRED_CODE) {
        throw new ShareLinkExpiredError(res.message);
      }
      if (!res.code.startsWith("S")) {
        throw new Error(res.message ?? SHARE_TEXT.LINK_ERROR);
      }

      return res.data;
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
