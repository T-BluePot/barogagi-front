import { getRoutePath } from "@/constants/routes";

/**
 * 서버가 발급하는 공유 링크를 사용자에게 보낼 수 있는 페이지 주소로 변환한다.
 *
 * 서버가 주는 값은 **API 엔드포인트 주소**다:
 *   https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H
 *
 * 이 주소는 API-KEY 헤더를 요구하므로 브라우저로 그냥 열면 500 이 떨어진다(실측 확인).
 * 즉 이대로 카톡에 보내면 상대는 일정이 아니라 에러 JSON 을 본다.
 * 그래서 토큰만 떼어내 같은 오리진의 SPA 라우트로 재조립한다:
 *   https://test.fitpl.xyz/share/8OD5dVzR8c1H
 *
 * 오리진 선택:
 * - 배포 빌드 → **서버 응답의 오리진**을 쓴다. 서버가 environment 값에 맞는 배포 도메인을
 *   넣어주므로 그대로 공유 가능한 링크가 된다.
 * - 개발 빌드 → **현재 오리진(localhost)** 을 쓴다. 서버가 주는 배포 도메인에는 아직
 *   이 코드가 배포되지 않았을 수 있어, 그 링크를 열면 구버전 앱으로 떨어진다.
 *   로컬에서 바로 클릭해 확인할 수 있도록 현재 오리진으로 조립한다.
 *
 * @returns 변환된 페이지 주소. 형식이 예상과 다르면 null.
 */
export const toSharePageUrl = (apiShareUrl: string): string | null => {
  try {
    const url = new URL(apiShareUrl);
    const token = url.pathname.split("/").filter(Boolean).pop();
    if (!token) return null;

    const origin = import.meta.env.DEV ? window.location.origin : url.origin;
    return `${origin}${getRoutePath.share.view(token)}`;
  } catch {
    // URL 형식이 아니면(서버 스펙 변경 등) 조용히 실패시켜 호출부가 에러 UI 를 띄우게 한다
    return null;
  }
};

/** 공유 링크(API 주소)에서 shareToken 만 추출한다. */
export const extractShareToken = (apiShareUrl: string): string | null => {
  try {
    const token = new URL(apiShareUrl).pathname.split("/").filter(Boolean).pop();
    return token ?? null;
  } catch {
    return null;
  }
};
