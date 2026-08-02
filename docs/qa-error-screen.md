# 오류/점검 안내 화면 QA 체크리스트 (#113)

전역 오류 화면(`GlobalErrorScreen`)·렌더 폴백(`AppErrorBoundary`)·심각도 분류(`classifyApiError`)의
재현 절차와 기대 동작을 정리한다.

- 대상 브랜치: `feat/error-maintenance-screen`
- 테스트 서버: `https://test.fitpl.xyz`
- 최종 서버 응답 재확인: **2026-07-26**

---

## 0. 심각도 분류 규칙 (판정 기준)

5xx는 상태값만으로 `critical` 이고, 그 밖에는 `status` 와 `code` 를 함께 봐야 한다.
`404` 가 정상 빈 데이터(`M201`)이고 `401` 이 토큰 만료가 아닐 수 있어(`A100`) 어느 한쪽만으로는 갈리지 않는다.
아래 표의 순서대로 판정한다 — 먼저 걸리는 행이 결과다.

| 순서 | 조건 | 결과 | 전체화면 |
| --- | --- | --- | --- |
| a | axios 에러가 아님 (`getApiKey()` throw 등) | `config` | ✅ |
| b | 응답 없음 (timeout / 연결 실패) | `network` | ✅ |
| c | `status >= 500` 또는 `code ∈ {COMMON-500, C500}` | `critical` | ✅ |
| d | `status === 401 && code === "A100"` | `config` | ✅ (refresh 금지) |
| e | 그 외 `status === 401` (`COMMON-400` 포함) | `auth` | ❌ 기존 refresh 흐름 |
| f | 나머지 (`404 + M201` 포함) | `domain` | ❌ 화면별 처리 |

> `maintenance` 는 **분류 규칙에 없다.** 점검 상태 조회 API 와 HTTP 503 이 모두 존재하지 않아
> 트리거를 만들 수 없다. 문구·UI·액션만 구현돼 있고 `ApiErrorKind` 에도 값이 없다.

---

## 1. 서버 응답 재현 (curl) — ✅ 실측 확인 완료

```bash
# 저장소 루트를 자동으로 잡는다 (작성자 PC 경로를 박아두면 다른 환경에서 키가 빈 채로 나간다)
FRONT="${FRONT:-$(git rev-parse --show-toplevel)}"
test -f "$FRONT/.env.local" || { echo ".env.local 없음: $FRONT"; return 1 2>/dev/null || exit 1; }
KEY=$(grep '^VITE_API_KEY=' "$FRONT/.env.local" | cut -d= -f2-)
test -n "$KEY" || { echo "VITE_API_KEY 비어 있음"; return 1 2>/dev/null || exit 1; }
BASE=https://test.fitpl.xyz/api/v1

# 본문 메시지만 믿으면 틀린다 — status를 반드시 같이 본다
curl -s -m 15 -w " [HTTP %{http_code}]\n" -H "API-KEY: $KEY" "$BASE/home/tags/popular"
```

2026-07-26 실행 결과 (가이드 작성 시점 2026-07-25 와 동일):

| 요청 | 결과 | 분류 |
| --- | --- | --- |
| `GET /home/tags/popular` — **헤더 없음** | `500` `{"code":"COMMON-500",...}` | `critical` |
| `GET /home/tags/popular` — **API-KEY: WRONG** | `401` `{"code":"A100",...}` | `config` |
| `GET /place/popular` — 정상 키, 토큰 없음 | `401` `{"resultCode":"COMMON-400",...}` | `auth` |
| `GET /home/regions/popular` — 정상 키 | `404` `{"code":"M201",...}` | `domain` |
| `GET /home/tags/popular` — 정상 키 | `200` `{"code":"M200","data":[...]}` | 정상 |

확인 포인트 2개:

1. **401 인데 본문 코드가 `A100`(봉투 키 `code`) 인 경우와 `COMMON-400`(봉투 키 `resultCode`) 인 경우가 공존한다.**
   → 파서는 `code ?? resultCode` 를 둘 다 읽어야 한다. status 로 키를 고르면 틀린다.
2. **`404` 가 정상 빈 데이터다.** `status >= 400` 으로 뭉뚱그리면 홈이 즉시 회귀한다.

---

## 2. 화면 QA 체크리스트

