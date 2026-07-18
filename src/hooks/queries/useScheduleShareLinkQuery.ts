import { useQuery } from "@tanstack/react-query";

import { scheduleKeys } from "@/api/keyFactories";
import { postScheduleShare } from "@/api/queries";
import { toSharePageUrl } from "@/utils/shareLink";
import { SHARE_TEXT } from "@/constants/texts/main/share";

/**
 * 일정 공유 링크 조회 훅
 *
 * 서버 호출은 POST 지만 **useQuery** 로 감싼다. 이유:
 * 서버가 호출할 때마다 **새 토큰**을 발급하기 때문에(실측 확인), 시트를 여닫을 때마다
 * 호출하면 토큰이 계속 누적된다. 일정별로 캐싱해 세션 내 재사용하는 것이 목적이라
 * "명령"보다 "조회" 시맨틱이 맞다.
 *
 * 그래서 재요청을 유발하는 옵션을 전부 끈다 — refetch 가 곧 새 토큰 발급이다.
 *
 * @param scheduleNum 공유할 일정 번호
 * @param enabled     시트가 열렸을 때만 호출하도록 제어
 */
export const useScheduleShareLinkQuery = (
  scheduleNum: number | undefined,
  enabled: boolean
) => {
  const query = useQuery({
    queryKey: scheduleKeys.share(scheduleNum ?? -1),
    queryFn: async () => {
      // enabled 가드로 여기 도달 시 scheduleNum 은 항상 유효하다
      const res = await postScheduleShare(scheduleNum as number);

      if (!res.code.startsWith("S")) {
        throw new Error(res.message ?? SHARE_TEXT.LINK_ERROR);
      }

      // 서버가 주는 값은 API 주소라 그대로 공유하면 수신자가 에러 JSON 을 본다.
      // 사용자에게 보낼 수 있는 페이지 주소로 변환한다.
      const pageUrl = toSharePageUrl(res.data);
      if (!pageUrl) {
        throw new Error(SHARE_TEXT.LINK_ERROR);
      }

      return pageUrl;
    },
    enabled: enabled && Boolean(scheduleNum) && !Number.isNaN(scheduleNum),
    // ↓ 아래 4개는 "재요청 = 새 토큰 발급"이라 반드시 꺼둘 것
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1, // 네트워크 실패만 1회 재시도 (모바일 환경 고려)
  });

  return {
    shareUrl: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
