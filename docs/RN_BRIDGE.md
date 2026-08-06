# RN WebView 연동 명세서

이 문서는 **fitpl-front 웹앱(Vite + React)** 을 React Native WebView로 감싸기 위한 양측(웹/RN) 작업 명세입니다.

> 타깃 플랫폼: **Android only** (현 단계)
> OAuth 소셜 로그인(인앱 Custom Tab) 흐름은 **§10** 참고
> iOS 확장 시 고려 사항은 **부록 A** 참고

각 섹션은 다음 구조로 정리됩니다:

> **문제** → **웹(fitpl-front)에서 완료한 작업** → **RN에서 해야 할 일** → **RN 측 체크리스트**

웹 측 작업은 **이미 완료**되어 `feat/rn-webview-bridge` 브랜치에 반영되어 있습니다.

---

## 0. 배경

- 이 앱은 기존 웹앱(`fitpl-front`)을 React Native WebView로 감싼 하이브리드 앱입니다.
- 사용자에게는 네이티브 앱처럼 보이지만, 실제 화면은 모두 WebView 내부의 웹 페이지가 렌더링합니다.
- 웹 ↔ RN 통신은 다음 두 채널로 이뤄집니다:
  - **웹 → RN**: `window.ReactNativeWebView.postMessage(JSON.stringify(...))`
  - **RN → 웹**: `webViewRef.current.injectJavaScript('...')`
- 웹 코드는 `window.BarogagiApp`이라는 글로벌 객체가 존재한다고 가정하고 호출합니다. **이 객체는 RN 측에서 inject 해줘야 합니다.**
- 모든 메서드 호출은 **RPC 프로토콜**(§7)을 따릅니다.

---

## 1. zustand Persist Storage (회원가입 draft, 일정 draft 등)

### 문제

- 회원가입/일정 생성 도중 페이지가 새로고침되어도 입력 진행 상태가 유지되어야 함.
- 동시에 **앱을 완전히 종료했다 다시 켜면 draft는 사라져야 함** (이전 세션 잔존 UX 버그 방지).
- 영속 단위(앱 종료해도 유지)와 세션 단위(앱 종료 시 자동 삭제)를 웹 단독으론 구분 불가. 네이티브 위임이 필요.

### 웹에서 완료한 작업

**파일**: [`src/utils/bridgeStorage.ts`](../src/utils/bridgeStorage.ts)

- RN 브릿지에 위임하는 RPC 패턴 zustand storage 어댑터 구현
- **3종 namespace 도입**:
  - `secure` — 토큰 (EncryptedSharedPreferences)
  - `persistent` — 영속 데이터 (MMKV)
  - `session` — 임시 draft류 (in-memory, 앱 종료 시 자동 소멸)
- 브릿지 없는 환경(브라우저 직접 접속)에서는 fallback:
  - `session` → `sessionStorage` (탭 종료 시 휘발)
  - `secure` / `persistent` → `localStorage`
- try-catch + console.error로 브릿지 실패 시에도 앱이 멈추지 않음

**store별 namespace 매핑** (이미 적용됨):

| Store                     | 키                             | Namespace    | 파일                                                                        |
| ------------------------- | ------------------------------ | ------------ | --------------------------------------------------------------------------- |
| `useSignupStore`          | `signup:draft`                 | `session`    | [src/stores/signupStore.ts](../src/stores/signupStore.ts)                   |
| `useScheduleDraftStore`   | `schedule:create:draft`        | `session`    | [src/stores/scheduleStore.ts](../src/stores/scheduleStore.ts)               |
| `useRegionSelectionStore` | `plan:create:selected-regions` | `session`    | [src/stores/regionSelectionStore.ts](../src/stores/regionSelectionStore.ts) |
| `useUserPlaceStore`       | `user-place`                   | `persistent` | [src/stores/userPlaceStore.ts](../src/stores/userPlaceStore.ts)             |

웹 측은 `getPersistStorage("session" | "persistent")`을 zustand persist storage로 넘기는 구조.

### RN에서 해야 할 일

`window.BarogagiApp`에 storage 메서드 3개를 노출. 모든 메서드는 비동기, 응답은 RPC 프로토콜(§7) 준수.

```ts
type Namespace = 'secure' | 'persistent' | 'session';

window.BarogagiApp = {
  getData(namespace: Namespace, key: string): Promise<string | null>;
  saveData(namespace: Namespace, key: string, value: string): Promise<void>;
  deleteData(namespace: Namespace, key: string): Promise<void>;
  // ... 외부 링크/앱 종료는 §4, §5
};
```

namespace별 백엔드 매핑:

```ts
import EncryptedStorage from "react-native-encrypted-storage";
import { MMKV } from "react-native-mmkv";

const persistent = new MMKV({ id: "fitpl-persistent" });
const session = new Map<string, string>(); // 반드시 in-memory. 앱 재시작 시 자동 소멸

async function storageGet(ns, key) {
  if (ns === "secure") return await EncryptedStorage.getItem(key);
  if (ns === "persistent") return persistent.getString(key) ?? null;
  if (ns === "session") return session.get(key) ?? null;
}
async function storageSet(ns, key, value) {
  if (ns === "secure") return await EncryptedStorage.setItem(key, value);
  if (ns === "persistent") return persistent.set(key, value);
  if (ns === "session") {
    session.set(key, value);
    return;
  }
}
async function storageDel(ns, key) {
  if (ns === "secure") return await EncryptedStorage.removeItem(key);
  if (ns === "persistent") return persistent.delete(key);
  if (ns === "session") {
    session.delete(key);
    return;
  }
}
```

### RN 측 체크리스트

- [ ] `react-native-mmkv` 설치
- [ ] `react-native-encrypted-storage` 설치
- [ ] `window.BarogagiApp.getData / saveData / deleteData` inject 구현
- [ ] 3종 namespace 분기 구현
- [ ] **`session` namespace는 반드시 in-memory `Map`** — 절대 영속 저장소에 매핑하지 말 것
- [ ] 응답이 §7 RPC 프로토콜 준수

---

## 2. 인증 토큰 (별도 추상화 레이어)

### 문제

- 토큰 4종(`accessToken`, `refreshToken`, `accessTokenExpiry`, `refreshTokenExpiry`)은 보안이 더 중요해 **EncryptedSharedPreferences**에 저장 필요.
- 단, **axios 인터셉터와 라우트 가드는 동기적으로 토큰을 읽어야** 함 (request마다 매번, 라우팅 결정 시 즉시). 비동기 storage API를 그대로 쓸 수 없음.
- 따라서 **in-memory cache + 영속 저장소 양방향 동기화** 패턴이 필요.

### 웹에서 완료한 작업

