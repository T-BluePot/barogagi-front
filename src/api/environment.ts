/**
 * 서버에 전달하는 배포 환경 값 (LOCAL | TEST | PROD)
 *
 * 서버는 이 값으로 발급할 공유 링크의 도메인을 결정하므로,
 * 실제로 붙어 있는 API 서버와 반드시 일치해야 한다.
 * (불일치하면 서버가 엉뚱한 도메인의 링크를 만들어 준다)
 */
export type ServerEnvironment = "LOCAL" | "TEST" | "PROD";

const isServerEnvironment = (value: unknown): value is ServerEnvironment =>
  value === "LOCAL" || value === "TEST" || value === "PROD";

/**
 * VITE_ENVIRONMENT 가 지정돼 있으면 그 값을 사용하고,
 * 없으면 기존 동작(빌드 모드 기반)을 그대로 유지한다.
 *
 * 기존 선례(authQueries.getOAuthLink)는 `import.meta.env.PROD ? "PROD" : "LOCAL"` 이라
 * boolean 특성상 TEST 를 표현할 수 없다. 테스트 서버(test.fitpl.xyz)에 붙는 빌드는
 * VITE_ENVIRONMENT=TEST 를 지정해야 서버가 올바른 도메인의 링크를 만든다.
 */
export const getEnvironment = (): ServerEnvironment => {
  const raw = import.meta.env.VITE_ENVIRONMENT;
  if (isServerEnvironment(raw)) return raw;
  return import.meta.env.PROD ? "PROD" : "LOCAL";
};
