# 일정 공유 링크 기능 — 설계 & 인수인계

- 브랜치: `feat/schedule-share-link` (dev @ `68ca529` #100 에서 분기, 로컬 전용·원격 없음)
- 갱신: 2026-07-16 (v2 — 코드베이스 정찰 5축 반영) / 상태: **설계 완료, 구현 미착수**
- 목적: 다음 작업자가 이 문서만 읽고 바로 구현에 들어갈 수 있게 함

---

## 0. 다음 작업자가 할 일 (우선순위)

| # | 할 일 | 상태 |
|---|---|---|
| 1 | 🔴 **`data` 실제 구조 확인** — 이거 없이는 타입 작성 금지 ([2.3](#23-미해결--유일한-진짜-블로커)) | **블로커** |
| 2 | 🔴 **`headerConfig.ts`에 `/share/:token` → `{type:"none"}` 등록** — 안 하면 비로그인 방문자가 로그인 화면으로 튕김 ([5.3-①](#53-리스크--정찰로-재평가됨)) | 필수 |
| 3 | API 레이어 추가 ([4.1](#41-api-레이어)) | |
| 4 | 헤더 공유 버튼 ([4.3](#43-헤더-공유-버튼--위치-확정)) + 공유 바텀시트 ([4.4](#44-공유-바텀시트--새로-만들지-말-것)) | |
| 5 | 공개 공유 뷰 `/share/:shareToken` ([4.5](#45-공개-공유-뷰-페이지)) | |

**정찰로 해소된 것 (더 조사하지 말 것):** SPA fallback ✅ / RN 브릿지 안전성 ✅ / 바텀시트 자체 구현 ✅(이미 있음)

---

## 1. 요구사항 (사용자 확정)

1. 일정 완성(상세) 화면 **헤더에 공유 아이콘 추가**
2. 클릭 → **바텀시트**: "일정 공유" / "링크가 있는 사람은 이 일정을 볼 수 있어요" / 링크 + **복사** / **카카오톡** · **더보기**
3. 링크 접속자(미가입자 포함)는 **일정 리스트 열람**, 하단 **fixed 설치 CTA**
4. 모바일 웹에서 열림

---

## 2. API 사실관계 (실측 완료 — 추측 아님)

### 2.1 엔드포인트

| 메서드 | 경로 | 파라미터 | 인증 |
|---|---|---|---|
| `POST` | `/api/v1/schedule/{scheduleNum}/share` | path `scheduleNum`, query `environment`(LOCAL/TEST/PROD), header `API-KEY` | **JWT 필수** (실측) |
| `GET` | `/api/v1/schedule/share/{shareToken}` | path `shareToken`, header `API-KEY` | **JWT 불필요** (실측) |

> ⚠️ 사용자가 제공한 스웨거 발췌엔 **GET(조회) 엔드포인트가 없었음.** 스웨거 전체를 뒤져 발견. 이게 없으면 기능 자체가 성립 안 함.

### 2.2 실측 응답 (2026-07-16, test.fitpl.xyz)

```
POST /api/v1/schedule/1/share?environment=TEST   (API-KEY만)
  → HTTP 401  {"resultCode":"COMMON-400", "message":"잘못된 요청입니다."}
     ↳ 스웨거는 API-KEY만 요구한다고 적혀있으나 실제로는 JWT 필수. 본인 일정만 공유 가능 = 정상.
     ↳ 이 봉투는 `resultCode` 키 (앱 레벨 `code`와 다름 — 인증 필터 단계 에러).

GET /api/v1/schedule/share/dummytoken123        (API-KEY만, JWT 없음)
  → HTTP 200  {"code":"SS400","message":"해당 공유 정보가 만료되었거나 존재하지 않습니다.","data":null}
     ↳ ✅ JWT 없이 통과 = 비로그인 공개 조회 가능 (요구사항 3의 근거)
     ↳ 🔴 SS400은 스웨거에 없는 코드. "만료" 개념 존재 → 만료 UI 필요.
     ↳ 🔴 에러인데 HTTP 200 → res.status 아닌 `code`로 분기해야 함.

GET /api/v1/schedule/share/... (API-KEY 없음) → HTTP 500 {"code":"COMMON-500"}
GET /api/v1/schedule/list      (API-KEY만)   → HTTP 401   ← 대조군: 보호 엔드포인트는 진짜 401
GET /api/v1/members            (API-KEY만)   → HTTP 401   ← 5.3-① 함정의 원인
```

### 2.3 ✅ 해결됨 — `data` 구조 실측 확정 (2026-07-17)

테스트 계정으로 로그인해 실제 호출한 결과. **추측 아님.**

**POST `/api/v1/schedule/7/share?environment=TEST`** → `BaseResponse<string>`
```json
{"code":"S200","message":"일정 공유 링크가 생성되었습니다.",
 "data":"https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H"}
```
- ✅ 사전 추론(`getOAuthLink` 선례 = `BaseResponse<string>`)이 적중
- ✅ `environment=TEST` 가 도메인을 결정하는 것 확인 (`test.fitpl.xyz`)
- 🔴 **하지만 이 URL 은 API 주소라 그대로 공유하면 안 된다** → [2.5](#25--서버가-주는-공유-링크는-공유-불가능하다) 참조
- 🔴 **호출할 때마다 새 토큰** — 1회차 `8OD5dVzR8c1H`, 2회차 `nqw7vOzOvcg6` (전달사항 3번 답: **재사용 아님**)

**GET `/api/v1/schedule/share/{token}`** (API-KEY만, JWT 없음) → `BaseResponse<ScheduleDetailResDTO>`
```
code: S202 | data 키: scheduleNum, scheduleNm, startDate, endDate, radius, planDetailVOList[]
```
- ✅ **기존 `ScheduleDetailResDTO`(planTypes.ts:176)와 완전 일치** → 신규 타입 불필요, **기존 매퍼·카드 컴포넌트 재사용 가능**
- 응답에 `planSource`(값 `null`)가 하나 더 있으나 기존 타입이 모델링하지 않음 → 무시 (CLAUDE.md 규칙상 용도 불명 필드는 매핑하지 않음)
- ✅ JWT 없이 200 → **비로그인 공개 조회 재확인**

### 2.5 🔴 서버가 주는 "공유 링크"는 공유 불가능하다

`POST` 가 돌려주는 `https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H` 는 **API 엔드포인트**다.
`API-KEY` 헤더를 요구하는데 **브라우저는 그 헤더를 보내지 않는다.**

```bash
curl -i "https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H"        # 헤더 없이 = 링크 받은 사람
→ HTTP 500  {"code":"COMMON-500","message":"서버 오류가 발생했습니다.","data":null}

curl "...same..." -H "API-KEY: $KEY"                                        # 프론트가 호출할 때
→ HTTP 200  {"code":"S202", "data":{ ...정상... }}
```
→ **이대로 카톡에 보내면 수신자는 에러 JSON을 본다.**

**프론트 대응 (적용 완료):** `src/utils/shareLink.ts` 의 `toSharePageUrl()` — 마지막 경로 조각(토큰)만 추출해 SPA 라우트로 재조립.
```
https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H  →  https://test.fitpl.xyz/share/8OD5dVzR8c1H
                                                              (HTTP 200 text/html 실측 확인)
```
오리진은 `window.location` 이 아니라 **서버 응답에서** 취한다 → 로컬 개발 중에도 localhost 가 아닌 **실제 공유 가능한 도메인** 링크를 얻는다.

> **멱등성:** 마지막 경로 조각을 토큰으로 취급하므로, 백엔드가 나중에 페이지 주소(`/share/{token}`)로 고쳐 내려줘도 **결과가 동일**하다. → **백엔드 수정이 프론트를 깨뜨리지 않는다.**

📄 백엔드 전달 문서: `docs/backend-schedule-share-issues.md`

### 2.4 🔴 `environment` — TEST를 표현할 방법이 현재 없다

유일한 선례 (`authQueries.ts:34`):
```ts
const environment = import.meta.env.PROD ? "PROD" : "LOCAL";
```
- **boolean 삼항이라 LOCAL/PROD 2값만 가능 — TEST를 낼 수 없음.**
- `.env.local`엔 `VITE_API_BASE_URL`, `VITE_API_KEY` 2개뿐. `VITE_ENVIRONMENT` 없음. 다른 env 파일도 저장소에 없음.
- 그런데 현재 붙는 서버는 `https://test.fitpl.xyz` = **TEST여야 맞음.** 커밋 `9086666 chore: 테스트서버 배포 환경 변경`도 있어 테스트 배포가 실재.
- **→ 불일치. 사용자/백엔드 확인 필요.** TEST가 필요하면 새 env var(`VITE_ENVIRONMENT`) 도입 + 배포 파이프라인 설정이 선행. 도입 시 `src/api/environment.ts`의 `getEnvironment()`로 추출해 `getOAuthLink`와 통일 권장(임의로 `import.meta.env.MODE`로 바꾸면 기존 OAuth에 영향).

---

## 3. 전체 흐름

```
[공유하는 사람]                          [링크 받은 사람 — 비로그인 가능]
 헤더 공유 아이콘 클릭                     카톡에서 링크 탭
   ↓                                        ↓
 POST /schedule/{num}/share               모바일 브라우저에서 열림
 (JWT + API-KEY)                            ↓
   ↓                                      ✅ SPA fallback (이미 동작)
 링크/토큰 수신                              ↓
   ↓                                      🔴 headerConfig {type:"none"} 필요
 [바텀시트] 링크 + 복사 + 카톡 + 더보기        ↓
                                          GET /schedule/share/{token} (API-KEY만)
                                            ├ 성공 → 읽기전용 리스트 + 하단 설치 CTA
                                            └ SS400 → "만료/없는 링크" 화면
```

---

## 4. 구현 설계 (정찰로 파일·라인 확정)

### 4.1 API 레이어

**엔드포인트** — `src/api/endpoints.ts` `SCHEDULE` 그룹에 추가.
- 🔴 기존 schedule API는 scheduleNum을 **query param**으로 보내지만(`getScheduleDetail`), 신규는 **path param**이다. 복붙 금지.
- **`ENDPOINTS.SETTINGS.UPDATE(a, b)`의 함수형 템플릿 리터럴 방식**을 따를 것. (`as const` 유지됨 — 선례로 검증)

**요청 함수** — `src/api/queries/planQueries.ts`에 추가. 기존 패턴:
```ts
export const getScheduleDetail = async (scheduleNum: number) => {
  const response = await apiKeyHttp.get<BaseResponse<ScheduleDetailResDTO>>(
    ENDPOINTS.SCHEDULE.DETAIL, { params: { scheduleNum } }
  );
  return response.data;   // ← BaseResponse 래퍼 통째로 (언랩 금지)
};
```

**🔴 인스턴스 선택 — client.ts 주석을 믿지 말 것**
```ts
// client.ts의 이 주석은 사실과 반대임:
export const http: AxiosInstance = ...        // "인증 불필요" ← 거짓
export const apiKeyHttp: AxiosInstance = ...  // "인증 필요"   ← 거짓
```
실제로 `src/api/http.ts:20-21`에서 **`http`와 `apiKeyHttp` 둘 다** `applyAuthInterceptors`(토큰 주입 + 401 refresh 재시도)를 받는다. **유일한 실질 차이는 apiKeyHttp만 `API-KEY` 헤더가 붙는 것**(`http.ts:24-31`).
→ 둘 다 API-KEY가 필요하므로 **양쪽 다 `apiKeyHttp`**. 단 아래 경고 참조.

**⚠️ 공개 뷰는 인터셉터 격리 권장**
`apiKeyHttp`에도 401 인터셉터가 걸려 있어, 비로그인 상태에서 401이 나면 `handleLogout()` → `/auth/login` 하드 리다이렉트된다. **지금은 공유 GET이 401을 안 내서(만료→200/SS400, 키누락→500) "우연히" 동작하는 구조.** 서버가 나중에 401을 내기 시작하면 즉시 깨진다. → 공유 뷰 전용으로 **인터셉터 없는 axios 인스턴스**를 두는 게 안전.

**언랩 규칙**
- api 레이어는 **절대 언랩 안 함** (`return response.data` = BaseResponse 전체)
- 훅에서 `if (!res.code.startsWith("S")) throw new Error(res.message ?? "...")` 후 `res.data`
- 일정 계열은 **`startsWith("S")`** 를 쓸 것 (생성이 S200이 아닌 S201/S202일 수 있음). `res.code !== "S200"` 방식(useSettingsQuery)은 따르지 말 것. `useWithdrawalReasonsQuery`의 무검사 이중 `.data`도 모방 금지.
- 알려진 코드: create=S201, detail=S202, save=S203/S204, 공유조회 성공=**S202**(스웨거)

**타입** — `src/api/types/`. **2.3 확인 후 작성.** `BaseResponse<string>`이면 매퍼 불필요(`getOAuthLink`도 매퍼 없음).

**배럴** — `src/api/queries/index.ts`·`types/index.ts`는 `export *` → 기존 파일에 추가만 하면 수정 불필요. 일정 쿼리키는 `src/api/keyFactories/planKeys.ts`(파일명은 plan인데 내용은 `scheduleKeys`)에 추가.

### 4.2 훅
- 생성: `src/hooks/mutations/` — **액션이므로 `useMutation`** (단 `getOAuthLink`처럼 훅 없이 명령형 호출도 기존 선례)
- 조회: `src/hooks/queries/` — 만료 링크 재시도 무의미하므로 `retry: false`
- 🔴 **`retry:false`는 401 리다이렉트를 못 막는다** — axios 인터셉터가 react-query보다 먼저 돈다

### 4.3 헤더 공유 버튼 — 위치 확정

**화면:** `src/pages/main/plan/ScheduleRoutesPage.tsx` (create/detail을 `variant` prop으로 겸함), 라우트 `/plan/:id/detail`

**⚠️ "헤더"가 두 개라 혼동 주의**
- `ScheduleRouteInfoHeader.tsx` — 이름과 `<header>` 태그에도 불구하고 **앱바가 아님**. 콘텐츠와 함께 스크롤되는 날짜/일정명 블록. **여기 아님.**
- `BackHeader` — 상단 고정 앱바. **여기가 맞음.**

**정확한 수정 지점 — `ScheduleRoutesPage.tsx:928-939`**
```tsx
{isDetail && (
  <div className="bg-gray-white">
    <BackHeader onClick={() => navigate(-1)}>
      <div className="flex w-full justify-end">     {/* ← 여기에 gap-4 추가 */}
        {/* ← 공유 버튼을 ScheduleDetailMenu 앞에 삽입 */}
        <ScheduleDetailMenu ... />
      </div>
    </BackHeader>
  </div>
)}
```
`BackHeader`는 우측 아이콘 전용 prop이 **없고** `children` 슬롯이 유일한 확장점(호출부가 `justify-end`까지 책임짐). `rightSlot` 같은 prop 새로 만들지 말 것 — `SearchBackHeader`도 동일 관례.

**아이콘 버튼 마크업** — `ScheduleDetailMenu.tsx:28-36` 그대로 모방:
```tsx
import IosShareIcon from "@mui/icons-material/IosShare";   // 개별 default import (barrel import 금지 — 30개 아이콘 전부 이 방식)

<button type="button" aria-label="일정 공유" onClick={...} className="flex items-center cursor-pointer">
  <IosShareIcon className="text-gray-40" />
</button>
```
- `aria-label` **필수** (CLAUDE.md)
- 색상은 토큰(`text-gray-40`), **hex 인라인 금지**

**scheduleNum** — 이미 있음 (`ScheduleRoutesPage.tsx:157-159`):
```tsx
const { id } = useParams<{ id: string }>();
const scheduleNum = id ? Number(id) : undefined;
```
관례상 `if (!scheduleNum || Number.isNaN(scheduleNum)) return;` 가드 후 사용. `scheduleResult?.scheduleNum`(서버 응답값)도 사용 가능(삭제 핸들러가 이 쪽 사용).

**대안:** 공유를 별도 아이콘이 아니라 `ScheduleDetailMenu`의 **kebab 메뉴 항목**(`listItems` 배열 `41-61`)으로 넣는 방법도 있음 — 시안은 별도 아이콘이므로 기본은 아이콘.

### 4.4 공유 바텀시트 — 새로 만들지 말 것

**`BottomModalLayout`이 이미 있음** (`react-modal-sheet` v4.4.0 래핑). 드래그 핸들(`Sheet.Header`)·backdrop(`Sheet.Backdrop`)·애니메이션·포털·**하드웨어 백(`useNativeBack`)** 전부 처리됨. 코드베이스에 `createPortal` 사용처 0.

- **열림 상태**: 부모 페이지 로컬 `useState` (`ScheduleRoutesPage`의 `isInfoSheetOpen` 선례). zustand는 전역 alert/confirm 전용이니 쓰지 말 것.
- ⚠️ **`BottomModalHeader`에 부제 슬롯 없음** — `variant="title"`은 가운데 타이틀 하나만. 부제 "링크가 있는 사람은 이 일정을 볼 수 있어요"는 **children 최상단에 직접** 배치.
- ⚠️ **타입 유니언 주의** (`BottomModalTypes.ts:11-23`): `variant:"title"`이면 `onCancel`/`onConfirm`이 `never` → 넘기면 컴파일 에러.
- ⚠️ 시트 `zIndex: 100` 고정 / `pb-safe`는 레이아웃이 이미 적용(children에서 중복 금지)
- ⚠️ **시트 배경에 `backdrop-blur` 금지** (BottomTabBar 주석이 "DESIGN.md frosted blur 금지"를 명시, 탭바는 사용자 명시 요청에 의한 예외). `BottomModalLayout`의 기존 backdrop(`backdrop-blur-[1.5px]`)은 건드리지 말 것.

**복사** — 선례 있음: `ProfileUserInfo.tsx`의 `navigator.clipboard.writeText` + `openAlertModal`. 비보안 컨텍스트/구형 브라우저 fallback 필요. `aria-label="링크 복사"`.

**더보기(Web Share API)** — 🔴 `navigator.share`/`canShare` 저장소 사용처 **0건**. 신규 + **미지원 분기 필수**. RN 브릿지에도 **share 메서드 없음**(`window.BarogagiApp`은 getData/saveData/deleteData/openExternal/exitApp/getFcmToken?/loginWithOAuth?만) → 네이티브 공유시트 쓰려면 RN 측 작업 필요. 현실적 대안은 `openExternal`.

**카카오톡** — 🔴 **SDK 전무**: `index.html`의 script는 `/src/main.tsx` 하나뿐, `package.json`에 Kakao 패키지 없음, JS 앱키 없음. 저장소의 "Kakao"는 전부 무관(OAuth 리다이렉트 로그인 / 카카오맵 링크 / KakaoPlaceDTO / SnsButton 아이콘). **정식 SDK 연동은 앱키 발급 + 도메인 등록 선행 = 범위 협의 대상**([6-4](#6-열린-질문)). 임의로 SDK 심지 말 것.
- ⚠️ `SnsButton` 재사용 금지 — `platform="kakao"`의 alt가 `"카카오 로그인"`으로 하드코딩(스크린리더가 오독) + `<button>`에 aria-label 없음. 아이콘(`src/assets/icons/kakao-circle.png`)만 재사용하고 별도 컴포넌트로.

**UI만 먼저 만들 거면**: 링크 문자열을 **prop으로 받는 순수 표시 컴포넌트**로 격리 → 2.3 미해결과 무관하게 진행 가능.

### 4.5 공개 공유 뷰 페이지
- 라우트 `/share/:shareToken` 신설
- 🔴 **`headerConfig.ts`에 `{type:"none"}` 등록 필수** ([5.3-①](#53-리스크--정찰로-재평가됨)) — 라우터만 고치면 안 됨
- 상태: 로딩(`SkeletonPlanCard` 재사용) / 성공(읽기전용) / SS400(만료·없음)
- 읽기전용: 편집·메모·드래그 전부 제거
- 하단 fixed CTA: "직접 만들어보고 싶다면? 핏플 설치하기"

---

## 5. 공유 링크 수신자 흐름 (요구사항 3의 답)

### 5.1 결론: **가능.** 실측 근거 있음
`GET /api/v1/schedule/share/{token}`이 API-KEY만으로 HTTP 200 반환 → 비로그인 조회가 **백엔드 변경 없이** 성립.

### 5.2 사용자 흐름
카톡 링크 탭 → 모바일 브라우저에서 열림(설치 불필요) → `/share/:token` → API-KEY로 조회 → 읽기전용 리스트 + 하단 설치 CTA. 만료 시 안내 화면.

### 5.3 리스크 — 정찰로 재평가됨

#### 🔴 ① 최대 함정 (신규 발견) — 라우트만 고치면 비로그인은 튕긴다
`MainLayout`이 App.tsx의 `<Routes>` **바깥**에 있어 공개 라우트도 반드시 통과한다. 실측 연쇄:
```
비로그인 /share/:token 진입
 → MainLayout → useHeaderConfig() → 매칭 없음 → DEFAULT_HEADER_CONFIG {type:"common"}
 → <CommonHeader /> → useQuery(getMe) → GET /api/v1/members → HTTP 401 (실측)
 → axiosInterceptors: /api/v1/members는 ENDPOINTS.AUTH 목록에 없음 → refresh 시도
 → getRefreshToken() = null → throw → catch → handleLogout()
 → window.location.href = "/auth/login"   ← 페이지 통째 하드 리다이렉트
```
- **`retry:false`는 방어 못 함** (axios 인터셉터가 react-query보다 먼저 실행)
- **해결: `headerConfig.ts`에 `{type:"none"}` 등록.** PrivateRoute 밖에 두는 것만으론 부족.
- (참고: 상세 화면은 `headerConfig.ts:184-188`에 이미 `type:"none"`으로 등록돼 있음 — 같은 방식)

#### 🔴 ② 401을 받는 순간 어떤 공개 페이지든 죽는다
`applyAuthInterceptors`가 `http`·`apiKeyHttp` **양쪽**에 걸림. 비로그인 401 → `handleLogout()` → `/auth/login`.
현재 공유 GET은 401을 안 내므로(만료→200/SS400, 키누락→500) **우연히** 동작. → 인터셉터 없는 전용 인스턴스로 격리 권장.

#### ✅ ③ SPA fallback — **이미 동작함** (v1의 "최대 리스크"는 해소)
test.fitpl.xyz 실측:
```
200 text/html  /share/testtoken123        ← 아직 없는 라우트인데도 200
200 text/html  /definitely-not-a-route-xyz
md5(/share/testtoken123) == md5(/)        → 동일 index.html = 진짜 SPA fallback
```
`vite.config.ts`에 `base` 설정 없음(기본 `/`) → 경로 이슈 없음.
⚠️ 단 **nginx 설정이 레포에 없고 서버에만 존재** → **운영(release) 서버는 별도 확인 필요.** 위 검증은 test 서버 기준.

#### ✅ ④ RN 브릿지 — 모바일 웹 단독에서 안전 (v1 우려 해소)
`src` 전체에 **가드 없는 `BarogagiApp` 호출이 0건**: `window.BarogagiApp?.exitApp()`, `if (window.BarogagiApp)`, `isBridgeAvailable()`, `typeof bridge.loginWithOAuth !== "function"`. `waitForBridge()`는 `if (!isNativeApp()) return Promise.resolve(false)` → 브라우저에서 즉시 반환(부팅 지연 없음). 스토리지는 localStorage fallback, firebase는 미지원 시 `null` 반환(throw 안 함).
→ **블로커 아님.**

#### 🟡 ⑤ 카톡 링크 미리보기(OG) 안 뜸
OG 태그 없음 + `<title>기본 세팅</title>` 플레이스홀더. SPA라 미리보기 봇이 빈 페이지로 인식. SSR/프리렌더 또는 백엔드 OG 응답 필요 = **범위 협의 대상**.

#### 🟡 ⑥ 카톡 인앱 브라우저 편차
`navigator.share`/클립보드 동작 편차 → fallback 필수.

#### 🟢 ⑦ API-KEY는 공개값
`VITE_API_KEY`는 번들에 그대로 박힘(레포에 커밋됨). 공유 뷰 보안은 전적으로 **"토큰 추측 불가능성 + 만료"라는 백엔드 책임**에 의존. 설계 의도("링크 아는 사람만 열람")와는 일치.

---

## 6. 열린 질문 (사용자/백엔드 확인 필요)
1. POST 응답 `data` = 완성 URL인가, 토큰인가? (→ 2.3)
2. **`environment`에 TEST를 어떻게 넣나?** 현재 코드는 LOCAL/PROD만 표현 가능한데 서버는 test.fitpl.xyz. (→ 2.4)
3. 공유 링크 **만료 기간**은? 만료 시 재생성 UX는?
4. 같은 일정 재공유 시 **같은 토큰 재사용**인가 매번 새 토큰인가? (버튼마다 POST하면 토큰 누적 → 캐싱 전략에 영향)
5. **카카오톡**은 정식 SDK 연동인가 링크 복사인가? (SDK면 앱키·도메인 등록 필요)
6. **카톡 미리보기 카드** 필요한가? (필요 시 SSR/프리렌더 별도 작업)
7. 공유 도메인 확정 — 시안의 `barogagi.app`은 리브랜딩(fitpl) 전 이름
8. 운영(release) 서버도 SPA fallback 되나? (test만 확인됨)

---

## 7. 🔴 별건 — 팀에 보고 필요: DESIGN.md가 존재하지 않음

- CLAUDE.md는 `.claude/design/DESIGN.md`·`DESIGN-apple.md`를 **"UI 작업 전 필수 참조"**로 지정한다.
- 그런데 **두 파일은 디스크에 없고, git에 한 번도 커밋된 적이 없다** (`git log -S` 전 ref 확인). 원인은 `.gitignore:33`이 `.claude`를 **통째로 제외**하기 때문. 백업 번들에도 없음(번들은 추적 파일만 담음).
- 즉 **추적되는 CLAUDE.md가 강제하는 문서를 추적되는 .gitignore가 배제**하는 구조적 모순. 신규 합류자·다른 머신·CI 어디서도 볼 수 없음.
- 참조를 넣은 사람: **정은우** (커밋 `6074541`, PR #97, 2026-07-05) → **원문은 그의 로컬에만 존재. 문의 대상.**
- 🔴 **DESIGN.md 규칙을 지어내지 말 것.** globals.css에서 역추론한 값을 "DESIGN.md 규칙"이라 제시하면 검증 불가능한 가짜 표준이 된다.
- **실질 대안:** CLAUDE.md가 "DESIGN.md의 토큰은 `src/globals.css`의 `@theme`으로 관리한다"고 명시 → **토큰은 globals.css가 이미 단일 기준.**
  ```
  --color-peach: #ff8a65   --color-peach-light: #fff3ee
  --color-peach-border: #ffd6c9   --color-peach-text: #e96a47   --ease-fitpl
  ```
- 코드 주석에 남은 확인 가능한 조각: **frosted blur 금지**(BottomTabBar는 사용자 명시 요청 예외) / **모션은 `ease-fitpl` + 페이드·슬라이드만, 바운스·스케일 금지**(RotatingText 주석) / 표준 조합 `transition-colors duration-200 ease-fitpl` / `useReducedMotion` 대응 선례 존재.
- **제안:** `docs/design/`으로 이전하거나 `.gitignore`에 `!.claude/design/` 예외 추가. (`docs/`엔 이미 팀 문서 5개가 커밋돼 있어 이전이 자연스러움)

---

## 8. 코드베이스 지도 (정찰 결과)

| 파일 | 역할 | 핵심 라인 |
|---|---|---|
| `src/pages/main/plan/ScheduleRoutesPage.tsx` | 일정 완성(상세) 페이지. **공유 버튼 1차 수정 지점** | 157-159 scheduleNum · **928-939 앱바(여기 추가)** |
| `src/components/common/headers/BackHeader.tsx` | 공통 앱바. children 슬롯이 유일 확장점. **수정 불필요** | 4-9 props · 32 children |
| `src/components/main/plan/route/ScheduleDetailMenu.tsx` | kebab 메뉴. **아이콘버튼+aria-label 모범사례** | 19-36 마크업 · 41-61 메뉴항목 |
| `src/components/main/plan/route/ScheduleRouteInfoHeader.tsx` | ⚠️ 앱바 아님(스크롤되는 정보 블록). **혼동 주의** | |
| `src/constants/routes.ts` | 라우트 상수 | 72 DETAIL · 111-112 헬퍼 |
| `src/routes/MainRoutes.tsx` | 라우터 wiring | 64-69 |
| `src/constants/headerConfig.ts` | **경로별 헤더 설정. 공개 라우트는 여기 `{type:"none"}` 필수** | 184-188 (상세 선례) |
| `src/api/client.ts` | axios 인스턴스 3종. ⚠️ **19-22 주석이 사실과 반대** | 20-24 |
| `src/api/http.ts` | 인터셉터 부트스트랩. **http·apiKeyHttp 차이는 여기뿐** | 20-21 · 24-31 API-KEY |
| `src/api/axiosInterceptors.ts` | 토큰 주입 + 401 refresh 재시도 | 48-58 AUTH 제외목록 |
| `src/api/apiKey.ts` | `getApiKey()` — VITE_API_KEY | 4-14 |
| `src/api/endpoints.ts` | URL 상수. SCHEDULE 그룹에 공유 추가 | 34-42 |
| `src/api/queries/planQueries.ts` | 일정 요청 함수. 공유 함수 추가 위치 | 25-33 detail · 69-77 delete |
| `src/api/queries/authQueries.ts` | **`getOAuthLink` = 가장 유사한 선례** | 33-34 |
| `src/api/keyFactories/planKeys.ts` | 일정 쿼리키(내용은 scheduleKeys) | |
| `BottomModalLayout` / `BottomModalHeader` / `BottomModalTypes.ts` | **바텀시트 — 이미 존재, 재구현 금지** | Types 11-23 유니언 |
| `ProfileUserInfo.tsx` | 클립보드 복사 선례 | |
| `src/utils/bridgeStorage.ts` | `window.BarogagiApp` 인터페이스(share 없음) | 17-46 |

**⚠️ 정찰 중 나온 부정확한 주장 정정:** 한 에이전트가 "node_modules 미설치"라고 보고했으나 **사실이 아님** — 설치 완료했고 `vite 6.4.2`·`tsc 5.8.3` 실행 검증됨.

**기타 발견:** `RootRedirect`가 `src/routes/RootRedirect.tsx`와 `MainRoutes.tsx:29`에 **동일 로직 2벌 중복 정의** / 배포된 test 서버가 dev HEAD보다 구버전(`viewport-fit=cover` 없음) / import 스타일 혼재(`CommonButton`·`TextInput`=default, `BottomModalLayout`·`SnsButton`=named), 별칭 `@/`

---

## 9. 사용자 확정 전달사항 (2026-07-16)

1. **공유는 카카오 SDK 정식 공유하기 기준** — 단순 링크 복사 아님. → 앱키 발급 + 도메인 등록 필요 ([6-5](#6-열린-질문))
2. **실제 응답 확인 후 타입 정의** — 추측 금지
3. **Share Token 생성 방식 확인** — 같은 일정에 2회 호출해 재사용/신규 판별
4. **SPA Fallback 확인** — ✅ **완료** (아래 10장)
5. **`/share/*` 는 로그인 가드 예외** — ✅ `headerConfig` 등록으로 구현됨
6. **공유 페이지**: 성공→읽기전용+설치 CTA / 실패→전용 Empty State
7. **API 규칙**: POST=로그인 토큰, GET=API-KEY만
8. 🔥 **HTTP Status가 아니라 Response Body의 `code` 로 성공/실패 판단** (공유 조회는 실패도 HTTP 200 → `SS400` 등으로 분기)

> **DESIGN.md 관련:** 사용자 확인 — "없어도 됨. 화면은 거의 구현이 끝났고 지금은 고치는 수준."
> → 7장은 팀 참고용으로만 남김. 작업은 `globals.css` 토큰 + 기존 컴포넌트 선례를 따른다.

---

## 10. ✅ SPA Fallback 검증 완료 (전달사항 4번 — 서버 요청 불필요)

`/`, `/share/testtoken123`, `/definitely-not-a-route-xyz` 세 경로의 **md5가 전부 동일**(`82ca4c0f8aaa47289f60950b0d8bf57c`) = 진짜 index.html fallback.

| 도메인 | `/share/{token}` | 판정 |
|---|---|---|
| `fitpl.xyz` (운영) | HTTP 200 text/html, 해시 동일 | ✅ |
| `www.fitpl.xyz` | HTTP 200 text/html | ✅ |
| `test.fitpl.xyz` | HTTP 200 text/html | ✅ |
| `app.fitpl.xyz` | 연결 실패 | 미존재 |

→ **운영·테스트 모두 이미 설정됨. 서버팀 요청 불필요.**

⚠️ 단 운영 index.html은 `<title>기본 세팅</title>` + **OG 태그 0개**.
→ 카톡 미리보기는 안 뜨지만, **전달사항 1번(카카오 SDK)이 이를 우회한다** — 카카오 SDK 공유는 OG를 읽지 않고 SDK가 title/description/image를 직접 실어 보낸다. 반대로 **'더보기'(Web Share)로 카톡 외 채널에 뿌리면 미리보기 없음.**

---

## 11. 진행 로그
- ✅ 브랜치 `feat/schedule-share-link` 생성
- ✅ 스웨거 조회 — 조회 엔드포인트 발견(사용자 제공분엔 없었음)
- ✅ 테스트 서버 실측 — JWT 필요/SS400 만료/HTTP200 에러
- ✅ 코드베이스 정찰 5축 — 파일·라인 확정, MainLayout 함정 발견
- ✅ **SPA fallback 운영까지 검증 완료** (전달사항 4)
- ✅ **구현 착수 — `data` 비의존 뼈대**
  - `src/api/endpoints.ts` — `SCHEDULE.SHARE(scheduleNum)` / `SCHEDULE.SHARED(shareToken)` 함수형 엔드포인트 추가
  - `src/api/environment.ts` — **신규**. `getEnvironment()` — `VITE_ENVIRONMENT` 우선, 없으면 기존 동작 유지(비파괴)
  - `src/vite-env.d.ts` — `VITE_ENVIRONMENT` 타입 선언 추가
  - `src/api/queries/planQueries.ts` — `postScheduleShare()` / `getSharedSchedule()` 추가 (응답은 `BaseResponse<unknown>` — 확인 전까지 추측 금지, 기존 선례와 동일한 정직한 패턴)
  - `src/constants/routes.ts` — `ROUTES.SHARE.VIEW = "/share/:shareToken"` + `getRoutePath.share.view()`
  - `src/constants/headerConfig.ts` — **`[ROUTES.SHARE.VIEW]: { type: "none" }` 등록 (전달사항 5 — 하드 리다이렉트 방지)**
- ⬜ `data` 구조 확인 ← **블로커. 로그인 필요해 작업자가 못 함**
- ⬜ 카카오 SDK 연동 (앱키 필요)
- ⬜ 공유 버튼 / 바텀시트 / 공개 뷰 페이지

### ⚠️ 환경 이슈 (작업 중 발견)
폴더 이동 후 **`node_modules`의 pnpm junction이 전부 깨져** `tsc`/`vite`가 실행 불가 상태였다. `pnpm install` 재실행으로 복구. 상세·교훈은 `docs/handoff-2026-07-16-repo-cleanup.md` 참조.
