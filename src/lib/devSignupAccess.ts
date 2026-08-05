/**
 * 회원가입 화면 직접 접근 (개발/QA 전용)
 *
 * 회원가입은 약관 → 아이디/비밀번호 → 휴대폰 인증 → 프로필 순서로만 진행되도록
 * 단계 가드가 걸려 있어서, 특정 화면만 확인하려 해도 매번 앞 단계를 다 거쳐야 한다.
 * 이 플래그가 켜지면 그 가드들을 건너뛰고 URL 로 바로 진입할 수 있다.
 *
 * 활성화 조건:
 *   1) 개발 모드(`import.meta.env.DEV`)
 *   2) `TOGGLE_ALLOWED_HOSTS` 에 있는 도메인 + URL 쿼리에 `?devSignup`
 *
 * ⚠️ `?debug`(eruda)와 달리 **도메인 제한을 둔다.** 콘솔 노출과 달리 이건 화면 진입
 *    순서를 바꾸는 동작이라, 운영 도메인에서 URL 만으로 켜지면 안 된다.
 *    운영에서는 쿼리를 붙여도 무시된다.
 *
 * 한 번 `?devSignup` 으로 켜면 sessionStorage 에 남아 **탭을 닫을 때까지 유지**된다.
 * react-router 의 `navigate()` 가 쿼리를 버리기 때문에, 이게 없으면 화면을 한 번
 * 이동하는 순간 플래그가 사라져 가드가 다시 튕겨낸다.
 * (sessionStorage 는 origin 단위라 테스트 도메인에서 켠 값이 운영으로 넘어가지 않는다.)
 *
 * ⚠️ 개발 모드에서는 **항상 켜져 있다** — 로컬에서는 가드가 동작하는 모습을 볼 수 없다.
 *    가드 자체를 검증하려면 운영과 같은 빌드로 확인한다: `npm run build && npm run preview`
 *    (쿼리를 붙이지 않으면 preview 에서는 꺼진 상태다.)
 *
 * 🚫 이 플래그로 **인증 토큰을 만들 수는 없다.** 우회하는 것은 "단계 순서"뿐이고,
 *    로그인이 필요한 화면은 여전히 로그인해야 한다.
 */

const STORAGE_KEY = "devSignupAccess";
const QUERY_KEY = "devSignup";

/**
 * `?devSignup` 쿼리를 받아줄 도메인 목록. **여기 없으면 운영으로 간주**하고 무시한다.
 * 스테이징 도메인이 늘면 여기에 한 줄 추가한다.
 */
const TOGGLE_ALLOWED_HOSTS = [
  "localhost",
  "127.0.0.1",
  "test.fitpl.xyz",
] as const;

const isToggleAllowedHost = (): boolean =>
  (TOGGLE_ALLOWED_HOSTS as readonly string[]).includes(
    window.location.hostname
  );

let hasWarned = false;

/** 켜져 있을 때 한 번만 경고를 남긴다 — 우회가 조용히 동작하면 QA 결과를 오해하게 된다 */
const warnOnce = (): void => {
  if (hasWarned) return;
  hasWarned = true;
  console.warn(
    "[devSignupAccess] 회원가입 단계 가드가 우회된 상태입니다. 운영 도메인에서는 동작하지 않습니다."
  );
};

/**
 * 회원가입 단계 가드를 건너뛸지 여부.
 *
 * 렌더 중에 호출되므로 부수효과는 sessionStorage 쓰기와 경고 로그뿐이며, 둘 다 멱등이다.
 */
export const isSignupAccessBypassed = (): boolean => {
  if (import.meta.env.DEV) {
    warnOnce();
    return true;
  }

  if (typeof window === "undefined") return false;

  // 운영 도메인에서는 쿼리를 붙여도, 예전에 켜둔 sessionStorage 값이 있어도 켜지지 않는다
  if (!isToggleAllowedHost()) return false;

  try {
    if (new URLSearchParams(window.location.search).has(QUERY_KEY)) {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    }

    const enabled = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    if (enabled) warnOnce();
    return enabled;
  } catch {
    // 시크릿 모드·저장소 차단 환경에서는 sessionStorage 접근이 throw 한다.
    // 우회는 부가 기능이므로 조용히 꺼진 것으로 취급한다.
    return false;
  }
};