**파일**: [`src/lib/auth/tokenCache.ts`](../src/lib/auth/tokenCache.ts) (신설)

토큰 추상화 레이어 도입:

```ts
// 동기 read (axios 인터셉터, 라우트 가드용)
getAccessToken(): string | null
getRefreshToken(): string | null
isLoggedIn(): boolean

// async write/clear (cache + 영속 저장소 동시 갱신)
setAuthTokens(bundle): Promise<void>
clearAuthTokens(): Promise<void>

// 앱 부팅 시 1회 호출 — 영속 저장소 → 캐시 hydration
bootstrapTokens(): Promise<void>
```

**연동된 지점들** (모두 cache 함수로 통합 완료):

| 파일                                                                                | 용도                                               |
| ----------------------------------------------------------------------------------- | -------------------------------------------------- |
| [src/main.tsx](../src/main.tsx)                                                     | 부팅 시 `bootstrapTokens()` 후 React 트리 마운트   |
| [src/lib/auth/tokenStorage.ts](../src/lib/auth/tokenStorage.ts)                     | `saveAuthTokens` → `tokenCache.setAuthTokens` 위임 |
| [src/api/axiosInterceptors.ts](../src/api/axiosInterceptors.ts)                     | accessToken/refreshToken 동기 read                 |
| [src/components/route/PrivateRoute.tsx](../src/components/route/PrivateRoute.tsx)   | `isLoggedIn()` 라우트 가드                         |
| [src/routes/RootRedirect.tsx](../src/routes/RootRedirect.tsx)                       | `isLoggedIn()` 분기                                |
| [src/routes/MainRoutes.tsx](../src/routes/MainRoutes.tsx)                           | `isLoggedIn()` 분기                                |
| [src/api/queries/authQueries.ts](../src/api/queries/authQueries.ts)                 | 회원 탈퇴 시 refreshToken read                     |
| [src/utils/auth/handleLogout.ts](../src/utils/auth/handleLogout.ts)                 | `clearAuthTokens`                                  |
| [src/pages/main/profile/ProfilePage.tsx](../src/pages/main/profile/ProfilePage.tsx) | `clearAuthTokens`                                  |

저장 키 (RN 측이 알아야 할 정보):

- `accessToken`, `refreshToken` (string)
- `accessTokenExpiry`, `refreshTokenExpiry` (number를 string으로 직렬화한 timestamp)

### RN에서 해야 할 일

§1의 `secure` namespace 구현만 되어 있으면 **추가 작업 없음**. 토큰은 `secure` namespace 위에 자동으로 올라감.

다만 **부팅 응답 시간 영향**에 유의:

- 앱이 켜지면 웹이 즉시 `getData('secure', 'accessToken')` 등 4개를 한 번에 호출함
- 이 RPC가 응답하기 전엔 React 트리가 마운트되지 않음 (white screen)
- → `secure` storage 응답이 빨라야 함 (수십 ms 이내 권장)

### RN 측 체크리스트

- [ ] §1의 `secure` namespace가 EncryptedSharedPreferences에 매핑되어 있는가
- [ ] 부팅 직후 storage 응답이 빠른가 (병목 시 white screen 길어짐)
- [ ] 다음 4개 key가 동일 namespace에서 일관되게 처리되는가:
  - `accessToken`, `refreshToken`, `accessTokenExpiry`, `refreshTokenExpiry`

### 트러블슈팅: 앱 재시작 시 로그인 풀림 (#87)

**증상**: 로그인 후 앱을 완전히 종료했다 재실행하면 로그아웃됨. 세션 중에는 정상이고, 브라우저에서는 재현되지 않음(앱에서만).

**원인**: 부팅 시 웹이 `bootstrapTokens()`로 `secure` 저장소에서 토큰을 복원하는데, 그 시점에 `window.BarogagiApp`이 아직 주입되지 않으면 웹이 localStorage로 fallback → 네이티브 보안 저장소에 저장된 토큰을 읽지 못함.

**웹 측 보강(완료)**: 앱 환경(`window.ReactNativeWebView` 존재)에서 `window.BarogagiApp` 주입을 최대 2초 대기한 뒤 읽도록 `waitForBridge()`를 적용 ([src/utils/bridgeStorage.ts](../src/utils/bridgeStorage.ts), [src/lib/auth/tokenCache.ts](../src/lib/auth/tokenCache.ts) `bootstrapTokens`).

**RN 측 확인 필요**:

- [ ] `window.BarogagiApp`을 **`injectedJavaScriptBeforeContentLoaded`** 로 주입하는가 (페이지 스크립트보다 먼저). `injectedJavaScript`(콘텐츠 로드 후)로 주입하면 부팅 복원이 매번 실패할 수 있음.
- [ ] `secure` namespace가 **EncryptedSharedPreferences(영속)** 에 매핑되어 있는가. 실수로 in-memory(`session`처럼)에 매핑하면 재시작 시 토큰이 사라짐.
- [ ] 부팅 직후 `getData('secure', ...)` RPC가 정상 응답하는가 (`onMessage` 핸들러·`__bridgeResolve` 준비 완료 시점인지).

**진단 로그**: 앱 부팅 시 콘솔의 `[tokenCache] bootstrap` 로그로 원인 구분 가능 —

- `isNativeApp: true, bridgeReady: false` → 브릿지 주입 지연 (웹 보강으로 대기 처리됨)
- `bridgeReady: true, hasStoredTokens: false` → 네이티브 `secure`에 토큰이 없음 → 위 영속 매핑 점검 필요

---

## 3. WebView 기본 props

### 문제

기본값으로 WebView를 띄우면:

- localStorage 비활성화 (`domStorageEnabled` 기본 false)
- 끌어당김 효과(over-scroll bounce)로 네이티브감 깨짐
- `window.open` 호출 시 새 WebView가 띄워질 수 있음
- 줌 가능

### 웹에서 완료한 작업

특별한 작업 없음. WebView prop 설정만으로 해결되는 영역.

### RN에서 해야 할 일

```tsx
<WebView
  ref={webViewRef}
  source={{ uri: "https://your-domain" }}
  // 데이터 영속성
  domStorageEnabled={true}
  thirdPartyCookiesEnabled={true}
  // 스크롤/줌 — 네이티브 느낌
  overScrollMode="never"
  scalesPageToFit={false}
  setSupportMultipleWindows={false}
  // 통신
  onMessage={handleWebMessage}
  injectedJavaScriptBeforeContentLoaded={initialInjection()}
  // 외부 링크 가로채기
  onShouldStartLoadWithRequest={shouldAllowNavigation}
/>
```

### RN 측 체크리스트