| # | 케이스 | 재현 방법 | 기대 동작 | 상태 |
| --- | --- | --- | --- | --- |
| a | `critical` | `src/api/http.ts` 의 API-KEY 주입을 임시 주석 처리 → 홈 진입 | `500 + COMMON-500` → 전체화면 + "오류 코드 COMMON-500" 병기 | ⬜ |
| b | `config` | `.env.local` 의 `VITE_API_KEY` 를 잘못된 값으로 → 홈 진입 | `401 + A100` → config 화면. **로그인 페이지로 리다이렉트되지 않아야 한다** | ⬜ |
| c | `auth` | 로그인 후 `.env.local` 유지, accessToken 을 쓰레기 값으로 변조 | 기존 refresh → 실패 시 로그아웃. **전체화면 없음** | ⬜ |
| **d** | **`domain` 오탐 (최중요)** | 홈 진입 (테스트 DB 에 인기 지역 데이터가 없어 항상 `404 + M201`) | **전체화면이 뜨지 않고** `HotPlaceSection` 의 `EmptyContent("인기 지역 정보가 없습니다.")` 유지 | ⬜ |
| e | `network` | `.env.local` 의 `VITE_API_BASE_URL` 을 닫힌 포트로 | 10초(`client.ts` timeout) 후 network 화면 | ⬜ |
| f | `render` | 아무 컴포넌트에 `throw new Error("test")` 삽입 | 흰 화면 대신 `render` 문구 화면. **StrictMode 로 dev 에서 로그 2회는 정상** | ⬜ |
| g | 앱 액션 | 실기기 WebView 에서 액션 버튼 / 브라우저에서 액션 버튼 | 앱 종료 ("앱 종료하기" + "앱이 닫히면 직접 다시 열어주세요") / reload | ⬜ |
| **h** | **이중 노출** | 로그인 화면·전화번호 인증 화면에서 A100 / COMMON-500 유발 | **인라인 문구만** 뜨고 전체화면은 뜨지 않는다 | ⬜ |
| i | 하드웨어 백 | 오류 화면에서 하드웨어 백 | 갇히지 않고 `restartApp` 동작 | ⬜ |
| j | `push/token` 500 | FCM 토큰 등록이 500 으로 실패하도록 유도 | **로그인 플로우가 막히지 않는다** (`_skipGlobalError`) | ⬜ |
| k | 중복 raise | 5xx 를 연속 발생 | 첫 오류가 유지되고 화면이 깜빡이지 않는다. 네트워크 탭 요청 **1회** (critical 재시도 제외) | ⬜ |
| l | 점검 화면 | Storybook `Components/Common/Error/FullScreenNotice` → `Maintenance` | 일반 오류와 톤·아이콘이 구분됨. **실제 앱에서는 뜨지 않는 것이 정상** | ⬜ |

**d 와 h 가 실패하면 회귀다.** 인터셉터의 승격 위치(`isAuthRequest` 제외 뒤)를 다시 확인한다.

### 콘솔에서 화면만 빠르게 확인하기

```js
// 전체화면 강제 표시 (kind: critical | network | config | maintenance)
useCriticalErrorStore.getState().raise("critical", "COMMON-500");
// 해제
useCriticalErrorStore.getState().clear();
```

> store 는 모듈 스코프라 콘솔에 노출되지 않는다. 필요하면 `GlobalErrorScreen` 에서
> `window.__errorStore = useCriticalErrorStore` 를 임시로 붙여 확인하고 커밋하지 않는다.

---

## 3. 미완 항목 (백엔드·디자인 대기)

| 항목 | 대기 사유 |
| --- | --- |
| 점검(maintenance) **노출 트리거** | 점검 상태 조회 API 없음 + HTTP 503 선언·관측 0건 + 백엔드 오류 코드 표에도 없음 |
| 심각 오류 코드 **최종 목록** | 백엔드 합의 대기. 현재 초안 `COMMON-500` / `C500` / HTTP 5xx 로 동작 중 (`apiErrorCodes.ts` 의 `CRITICAL_ERROR_CODES` 한 곳만 교체하면 된다) |
| `C500` 취급 | 백엔드 오류 코드 표(22건)에 없는데 `api-docs.json` 6개 엔드포인트에는 선언돼 있다. 확인 전까지 critical 유지 |
| 오류/점검 **일러스트** | 디자인 에셋 대기. `@heroicons/react` 로 임시 진행 |

---

## 4. 범위 밖 버그 (별도 이슈로 등록 필요)

`src/api/types/homeTypes.ts` 의 `PopularTagResponseDTO` 는 `{resultCode, message, tagInfoList}` 를 선언하지만
서버 실측 응답은 `{"code":"M200","message":"...","data":[{"tagNm","rankNo"}]}` 다.
→ `HomePage` 의 `tagsData?.tagInfoList ?? []` 가 **항상 `[]`** 이므로 인기 태그가 렌더되지 않는다.
`HomeScheduleResponseDTO` 도 같은 형태라 함께 점검이 필요하다.

**#113 에서 고치지 않았다.** 봉투 파싱을 신뢰할 수 없다는 전제의 근거로만 인용했다.
