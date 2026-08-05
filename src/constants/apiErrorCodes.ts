/**
 * 서버 오류 코드 단일 출처.
 *
 * 근거 문서 2종:
 * 1. 백엔드 제공 오류 코드 표 22건
 *    (`.claude/requests/260725_error-maintenance-screen/backend-error-codes.md`)
 * 2. `api-docs.json` (42개 경로) + test 서버 실측
 *
 * 코드 문자열을 다른 파일에 직접 쓰지 말고 항상 여기서 import 한다.
 *
 * ⚠️ 같은 코드 문자열이 엔드포인트마다 뜻이 다르다.
 *    `S401` 은 백엔드 표에서 "일정 저장 실패", api-docs 에서는 "생년월일 형식 오류" AND "일정 없음" 이다.
 *    → 전역 분기는 **뜻이 고정된 소수**로만 제한한다.
 */
export const API_ERROR_CODE = {
  /** 서버 오류가 발생했습니다. 백엔드 표의 **유일한 서버 장애 코드** */
  SERVER_ERROR: "COMMON-500",
  /**
   * 서버 오류(도메인별). api-docs.json 6개 엔드포인트에 선언돼 있으나
   * ⚠️ 백엔드 오류 코드 표(22건)에는 **없다** — 폐기 여부 확인 필요.
   * 확인 전까지는 critical 목록에 남긴다(빼면 진짜 장애를 놓친다).
   */
  SERVER_ERROR_C: "C500",
  /** 잘못된 접근입니다 — API KEY / API SECRET KEY 불일치 */
  INVALID_ACCESS: "A100",
  /** 접근 권한이 존재하지 않습니다 — 인증 계열, 전체화면 금지 */
  NO_PERMISSION: "A401",
  /** 잘못된 요청입니다 — 전역 에러 핸들러의 기본 코드. 401 응답 본문으로도 관측됨 */
  BAD_REQUEST: "COMMON-400",
  /** 인기 지역 목록 없음 — 정상 빈 데이터인데 HTTP 404 로 온다 */
  POPULAR_REGION_EMPTY: "M201",
} as const;

/**
 * 전체화면 오류(critical)로 승격할 코드.
 *
 * ⚠️ 아직 확정이 아니다 — 백엔드 표에 status 열이 없고 `C500` 취급이 미정이다.
 *    합의되면 **이 배열만** 교체한다. (이슈 #113 체크박스: 심각 오류 코드 목록 확정)
 *
 * 승격에서 **제외한** 코드와 근거:
 * - `I101`(AI 응답 실패) / HTTP 502(이미지 프록시 실패) → 부분 실패라 재시도 유도가 맞다.
 * - `A100` → 서버 장애가 아니라 클라이언트 설정 오류이므로 `config` 로 따로 분류한다.
 * - `A401` / `COMMON-400` → 인증·검증 계열.
 * - `S001`/`S300`/`S400`/`S401`/`S402`/`D300`/`U300`/`L103`/`L300`/`A102`/`A103`
 *   `R101`/`R102`/`G101`/`I201`/`T201`/`IM101` → 화면별 처리가 맞는 도메인 실패.
 */
export const CRITICAL_ERROR_CODES: readonly string[] = [
  API_ERROR_CODE.SERVER_ERROR,
  API_ERROR_CODE.SERVER_ERROR_C,
];