- [ ] `domStorageEnabled={true}`
- [ ] `setSupportMultipleWindows={false}` (없으면 `window.open`이 새 WebView 띄움)
- [ ] `onMessage` 핸들러 등록 (없으면 웹의 `postMessage`가 작동 안 함)
- [ ] `injectedJavaScriptBeforeContentLoaded`로 `window.BarogagiApp` 초기화 — **`injectedJavaScript`가 아닌 `BeforeContentLoaded`** (페이지 스크립트보다 먼저 실행되어야 함)

---

## 4. 외부 링크 (카카오맵 등)

### 문제

WebView는 "새 탭" 개념이 없어, `window.open(url, '_blank')` 호출 시 무시되거나 같은 화면에서 열려 사용자가 앱에서 빠져나가게 됨.

### 웹에서 완료한 작업

**파일**: [`src/utils/openExternal.ts`](../src/utils/openExternal.ts) (신설)

```ts
export const openExternal = (url: string): void => {
  // javascript:/data:/file: 등 위험 스킴 차단 — http(s)만 허용
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    console.error("[openExternal] 잘못된 URL", url);
    return;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    console.error("[openExternal] 허용되지 않은 스킴", parsed.protocol);
    return;
  }

  if (window.BarogagiApp) {
    void window.BarogagiApp.openExternal(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};
```

브릿지가 있으면 네이티브 위임, 없으면 브라우저 새 탭 fallback.

**적용된 지점**:

- [src/components/main/plan/search/LocationListItem.tsx](../src/components/main/plan/search/LocationListItem.tsx)
- [src/components/main/plan/route/PlanDetailCard.tsx](../src/components/main/plan/route/PlanDetailCard.tsx)

### RN에서 해야 할 일

#### 4-A. `openExternal` RPC 메서드 노출

```ts
// §7의 핸들러에 추가
case 'openExternal':
  await Linking.openURL(payload.url);
  break;
```

#### 4-B. 외부 도메인 접근 자체를 가로채기 (안전망)

웹이 실수로 외부 URL로 navigate 했을 때도 시스템 브라우저로 위임:

```ts
const APP_HOST = "your-domain.com"; // 실제 호스트로 교체

const shouldAllowNavigation = (req) => {
  const url = req.url;
  if (url.startsWith("about:")) return true;
  try {
    const { host, protocol } = new URL(url);
    const isHttp = protocol === "http:" || protocol === "https:";
    // includes() 금지: "your-domain.com.evil.com" 우회 방지 — 호스트 정확 일치/서브도메인만 허용
    const isAppHost = host === APP_HOST || host.endsWith(`.${APP_HOST}`);
    if (isHttp && isAppHost) return true;
  } catch {
    // 잘못된 URL → 차단
  }
  void Linking.openURL(url);
  return false;
};
```

### RN 측 체크리스트

- [ ] `window.BarogagiApp.openExternal` RPC 케이스 처리
- [ ] `onShouldStartLoadWithRequest`로 외부 호스트 가로채기
- [ ] `APP_HOST` 상수가 실제 운영 도메인으로 설정

---

## 5. Android 하드웨어 백 버튼

### 문제

- Android 하드웨어 백 버튼이 눌리면 기본적으로 **앱이 종료**됨.
- SPA + WebView 조합에서 `onNavigationStateChange`가 React Router 변경을 감지하지 못하는 알려진 이슈가 있어, 단순히 `webView.goBack()`을 호출하면 의도와 다르게 동작함.
- 모달이 열려있을 때 백 버튼은 **모달부터 닫혀야** 한다는 UX 요구.

### 웹에서 완료한 작업

**파일**: [`src/utils/nativeBackHandler.ts`](../src/utils/nativeBackHandler.ts) (신설)

처리 우선순위:

1. 등록된 핸들러 stack 최상단 (열려있는 모달의 `onClose`)
2. `window.history.back()` (라우터 뒤로가기)
3. `window.BarogagiApp.exitApp()` (앱 종료 위임)

```ts
// 앱 부팅 시 1회 — main.tsx에서 호출 완료
initNativeBackHandler();

// 모달에서 사용
useNativeBack(isOpen, onClose);
```

`useNativeBack` 훅은 ref 패턴으로 안정화 + optional `onBack` 가드 — 매 렌더마다 push/pop이 반복되지 않음.

**적용된 모달들** (모두 백 버튼 자동 닫기 동작):

- [src/components/layout/BottomModalLayout.tsx](../src/components/layout/BottomModalLayout.tsx) → 이를 사용하는 모든 BottomModal (PlanFormModal, DeletePlanModal, CreateScheduleModal, SelectBirthBottomModal, AddLocationModal 등 10+개)
- [src/components/layout/FullScreenModalLayout.tsx](../src/components/layout/FullScreenModalLayout.tsx)
- [src/components/layout/CommonAlertModalLayout.tsx](../src/components/layout/CommonAlertModalLayout.tsx)
- [src/components/layout/CommonConfirmModalLayout.tsx](../src/components/layout/CommonConfirmModalLayout.tsx)
- [src/components/common/modal/GlobalAlertModal.tsx](../src/components/common/modal/GlobalAlertModal.tsx)
- [src/components/common/modal/GlobalConfirmModal.tsx](../src/components/common/modal/GlobalConfirmModal.tsx)

### RN에서 해야 할 일

#### 5-A. BackHandler에서 웹으로 신호 전달

```ts
useEffect(() => {
  const sub = BackHandler.addEventListener("hardwareBackPress", () => {
    webViewRef.current?.injectJavaScript(`
      window.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify({ type: 'HARDWARE_BACK' })
      }));
      true;
    `);
    return true; // 기본 동작(앱 종료) 방지. 종료는 웹이 exitApp() 호출 시에만.
  });
  return () => sub.remove();
}, []);
```

#### 5-B. `exitApp` RPC 메서드

```ts
case 'exitApp':
  BackHandler.exitApp();
  break;
```

### RN 측 체크리스트

- [ ] `BackHandler.addEventListener('hardwareBackPress', ...)` 등록
- [ ] 핸들러가 **`return true`**로 기본 동작 차단 (`return false`면 앱이 즉시 종료되어 웹 처리 기회를 놓침)
- [ ] `injectJavaScript`로 `HARDWARE_BACK` 메시지 dispatch
- [ ] `window.BarogagiApp.exitApp` RPC 케이스 처리

---

## 6. Edge-to-Edge / Safe Area Inset

### 문제

