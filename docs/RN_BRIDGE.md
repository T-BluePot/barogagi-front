# RN WebView 연동 명세서

이 문서는 **fitpl-front 웹앱(Vite + React)** 을 React Native WebView로 감싸기 위한 양측(웹/RN) 작업 명세입니다.

> 타깃 플랫폼: **Android only** (현 단계)
> OAuth 로그인 흐름은 백엔드와 별도 합의되어 본 문서 범위 외
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

## 변경 이력

| 날짜       | 내용                                                                                                                                         | 작성자            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 2026-05-15 | 최초 작성 (Android-only 기준)                                                                                                                | fitpl-front 팀 |
| 2026-05-15 | 웹 측 작업 완료 반영: tokenCache 추상화(§2), Safe Area utility(§6), 모달 백 핸들러 일괄 적용(§5). iOS 내용은 본문에서 분리하여 부록 A로 이동 | fitpl-front 팀 |
