/**
 * 서버가 발급한 공유 링크를 실제로 열 수 있는 주소로 정리한다.
 *
 * 서버는 이미 사용자용 페이지 주소를 내려준다:
 *   https://test.fitpl.xyz/share/8OD5dVzR8c1H
 *
 * - 배포 빌드: 서버 URL 을 그대로 쓴다(그대로 공유 가능한 링크).
 * - 개발 빌드: 경로는 두고 오리진만 현재(localhost)로 바꾼다. 서버가 준 배포 도메인에는
 *   아직 로컬 변경이 배포돼 있지 않아, 그 링크를 열면 구버전 앱으로 떨어지기 때문이다.
 *   로컬에서 바로 클릭해 공유 뷰를 확인할 수 있게 한다.
 *
 * @returns 정리된 페이지 주소. URL 형식이 아니면 null(호출부가 에러 UI 를 띄운다).
 */
export const toSharePageUrl = (serverShareUrl: string): string | null => {
  try {
    const url = new URL(serverShareUrl);
    if (!import.meta.env.DEV) return serverShareUrl;
    return `${window.location.origin}${url.pathname}${url.search}`;
  } catch {
    return null;
  }
};