- **Android 15부터 edge-to-edge가 강제**되어, 시스템 UI 영역(상단 상태바·하단 제스처 바) 위에 콘텐츠가 깔림.
- 웹의 `env(safe-area-inset-*)`이 WebView 138+에서 0을 반환하는 회귀 존재 (react-native-webview #3828).
- 따라서 RN에서 직접 inset 값을 측정해 CSS 변수로 inject 하는 우회 필요.

### 웹에서 완료한 작업

**1. `index.html` viewport meta**: `viewport-fit=cover` 추가됨

**2. `src/globals.css`에 utility class 4종 추가**:

```css
.pt-safe {
  padding-top: max(env(safe-area-inset-top, 0px), var(--sai-top, 0px));
}
.pb-safe {
  padding-bottom: max(env(safe-area-inset-bottom, 0px), var(--sai-bottom, 0px));
}
.pl-safe {
  padding-left: max(env(safe-area-inset-left, 0px), var(--sai-left, 0px));
}
.pr-safe {
  padding-right: max(env(safe-area-inset-right, 0px), var(--sai-right, 0px));
}
```

`env()`가 정상 동작하면 그 값, 안 되면 RN이 inject한 CSS 변수 fallback. `max()`로 둘 중 큰 값.

**3. 적용 지점**:

- [src/components/layout/Layout.tsx](../src/components/layout/Layout.tsx) — 상단 헤더 영역 `pt-safe`
- [src/components/common/tab-bar/BottomTabBar.tsx](../src/components/common/tab-bar/BottomTabBar.tsx) — 하단 탭바 `pb-safe`
- [src/components/layout/TabLayout.tsx](../src/components/layout/TabLayout.tsx) — main 콘텐츠 padding-bottom calc 보정

### RN에서 해야 할 일

`react-native-safe-area-context`의 `useSafeAreaInsets`로 inset을 읽고, 변할 때마다 WebView에 CSS 변수로 inject:

```tsx
import { useSafeAreaInsets } from "react-native-safe-area-context";

const insets = useSafeAreaInsets();

useEffect(() => {
  webViewRef.current?.injectJavaScript(`
    document.documentElement.style.setProperty('--sai-top',    '${insets.top}px');
    document.documentElement.style.setProperty('--sai-bottom', '${insets.bottom}px');
    document.documentElement.style.setProperty('--sai-left',   '${insets.left}px');
    document.documentElement.style.setProperty('--sai-right',  '${insets.right}px');
    true;
  `);
}, [insets.top, insets.bottom, insets.left, insets.right]);
```

또한 페이지 로드 직후에도 한 번 주입되도록 `onLoadEnd`에서 동일 코드 호출.

### RN 측 체크리스트

- [ ] `react-native-safe-area-context` 설치
- [ ] 앱 루트가 `<SafeAreaProvider>`로 감싸짐
- [ ] WebView에 `--sai-*` CSS 변수가 inject 됨 (Chrome DevTools 원격 디버깅으로 `document.documentElement.style`에서 확인 가능)
- [ ] inset 변경 시(회전 등) 재주입
- [ ] `onLoadEnd`에서도 재주입 (새로고침 시 변수 유지)

---

## 7. RPC 통신 프로토콜 (공통)

§1, §2, §4, §5의 모든 메서드가 따르는 단일 RPC 규약. **웹 측 클라이언트 코드는 이미 구현됨** (`window.BarogagiApp` 호출 코드는 RN이 inject한 스크립트가 RPC로 변환).

### 메시지 포맷

**웹 → RN** (`postMessage`):

```json
{
  "id": 1,
  "method": "saveData",
  "payload": { "ns": "secure", "key": "accessToken", "value": "..." }
}
```

**RN → 웹** (`injectJavaScript`로 `window.__bridgeResolve` 호출):

성공:

```js
window.__bridgeResolve(1, true, null);
```

에러:

```js
window.__bridgeResolve(1, false, "에러 메시지");
```

### RN이 inject할 초기 스크립트

```ts
const initialInjection = () => `
(function() {
  const pending = new Map();
  let nextId = 1;

  function rpc(method, payload) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      window.ReactNativeWebView.postMessage(JSON.stringify({ id, method, payload }));
      setTimeout(() => {
        if (pending.has(id)) { pending.delete(id); reject(new Error('bridge timeout')); }
      }, 3000);
    });
  }

  window.__bridgeResolve = (id, ok, value) => {
    const p = pending.get(id);
    if (!p) return;
    pending.delete(id);
    ok ? p.resolve(value) : p.reject(new Error(value));
  };

  window.BarogagiApp = {
    getData:      (ns, key)        => rpc('getData', { ns, key }),
    saveData:     (ns, key, value) => rpc('saveData', { ns, key, value }),
    deleteData:   (ns, key)        => rpc('deleteData', { ns, key }),
    openExternal: (url)            => rpc('openExternal', { url }),
    exitApp:      ()               => rpc('exitApp', {}),
  };
  true;
})();
`;
```

### RN 측 메시지 핸들러 템플릿

```ts
const handleWebMessage = async (event) => {
  let id, method, payload;
  try {
    ({ id, method, payload } = JSON.parse(event.nativeEvent.data));
  } catch {
    // 잘못된 JSON → id를 모르므로 응답 불가. 웹 측은 timeout으로 회수 (체크리스트 참고)
    return;
  }

  // HARDWARE_BACK 같은 RN→웹 메시지가 echo 되는 케이스 방어
  if (method === undefined) return;

  try {
    let result = null;
    switch (method) {
      case "getData":
        result = await storageGet(payload.ns, payload.key);
        break;
      case "saveData":
        await storageSet(payload.ns, payload.key, payload.value);
        break;
      case "deleteData":
        await storageDel(payload.ns, payload.key);
        break;
      case "openExternal":
        await Linking.openURL(payload.url);
        break;
      case "exitApp":
        BackHandler.exitApp();
        break;
      default:
        throw new Error(`Unknown method: ${method}`);
    }
    webViewRef.current?.injectJavaScript(
      `window.__bridgeResolve(${id}, true, ${JSON.stringify(result)}); true;`
    );
  } catch (e) {
    webViewRef.current?.injectJavaScript(
      `window.__bridgeResolve(${id}, false, ${JSON.stringify(String(e))}); true;`
    );
  }
};
```

### RN 측 체크리스트

- [ ] `onMessage` 핸들러가 `id`, `method`, `payload` 구조 파싱
- [ ] 5개 method 모두 분기 구현 (`getData`, `saveData`, `deleteData`, `openExternal`, `exitApp`)
- [ ] 응답 시 **반드시 `window.__bridgeResolve(id, ok, value)` 호출** (빠지면 웹 측 Promise가 3초 후 timeout)
- [ ] 응답 value를 `JSON.stringify`로 직렬화
- [ ] 에러 발생 시에도 응답 전송 (안 보내면 timeout)

---

## 8. 권장 라이브러리 (Android 우선)

