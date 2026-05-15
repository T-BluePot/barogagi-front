# RN WebView 연동 명세서

이 문서는 **barogagi-front 웹앱(Vite + React)** 을 React Native WebView로 감싸기 위한 양측(웹/RN) 작업 명세입니다.

각 항목은 다음 구조로 정리됩니다:

> **문제** → **웹(barogagi-front)에서 한 작업** → **RN에서 해야 할 일** → **RN 측 현재 상태 체크 / 수정 가이드**

> 타깃 플랫폼: **Android only** (현 단계)
> OAuth 로그인 흐름은 백엔드와 별도 합의되어 본 문서 범위 외.

---

## 0. 배경

- 이 앱은 기존 웹앱(`barogagi-front`)을 React Native WebView로 감싼 하이브리드 앱입니다.
- 사용자에게는 네이티브 앱처럼 보이지만, 실제 화면은 모두 WebView 내부의 웹 페이지가 렌더링합니다.
- 웹 ↔ RN 통신은 다음 두 채널로 이뤄집니다:
  - **웹 → RN**: `window.ReactNativeWebView.postMessage(JSON.stringify(...))`
  - **RN → 웹**: `webViewRef.current.injectJavaScript('...')`
- 웹 코드는 `window.BarogagiApp`이라는 글로벌 객체가 존재한다고 가정하고 호출합니다. **이 객체는 RN 측에서 inject 해줘야 합니다.**

---

## 1. Storage (zustand persist · 인증 토큰 · 최근 검색)

### 문제

1. **iOS WKWebView는 앱 재시작 시 localStorage를 비우는 알려진 이슈**가 있어, 토큰 영속이 보장되지 않음. (현 단계는 Android only이므로 critical은 아니지만, 향후 iOS 확장을 위해 동일 인터페이스로 통일)
2. Android WebView는 localStorage를 유지하지만, 사용자가 앱 데이터를 지우거나 시스템이 저장공간을 정리하면 날아감. 토큰 같은 민감 데이터는 **EncryptedSharedPreferences**에 두는 게 안전함.
3. **세션 단위(앱 종료 시 자동 삭제)** vs **영속 단위** vs **보안 영속 단위**를 구분할 정책이 웹 단독으론 불가능. 네이티브 위임이 필요함.

### 웹에서 한 작업

- `src/utils/bridgeStorage.ts`를 RPC 패턴으로 재설계. 모든 storage 호출이 `requestId` 기반으로 RN 응답을 기다림.
- **3종 namespace 도입**:
  - `secure` — 토큰 (EncryptedSharedPreferences)
  - `persistent` — 영속 데이터 (MMKV)
  - `session` — 임시 draft류 (in-memory, 앱 종료 시 자동 삭제)
- 토큰 접근 7개 지점을 추상화 레이어로 통일하여 `secure` namespace 경유.
- zustand store별 namespace 매핑:

  | Store | Namespace | 비고 |
  |---|---|---|
  | `signupStore` (`signup:draft`) | `session` | 회원가입 임시 |
  | `scheduleStore` (`schedule:create:draft`) | `session` | 일정 생성 임시 |
  | `regionSelectionStore` (`plan:create:selected-regions`) | `session` | 임시 선택 |
  | `userPlaceStore` (`user-place`) | `persistent` | 최근 검색 영속 |
  | 인증 토큰 4종 | `secure` | 보안 영속 |

### RN에서 해야 할 일 (필수)

`window.BarogagiApp`에 다음 storage 메서드 3개를 노출. **모든 메서드는 비동기. 응답은 RPC 프로토콜(아래 §6) 준수.**

```ts
type Namespace = 'secure' | 'persistent' | 'session';

window.BarogagiApp = {
  getData(namespace: Namespace, key: string): Promise<string | null>;
  saveData(namespace: Namespace, key: string, value: string): Promise<void>;
  deleteData(namespace: Namespace, key: string): Promise<void>;
  // ... (다른 메서드는 §3, §4)
};
```

namespace별 백엔드 매핑:

