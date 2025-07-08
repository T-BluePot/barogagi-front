import type { NavigateFunction } from "react-router-dom";

/**
 * 히스토리 스택에 이전 페이지가 있으면 `navigate(-1)` ,
 * 없으면 지정한 경로(기본 '/')로 replace 내비게이션.
 *
 * @param navigate   react-router-dom 의 useNavigate()가 반환하는 함수
 * @param fallback   스택이 1 이하일 때 이동할 경로. 기본값 '/'
 */
export function safeBack(
  navigate: NavigateFunction,
  fallback: string = "/"
): void {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate(fallback, { replace: true });
  }
}