```json
{
  "react-native-webview": "^13.x",
  "react-native-mmkv": "^3.x",
  "react-native-encrypted-storage": "^4.x",
  "react-native-safe-area-context": "^4.x"
}
```

---

## 9. 통합 체크리스트 (RN 측 전체)

전체 작업 진행 상황을 한눈에:

### 환경

- [ ] §8 라이브러리 4종 설치
- [ ] 앱 루트가 `<SafeAreaProvider>`로 감싸짐

### WebView 설정 (§3)

- [ ] `domStorageEnabled={true}`
- [ ] `setSupportMultipleWindows={false}`
- [ ] `onMessage` 등록
- [ ] `injectedJavaScriptBeforeContentLoaded`로 `window.BarogagiApp` 초기화

### Storage (§1, §2)

- [ ] `secure` / `persistent` / `session` namespace 매핑 구현
- [ ] `session`은 반드시 in-memory `Map`
- [ ] `secure`는 EncryptedSharedPreferences (토큰 4종이 이 위에 올라감)
- [ ] 부팅 직후 `secure.getData` 응답 빠른지 확인 (white screen 최소화)

### 외부 링크 (§4)

- [ ] `openExternal` RPC 처리
- [ ] `onShouldStartLoadWithRequest`로 외부 호스트 가로채기
- [ ] `APP_HOST` 상수 운영 도메인으로 설정

### 하드웨어 백 (§5)

- [ ] `BackHandler` 등록 + `return true`
- [ ] `HARDWARE_BACK` 메시지 dispatch
- [ ] `exitApp` RPC 처리

### Safe Area (§6)

- [ ] `useSafeAreaInsets`로 `--sai-*` CSS 변수 inject
- [ ] inset 변경 시 재주입
- [ ] `onLoadEnd`에서도 재주입

### RPC 프로토콜 (§7)

- [ ] 모든 응답이 `window.__bridgeResolve(id, ok, value)` 형식
- [ ] 에러 발생 시에도 응답 전송 (timeout 방지)

---

## 부록 A. iOS 확장 시 고려 사항

> 현 단계는 Android 전용이지만, 향후 iOS 확장 시 알아둘 점.

### A-1. iOS WKWebView의 localStorage 자동 삭제 이슈