```ts
import EncryptedStorage from 'react-native-encrypted-storage';
import { MMKV } from 'react-native-mmkv';

const persistent = new MMKV({ id: 'barogagi-persistent' });
const session = new Map<string, string>(); // 앱 재시작 시 자동 소멸

async function storageGet(ns, key) {
  if (ns === 'secure')     return await EncryptedStorage.getItem(key);
  if (ns === 'persistent') return persistent.getString(key) ?? null;
  if (ns === 'session')    return session.get(key) ?? null;
}
async function storageSet(ns, key, value) {
  if (ns === 'secure')     return await EncryptedStorage.setItem(key, value);
  if (ns === 'persistent') return persistent.set(key, value);
  if (ns === 'session')    { session.set(key, value); return; }
}
async function storageDel(ns, key) {
  if (ns === 'secure')     return await EncryptedStorage.removeItem(key);
  if (ns === 'persistent') return persistent.delete(key);
  if (ns === 'session')    { session.delete(key); return; }
}
```

### RN 측 현재 상태 체크리스트

- [ ] `react-native-mmkv` 설치 여부 확인
- [ ] `react-native-encrypted-storage` 설치 여부 확인
- [ ] `window.BarogagiApp.getData / saveData / deleteData` inject 구현 여부
- [ ] 3종 namespace 분기 구현 여부
- [ ] **session namespace는 in-memory `Map`으로 구현되어야 함** (절대 영속 저장소에 매핑하지 말 것 — 회원가입/일정 생성 도중 강제종료 시 잔존 draft가 다음 실행에 보이는 UX 버그 발생)
- [ ] 응답이 §6 RPC 프로토콜을 따르는지 (requestId echo, success/error)

만약 위 항목 중 미구현이 있으면 §6의 RPC 핸들러 + 위 storage 매핑 코드를 그대로 적용.

---

## 2. WebView 기본 props

### 문제

기본값으로 WebView를 띄우면:
- localStorage 비활성화 (`domStorageEnabled` 기본 false)
- 끌어당김 효과(over-scroll bounce)로 네이티브감 깨짐
- `window.open` 호출 시 새 WebView가 띄워질 수 있음
- 줌 가능

### 웹에서 한 작업

특별한 작업 없음. WebView prop 설정으로 해결되는 영역.

### RN에서 해야 할 일 (필수)

```tsx
<WebView
  ref={webViewRef}
  source={{ uri: 'https://your-domain' }}

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

### RN 측 현재 상태 체크리스트

- [ ] `domStorageEnabled={true}` 설정되어 있는가
- [ ] `setSupportMultipleWindows={false}` (없으면 `window.open`이 새 WebView 띄움)
- [ ] `onMessage` 핸들러 등록되어 있는가 (없으면 웹의 `postMessage`가 작동 안 함)
- [ ] `injectedJavaScriptBeforeContentLoaded`로 `window.BarogagiApp` 초기화 (`injectedJavaScript`가 아닌 `BeforeContentLoaded` — 페이지 스크립트보다 먼저 실행되어야 함)

---

## 3. 외부 링크 (카카오맵 등)

### 문제

웹 코드에서 `window.open(url, '_blank')` 호출 시 WebView는 새 탭 개념이 없어 무시되거나 같은 화면에서 열려 사용자가 앱에서 빠져나가게 됨.

### 웹에서 한 작업

다음 파일에서 `window.open(...)`을 `window.BarogagiApp.openExternal(url)`로 교체:

- `src/components/main/plan/search/LocationListItem.tsx`
- `src/components/main/plan/route/PlanDetailCard.tsx`

브릿지가 없는 환경(브라우저 직접 접속)에서는 `window.open` fallback.

### RN에서 해야 할 일 (필수)

#### 3-A. `openExternal` RPC 메서드 노출

```ts
// §6의 핸들러에 추가
case 'openExternal':
  Linking.openURL(payload.url);
  break;
```

#### 3-B. 외부 도메인 접근 자체를 가로채기 (안전망)

웹이 실수로 외부 URL로 navigate 했을 때도 시스템 브라우저로 위임:

```ts
const APP_HOST = 'your-domain.com'; // 실제 호스트로 교체