iOS WKWebView는 **앱 재시작 시 localStorage를 비우는 알려진 동작**이 있음 (react-native-webview #3572). 만약 토큰을 localStorage에 직접 저장했다면 iOS 앱이 재실행될 때마다 로그아웃 발생.

→ 이미 §2의 `tokenCache` + `secure` namespace 구조로 자동 대응됨. iOS 확장 시에도 토큰은 Keychain에 매핑되어 영속됨.

### A-2. iOS Keychain 매핑

`secure` namespace를 iOS에선 `react-native-keychain` 또는 `react-native-encrypted-storage`(iOS 백엔드는 Keychain) 사용:

```ts
// iOS에서도 react-native-encrypted-storage가 Keychain을 백엔드로 사용
import EncryptedStorage from "react-native-encrypted-storage";
// 코드는 Android와 동일
```

### A-3. iOS Safe Area (notch / Dynamic Island)

iOS는 notch/Dynamic Island가 있어 safe area inset이 Android보다 더 큼. §6의 CSS 변수 inject 구조가 그대로 동작 — RN의 `useSafeAreaInsets`가 플랫폼별로 알아서 반환.

### A-4. iOS 백 제스처

iOS는 하드웨어 백 버튼이 없고 화면 좌측 엣지 스와이프 제스처를 사용. WebView 자체에서 처리되므로 RN의 `BackHandler` 로직은 iOS에서 무시됨 (성공적으로 cross-platform).

### A-5. iOS-specific WebView props

```tsx
<WebView
  // ...
  allowsBackForwardNavigationGestures={false} // iOS 좌측 스와이프 → goBack 비활성 (필요 시)
  allowsLinkPreview={false} // 길게 눌러서 미리보기 비활성
  bounces={false} // iOS 끌어당김 효과 차단
/>
```

---

## 10. OAuth 소셜 로그인 (인앱 Custom Tab)

### 문제

- 웹이 로그인 버튼에서 `window.location.href = authorizeUrl`로 **페이지 이동**하면, WebView가 외부 호스트(`nid.naver.com` 등)로 navigate → §4-B `shouldAllowNavigation`이 외부로 판정 → **시스템 크롬으로 새어나감**.
- 그러면 OAuth가 앱 밖(외부 크롬)에서 진행되고, 끝나고 돌아오는 `barogagiapp://` 콜백 딥링크를 앱이 잡기 어려워짐(콜백 유실).
- 구글은 WebView 내장(embedded) OAuth를 `disallowed_useragent`로 차단하기도 해, WebView 직접 로딩도 답이 아님.

→ 해법: 외부 크롬이 아니라 **인앱 Custom Tab**(`InAppBrowser.openAuth`)으로 열고, `redirectUrl` 딥링크를 직접 리슨해 콜백 URL을 promise로 돌려준다.

### 웹에서 완료한 작업

**파일**:
- [`src/utils/auth/startOAuthLogin.ts`](../src/utils/auth/startOAuthLogin.ts) (신설)
- [`src/components/auth/landing/LoginButtonSection.tsx`](../src/components/auth/landing/LoginButtonSection.tsx)
- [`src/utils/bridgeStorage.ts`](../src/utils/bridgeStorage.ts) — `loginWithOAuth` 타입 추가

로그인 버튼 → `getOAuthLink(type)`로 authorize URL 조회 후:

```ts
// 네이티브 앱: 인앱 Custom Tab으로 열고 콜백 URL을 받아 쿼리스트링만 추출
if (typeof window.BarogagiApp?.loginWithOAuth === "function") {
  const callbackUrl = await window.BarogagiApp.loginWithOAuth(authorizeUrl);
  if (!callbackUrl) return;                  // 사용자가 닫음(취소)
  const q = callbackUrl.indexOf("?");
  const search = q >= 0 ? callbackUrl.slice(q) : ""; // ? 없으면 빈 문자열 (실구현과 동일)
  navigate(`/auth/oauth/callback${search}`); // 기존 콜백 페이지가 토큰 처리·분기
}
// 브라우저: 표준 window.location.href 리다이렉트 (fallback)
```

- 받은 콜백 파라미터는 **기존 웹 콜백 페이지**([`OAuthCallbackPage`](../src/pages/auth/oauth/OAuthCallbackPage.tsx))가 그대로 처리 → 토큰 저장·FCM 동기화·신규/기존 회원 분기 로직 일원화.
- 웹은 콜백 **host(`auth`/`oauth`)를 보지 않고 쿼리스트링만** 읽음 → 백엔드/앱의 host 합의와 무관하게 동작.

### RN에서 해야 할 일

`window.BarogagiApp`에 `loginWithOAuth` 메서드 노출:

```ts
loginWithOAuth(authorizeUrl: string): Promise<string | null>;
```

```ts
import InAppBrowser from "react-native-inappbrowser-reborn";

const REDIRECT_SCHEME = "barogagiapp://oauth/callback"; // ⚠️ 백엔드 302 타깃과 정확히 일치(scheme+host+path)

async function loginWithOAuth(authorizeUrl: string): Promise<string | null> {
  if (!(await InAppBrowser.isAvailable())) {
    // Custom Tab 불가 단말 → 외부 브라우저 fallback (딥링크가 앱으로 돌아오도록 매니페스트 intent-filter 필요)
    Linking.openURL(authorizeUrl);
    return null;
  }
  const result = await InAppBrowser.openAuth(authorizeUrl, REDIRECT_SCHEME, {
    ephemeralWebSession: false,
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
  });
  // 성공: 콜백 딥링크 URL을 그대로 반환 → 웹이 쿼리스트링 파싱
  if (result.type === "success" && result.url) return result.url;
  return null; // cancel/dismiss
}
```

⚠️ **주의 — 이 메서드는 §7의 3초 timeout RPC를 쓰면 안 됨.** 사용자가 OAuth 화면에서 로그인하는 동안 수 초~수십 초가 걸리므로, `rpc()`의 3초 timeout에 걸려 끊긴다. `getData` 등과 **별도 분기**로 처리하거나, `loginWithOAuth` 전용으로 timeout 없이(또는 충분히 길게) 구현할 것.

### RN 측 체크리스트

- [ ] `react-native-inappbrowser-reborn` 설치 + **네이티브 모듈이므로 앱 재빌드**(JS 리로드만으론 미반영)
- [ ] `window.BarogagiApp.loginWithOAuth` inject (§7 injection 스크립트에 추가)
- [ ] **3초 timeout 우회** — 일반 RPC와 다른 경로로 처리
- [ ] `openAuth`의 `redirectUrl`이 **백엔드 302 타깃과 scheme+host+path 정확히 일치** (현재 합의값: `barogagiapp://oauth/callback`)
- [ ] AndroidManifest intent-filter(`scheme=barogagiapp`, `host=oauth`)가 동일 값으로 등록
- [ ] `result.type === 'success'`일 때 `result.url`을 통째로 반환 (웹이 토큰 파싱)
- [ ] cancel/dismiss 시 `null` 반환 (웹은 아무 동작 안 함)

---

## 11. 카카오톡 공유 (일정 공유 링크)

### 문제

- 일정 상세 화면의 **공유 버튼 → 카카오톡**은 카카오 JS SDK(`Kakao.Share.sendDefault`)로 카카오톡 공유창을 띄운다.
- SDK는 내부적으로 **`kakaolink://` 같은 커스텀 스킴**(Android는 `intent://`일 수 있음)으로 카카오톡 앱을 여는데, WebView는 http(s)가 아닌 스킴을 기본적으로 처리하지 못해 **아무 반응 없이 무시**될 수 있다.
- §10 OAuth와 **같은 계열의 문제**다(웹이 앱 밖 스킴/호스트로 나가려 할 때 WebView가 어떻게 처리하느냐).
- ⚠️ **`openExternal`로는 우회할 수 없다.** [`src/utils/openExternal.ts`](../src/utils/openExternal.ts)가 스킴을 검증해 **http/https만 허용**하고 그 외는 차단하기 때문(`javascript:`/`data:` 차단 목적). 카카오 스킴은 여기서 막힌다.
- **Web Share API(`navigator.share`)는 WebView에 없다.** 그래서 '더보기' 버튼은 앱에서 자동으로 숨겨진다(웹에서 처리 완료 — 아래 참조). 앱에서도 네이티브 공유 시트를 쓰려면 RPC가 필요하다.

> **전제(웹/RN 무관):** 카카오 개발자센터에 도메인이 등록돼 있어야 한다.
> - `플랫폼 키 > JavaScript 키 > JavaScript SDK 도메인` — SDK가 **실행될** 도메인
> - `제품 링크 관리 > 웹 도메인` — 공유 카드에 담길 **링크 대상** 도메인
> 둘 다 운영 도메인(`https://fitpl.xyz`)이 등록돼야 운영에서 동작한다.

### 웹에서 완료한 작업

**파일**:
- [`src/lib/kakao/kakaoShare.ts`](../src/lib/kakao/kakaoShare.ts) (신설) — SDK 동적 로드 + `Kakao.Share.sendDefault`
- [`src/components/main/plan/route/ShareBottomSheet.tsx`](../src/components/main/plan/route/ShareBottomSheet.tsx) (신설) — 카카오톡 / URL 복사 / 더보기
- [`src/utils/shareLink.ts`](../src/utils/shareLink.ts) (신설) — 서버가 주는 API 주소를 공유 페이지 주소로 변환

앱 환경에서 깨지지 않도록 웹에서 이미 방어해 둔 것:

```ts
// 1) SDK 로드/공유 실패를 전부 흡수 — 실패 시 false 반환 → 안내 모달만 뜨고 앱은 안 죽음
const ok = await shareToKakao({ url, title, description, imageUrl, buttonTitle });
if (!ok) alert(SHARE_TEXT.KAKAO_FAIL);

// 2) navigator.share 미지원(= WebView)이면 '더보기' 버튼 자체를 렌더하지 않음
const canWebShare = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";
```

→ **앱에서는 `카카오톡` / `URL 복사` 2개만 노출**되고, 카카오가 안 열려도 앱이 죽지는 않는다(안내만 뜸).

### RN에서 해야 할 일

### 🔴 실기기 확인 결과 (2026-08-07) — 원인 확정, **앱 측 수정 필요**

플레이스토어 배포본에서 **공유 → 카카오톡이 무반응**이다(모달도 안 뜨고 카카오톡도 안 열림).
브라우저(`fitpl.xyz` 직접 접속)에서는 정상 동작한다. 즉 WebView 전용 문제다.

**원인 (SDK 2.7.5 코드 실측):** Android 에서 SDK 는 아래 URL 로 `location.href` 이동한다.

```text
intent://send?<params>#Intent;scheme=kakaolink;launchFlags=0x14008000;package=com.kakao.talk;end;
```

이 요청이 §4-B `shouldAllowNavigation` 을 타고 `Linking.openURL(url)` 로 위임되는데,
**RN Android 의 `Linking.openURL` 은 내부적으로 `Uri.parse` 를 쓰기 때문에 `intent://` 를 해석하지 못한다.**
(`intent://` 는 `Intent.parseUri(url, Intent.URI_INTENT_SCHEME)` 로 파싱해야 한다)

그리고 실패가 **양쪽에서 삼켜진다**:

| 위치 | 코드 | 결과 |
| --- | --- | --- |
| RN §4-B | `void Linking.openURL(url).catch(() => {})` | 예외 무시 |
| 카카오 SDK | `try { Wr(n) } catch (e) {}` | 예외 무시 → `sendDefault` 가 throw 하지 않음 |

→ 웹에는 어떤 신호도 오지 않아 `shareToKakao` 가 성공으로 판단했다. 그래서 **무반응**.

#### 앱 측 수정 (근본 해결)

`shouldAllowNavigation` 에서 `intent://` 를 별도 분기한다. `intent://` 는 `scheme=` 파라미터에
원래 스킴(`kakaolink`)이 들어 있고, **평문 `kakaolink://` 는 `Linking.openURL` 로 정상 처리된다.**

```ts
// intent:// 는 Linking.openURL 이 처리하지 못한다 → scheme= 을 뽑아 평문 스킴으로 되돌린다.
const openIntentUrl = async (url: string) => {
  const scheme = url.match(/;scheme=([^;]+)/)?.[1];
  const fallback = url.match(/;S\.browser_fallback_url=([^;]+)/)?.[1];
  const body = url.slice("intent://".length).split("#Intent")[0];

  if (scheme) {
    try {
      await Linking.openURL(`${scheme}://${body}`);
      return;
    } catch {
      // 카카오톡 미설치 → 아래 폴백
    }
  }
  if (fallback) {
    try {
      await Linking.openURL(decodeURIComponent(fallback));
      return;
    } catch {}
  }
  // 최후: 마켓으로 유도 (package= 파라미터 사용)
};
```

> ⚠️ `SendIntentAndroid.openApp` / `react-native-send-intent` 같은 라이브러리를 쓰거나,
> 네이티브 모듈에서 `Intent.parseUri(url, Intent.URI_INTENT_SCHEME)` 로 직접 처리해도 된다.

#### 웹 측 임시 대응 (완료 — 이미 설치된 빌드에도 적용됨)

앱 재배포 전까지 죽은 버튼을 남기지 않기 위해, 웹이 **앱 전환이 실제로 일어났는지 관찰**한다.

- `sendDefault` 호출 후 `visibilitychange(hidden)` / `pagehide` 를 1.2초 대기
- 아무 이벤트도 없으면 전환 실패로 판단해 `false` 반환
- 호출부(`ShareBottomSheet`)가 **링크를 자동 복사**하고 "카카오톡을 열지 못했어요. 링크를 복사했으니 붙여넣어 공유해 주세요." 안내

구현: [`src/lib/kakao/kakaoShare.ts`](../src/lib/kakao/kakaoShare.ts) `waitForAppSwitch()`

> 이 대응은 **증상 완화**다. 카카오톡 공유창 자체는 앱 측 수정 후에야 뜬다.
> 앱이 고쳐지면 전환이 성공하므로 폴백은 자동으로 발동하지 않는다 — 웹 코드를 되돌릴 필요 없다.

---

#### 11-A. 커스텀 스킴 위임 확인 — ~~§4-B가 이미 커버할 가능성이 높다~~ **커버하지 못한다 (위 참조)**

§4-B의 `shouldAllowNavigation`이 구현돼 있어도 `intent://` 는 처리되지 않는다:

```ts
const isHttp = protocol === "http:" || protocol === "https:";
if (isHttp && isAppHost) return true;
...
// kakaolink:// 는 isHttp가 false라 여기로 위임됨 → 카카오톡 열림.
// Android intent:// 등에서 throw/거부될 수 있으므로 .catch로 흡수(아래 11-C 참조)
void Linking.openURL(url).catch(() => {});
return false;
```

- [ ] **먼저 실기기에서 공유 버튼을 눌러보고**, 안 되면 아래를 확인할 것.
- ⚠️ Android는 `intent://...#Intent;...;end` 형태로 올 수 있다. `Linking.openURL`이 이 스킴에서 **throw** 할 수 있으므로 `try/catch` 필요.

#### 11-B. `window.open` 경로 대응

카카오 SDK가 중간 팝업(`window.open`)을 타는 경우 RN WebView 기본 설정에선 무시된다.

```tsx
<WebView
  setSupportMultipleWindows={false}   // window.open을 현재 WebView에서 처리
  // 또는 onOpenWindow로 직접 가로채 Linking.openURL 위임
/>
```

#### 11-C. 카카오톡 미설치 대응

`Linking.openURL("kakaolink://...")`이 실패하면 사용자는 아무 일도 안 일어난 것처럼 느낀다.

```ts
try {
  await Linking.openURL(url);
} catch {
  // 카카오톡 미설치 → 마켓으로 유도하거나, 웹에 실패를 알려 'URL 복사'를 안내
}
```

#### 11-D. (선택) 네이티브 공유 시트 RPC — `share`

앱에서도 '더보기'(카톡 외 채널)를 쓰고 싶다면 RPC를 추가한다. **없어도 웹이 버튼을 숨기므로 깨지지 않는다.**

```ts
// §7의 핸들러에 추가
case 'share':
  await Share.share({ message: payload.url, title: payload.title });
  break;
```

추가하면 웹에서 `window.BarogagiApp.share` 분기를 넣겠다. (현재 `BarogagiApp` 인터페이스에 `share` 없음)

### RN 측 체크리스트

- [x] ~~실기기에서 공유 → 카카오톡 눌러보기~~ → **무반응 확인. 원인 확정(위 참조)**
- [ ] 🔴 `shouldAllowNavigation`에 **`intent://` 전용 분기 추가** — `scheme=` 추출 후 평문 스킴으로 `Linking.openURL`
- [ ] `.catch(() => {})` 로 실패를 조용히 삼키지 말 것 — 최소한 로그를 남겨야 다음 디버깅이 가능하다
- [ ] 카카오 SDK 팝업(`window.open`) 경로 대응 (`setSupportMultipleWindows={false}` 등)
- [ ] 카카오톡 미설치 시 폴백 동작 정의
- [ ] (선택) `share` RPC 추가 — 앱에서 '더보기' 지원할 경우

---

## 12. 앱 버전 조회 / 업데이트 안내

### 문제