const shouldAllowNavigation = (req) => {
  const url = req.url;
  if (url.startsWith('about:') || url.includes(APP_HOST)) return true;
  Linking.openURL(url);
  return false;
};
```

### RN 측 현재 상태 체크리스트

- [ ] `window.BarogagiApp.openExternal` RPC 케이스 처리되어 있는가
- [ ] `onShouldStartLoadWithRequest`로 외부 호스트 가로채기가 있는가
- [ ] `APP_HOST` 상수가 실제 운영 도메인으로 설정되어 있는가

---

## 4. Android 하드웨어 백 버튼

### 문제

Android 하드웨어 백 버튼은 RN 레벨에서 잡힘. WebView는 자동으로 SPA의 history.back을 호출해주지 않음. 또한 SPA + WebView 조합에서 `onNavigationStateChange`가 React Router 변경을 감지하지 못하는 알려진 이슈가 있어, 단순히 `webView.goBack()`을 호출하면 의도와 다르게 동작함.

웹 측의 모달/바텀시트가 열려있을 때 백 버튼이 모달 닫기로 동작해야 하는 UX 요구도 있음.

### 웹에서 한 작업

`src/utils/nativeBackHandler.ts`를 신설하여 RN으로부터 `HARDWARE_BACK` 메시지를 수신.

처리 우선순위:
1. 열려있는 모달/바텀시트가 있으면 → 닫고 종료
2. React Router history에 뒤로 갈 페이지가 있으면 → `navigate(-1)`
3. 아무것도 없으면 → `window.BarogagiApp.exitApp()` 호출하여 앱 종료 위임

처리 결과를 RN에 알려서 RN이 `BackHandler` 이벤트를 swallow 할지 결정.

### RN에서 해야 할 일 (필수)

#### 4-A. BackHandler에서 웹으로 신호 전달

```ts
useEffect(() => {
  const sub = BackHandler.addEventListener('hardwareBackPress', () => {
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

#### 4-B. `exitApp` RPC 메서드

```ts
case 'exitApp':
  BackHandler.exitApp();
  break;
```

### RN 측 현재 상태 체크리스트

- [ ] `BackHandler.addEventListener('hardwareBackPress', ...)` 등록되어 있는가
- [ ] 핸들러가 `return true`로 기본 동작을 막는가 (`return false`면 앱이 즉시 종료되어 웹 처리 기회를 놓침)
- [ ] `injectJavaScript`로 `HARDWARE_BACK` 메시지를 dispatch 하는가
- [ ] `window.BarogagiApp.exitApp` RPC 케이스 처리되어 있는가

---

## 5. Edge-to-Edge / Safe Area Inset

### 문제

- **Android 15부터 edge-to-edge가 강제**되어, 시스템 UI 영역(상단 상태바·하단 제스처 바) 위에 콘텐츠가 깔림.
- 웹에서 `padding: env(safe-area-inset-top)` 등으로 회피하려 하지만, **WebView 138+에서 `env(safe-area-inset-*)`가 0을 반환하는 회귀**가 있음 (react-native-webview 이슈 #3828).
- 따라서 RN에서 직접 inset 값을 측정해 CSS 변수로 inject 하는 우회가 필요.

### 웹에서 한 작업

- `index.html`의 viewport meta에 `viewport-fit=cover` 추가.
- 헤더/탭바 등 시스템 UI에 닿는 컴포넌트들의 CSS를 다음 패턴으로 변경:

  ```css
  padding-top:    env(safe-area-inset-top,    var(--sai-top,    0px));
  padding-bottom: env(safe-area-inset-bottom, var(--sai-bottom, 0px));
  ```

  → `env()`가 정상 동작하면 그 값을 쓰고, 0/undefined면 RN이 inject한 CSS 변수 fallback.

### RN에서 해야 할 일 (필수)

`react-native-safe-area-context`의 `useSafeAreaInsets`로 inset을 읽고, 변할 때마다 WebView에 CSS 변수로 inject:

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

### RN 측 현재 상태 체크리스트

- [ ] `react-native-safe-area-context` 설치 여부 확인
- [ ] 앱 루트가 `<SafeAreaProvider>`로 감싸져 있는가
- [ ] WebView에 `--sai-*` CSS 변수가 inject 되는가 (Chrome DevTools로 WebView를 원격 디버깅하여 `document.documentElement.style`에서 확인 가능)
- [ ] inset 변경 시(회전 등) 재주입 되는가
- [ ] `onLoadEnd`에서도 inject 되는가 (페이지 새로고침 시 변수 유지 위함)

---

## 6. RPC 통신 프로토콜 (공통)

§1, §3, §4의 모든 메서드가 따르는 단일 RPC 규약.

### 메시지 포맷

**웹 → RN** (`postMessage`):

```json
{ "id": 1, "method": "saveData", "payload": { "ns": "secure", "key": "accessToken", "value": "..." } }
```

**RN → 웹** (`injectJavaScript`):

```json
{ "__bridgeResponse": true, "id": 1, "ok": true, "value": null }
```

또는 에러:

```json
{ "__bridgeResponse": true, "id": 1, "ok": false, "value": "에러 메시지" }
```

### 웹 측 inject 스크립트 (참고용 — 웹 코드에 이미 포함됨)

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
  const { id, method, payload } = JSON.parse(event.nativeEvent.data);

  // HARDWARE_BACK 같은 RN→웹 메시지가 웹→RN으로 echo 되는 케이스 방어
  if (method === undefined) return;

  try {
    let result = null;
    switch (method) {
      case 'getData':      result = await storageGet(payload.ns, payload.key); break;
      case 'saveData':     await storageSet(payload.ns, payload.key, payload.value); break;
      case 'deleteData':   await storageDel(payload.ns, payload.key); break;
      case 'openExternal': Linking.openURL(payload.url); break;
      case 'exitApp':      BackHandler.exitApp(); break;
      default:             throw new Error(`Unknown method: ${method}`);
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

### RN 측 현재 상태 체크리스트

- [ ] `onMessage` 핸들러가 `id`, `method`, `payload` 구조를 파싱하는가
- [ ] 각 method별 분기가 모두 구현되어 있는가 (위 5개)
- [ ] 응답 시 `window.__bridgeResolve(id, ok, value)`를 호출하는가 (이게 빠지면 웹 측 Promise가 3초 후 timeout)
- [ ] 응답 value를 `JSON.stringify`로 직렬화하는가 (escape 안 하면 따옴표 깨짐)
- [ ] 에러 발생 시에도 응답이 가는가 (안 가면 timeout)

---

## 7. 권장 라이브러리 (Android 우선)

```json
{
  "react-native-webview":           "^13.x",
  "react-native-mmkv":              "^3.x",
  "react-native-encrypted-storage": "^4.x",
  "react-native-safe-area-context": "^4.x"
}
```

---

## 8. 통합 체크리스트 (RN 측)

전체 작업 진행 상황을 한눈에:

### 환경
- [ ] 위 §7 라이브러리 4종 설치
- [ ] 앱 루트가 `<SafeAreaProvider>`로 감싸짐

### WebView 설정 (§2)
- [ ] `domStorageEnabled={true}`
- [ ] `setSupportMultipleWindows={false}`
- [ ] `onMessage` 등록
- [ ] `injectedJavaScriptBeforeContentLoaded`로 `window.BarogagiApp` 초기화

### Storage (§1)
- [ ] `secure` / `persistent` / `session` namespace 매핑 구현
- [ ] `session`은 반드시 in-memory `Map`

### 외부 링크 (§3)
- [ ] `openExternal` RPC 처리
- [ ] `onShouldStartLoadWithRequest`로 외부 호스트 가로채기
- [ ] `APP_HOST` 상수 운영 도메인으로 설정

### 하드웨어 백 (§4)
- [ ] `BackHandler` 등록 + `return true`
- [ ] `HARDWARE_BACK` 메시지 dispatch
- [ ] `exitApp` RPC 처리

### Safe Area (§5)
- [ ] `useSafeAreaInsets`로 `--sai-*` CSS 변수 inject
- [ ] inset 변경 시 재주입
- [ ] `onLoadEnd`에서도 재주입

### RPC 프로토콜 (§6)
- [ ] 모든 응답이 `window.__bridgeResolve(id, ok, value)` 형식
- [ ] 에러 발생 시에도 응답 전송 (timeout 방지)

---

## 변경 이력

| 날짜 | 내용 | 작성자 |
|---|---|---|
| 2026-05-15 | 최초 작성 (Android-only 기준) | barogagi-front 팀 |