웹은 자기가 어떤 **네이티브 앱 빌드** 안에서 돌고 있는지 알 방법이 없다.
그래서 "구버전 앱 사용자에게 업데이트를 안내한다"는 요구(이슈 #112)를 웹 단독으로는 만족할 수 없다.

`import.meta.env.VITE_APP_VERSION` 은 **웹 번들의 빌드 시점 값**이라 네이티브 빌드 버전과 무관하다.
게다가 현재 `.env.local` 에 미설정이라 빈 문자열이다.

→ 네이티브가 자기 버전을 알려주는 RPC 가 필요하다.

### 웹에서 완료한 작업

| 항목 | 위치 |
| --- | --- |
| 브릿지 타입 선언 (`getAppVersion?`, `getDeviceType?`) | `src/utils/bridgeStorage.ts` `declare global` |
| 버전 비교 유틸 (`compareVersion` / `isVersionBelow`) | `src/utils/appVersion.ts` |
| 버전 조회 (`getCurrentAppVersion`) — 브릿지 대기 + feature-detect + 실패 시 null | `src/utils/appVersion.ts` |
| 부팅 시 체크 훅 (앱 생애 1회) | `src/hooks/useAppUpdateCheck.ts`, `src/App.tsx` |
| 권장 업데이트 안내 모달 (기존 confirm 모달 재사용) | `src/hooks/useAppUpdateCheck.ts` → `confirmModalStore` |
| 앱 버전 변경 시 FCM 토큰 재등록 트리거 | `src/stores/fcmStore.ts`, `src/utils/fcm.ts` |

⚠️ **업데이트 필요 여부 판정부는 비어 있다(`TODO`).** 임계값(minVersion / latestVersion) 소스가
미확정이기 때문이다(신규 백엔드 API / Firebase Remote Config / Play In-App Updates 중 기획 결정 대기).
임계값을 코드에 하드코딩하지 않았다.

### RN에서 해야 할 일

`getAppVersion` RPC 하나만 추가하면 된다. `APP_VERSION` 상수는 이미 있다.

1. `src/utils/bridgeInterface.ts` — `getDeviceType` 아래에 추가.
   즉시 응답이므로 **기본 `rpc`(3초 timeout)** 를 쓴다. `rpcNoTimeout` 이 아니다.

```js
    // 앱 버전(config.ts APP_VERSION). 웹이 업데이트 필요 여부 판정에 사용.
    getAppVersion: function() {
      return rpc('getAppVersion', {});
    },
```

2. `src/screens/WebViewScreen.tsx` — import 에 `APP_VERSION` 추가 후,
   `case 'getDeviceType'` 블록 뒤 `default:` 앞에 case 추가.

```ts
        case 'getAppVersion': {
          respond(true, APP_VERSION);
          break;
        }
```

3. `src/constants/config.ts` 의 `APP_VERSION` 위에 **이중 관리 경고 주석**을 남긴다 —
   `android/app/build.gradle` 의 `versionName` 과 수동 동기화 상태다.
   릴리스에서 한쪽만 올리면 정상 사용자에게 업데이트 안내가 뜨거나 반대로 안 뜬다.

### 🕳️ 구버전 앱에는 이 메서드가 없다

`getAppVersion` 은 **앱을 새로 배포한 뒤부터만 존재한다.** 이미 스토어에 올라간 빌드에는 없다.
그래서 웹 타입 선언은 반드시 **`optional` + `typeof` 체크**여야 한다 (`getFcmToken?` 과 같은 이유).
필수로 선언하면 구버전 앱에서 타입이 거짓말을 하고 런타임에 터진다.

→ 결과적으로 "구버전 강제 업데이트"라는 원래 목적은 **다음 버전부터** 유효하다.
`getAppVersion` 부재를 "최소버전 미달"로 간주할지 조용히 skip 할지는 기획 결정 사항이다.
웹은 현재 **조용히 skip** 한다(아무 모달도 띄우지 않는다).

### 📌 문서화 누락 보강 — FCM 브릿지

`getFcmToken` / `getDeviceType` 은 **RN 에 이미 구현돼 있는데 이 문서에 전혀 없었다.**

| method | payload | 응답 | 비고 |
| --- | --- | --- | --- |
| `getFcmToken` | `{}` | `string \| null` | 권한 거부·미발급 시 null. 웹은 optional 로 선언 |
| `getDeviceType` | `{}` | `"ANDROID" \| "IOS"` | 웹 타입 선언이 누락돼 있었다 → 이번에 추가 |
| `getAppVersion` | `{}` | `string \| null` | **신규**. timeout 3초(기본 `rpc`) |

### RN 측 체크리스트

- [ ] `bridgeInterface.ts` 에 `getAppVersion` 등록
- [ ] `WebViewScreen.tsx` 에 `case 'getAppVersion'` 추가 + `APP_VERSION` import
- [ ] `config.ts` `APP_VERSION` 에 `versionName` 이중 관리 경고 주석
- [ ] 실기기 WebView 콘솔에서 `await window.BarogagiApp.getAppVersion()` → `"1.2.1"` 확인
- [ ] 기존 RPC(`getData` / `getFcmToken` / `getDeviceType`) 회귀 없음 확인
- [ ] (별 이슈) `versionName` 단일 소스화 — BuildConfig 브릿지 또는 `react-native-device-info`

---

## 변경 이력

| 날짜       | 내용                                                                                                                                         | 작성자            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 2026-05-15 | 최초 작성 (Android-only 기준)                                                                                                                | fitpl-front 팀 |
| 2026-05-15 | 웹 측 작업 완료 반영: tokenCache 추상화(§2), Safe Area utility(§6), 모달 백 핸들러 일괄 적용(§5). iOS 내용은 본문에서 분리하여 부록 A로 이동 | fitpl-front 팀 |
| 2026-06-13 | OAuth 소셜 로그인 인앱 Custom Tab 흐름 추가(§10): 웹 `loginWithOAuth` 브릿지 호출 전환. RN `openAuth` 구현 명세·3초 timeout 우회 주의 명시         | fitpl-front 팀 |
| 2026-07-17 | 카카오톡 공유 추가(§11): 웹은 SDK 연동·실패 흡수·`navigator.share` 미지원 시 '더보기' 자동 숨김까지 완료. RN은 §4-B가 `kakaolink://`를 이미 위임할 가능성이 높아 **실기기 확인이 먼저**. `openExternal`은 http(s)만 허용해 우회 불가임을 명시 | fitpl-front 팀 |
| 2026-07-26 | 앱 버전 조회 / 업데이트 안내 추가(§12): 웹은 타입 선언·버전 비교 유틸·부팅 체크 훅·권장 안내 모달·FCM 재등록 트리거까지 완료. RN은 `getAppVersion` RPC 추가만 필요(`APP_VERSION` 상수는 이미 존재). **구버전 앱에는 메서드가 없어 웹은 optional + typeof 체크**. 판정 임계값 소스는 기획 결정 대기라 판정부는 `TODO`. 기존에 문서화 누락돼 있던 FCM 브릿지(`getFcmToken`/`getDeviceType`)도 함께 보강 | fitpl-front 팀 |
