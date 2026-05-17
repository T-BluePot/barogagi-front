# 회고록 — RN WebView 래핑 사전 작업

> 브랜치: `feat/rn-webview-bridge`
> 기간: 2026-05-15
> 목표: 완성된 웹앱(Vite + React SPA)을 React Native WebView로 감싸기 위한 웹 측 사전 작업

---

## 1. 무엇을 했나

완성된 웹앱을 RN WebView 안에서 동작시키려면, 브라우저 전제로 짜인 코드의 여러 지점이 깨진다. 이를 사전에 정리했다.

### 1-1. 스토리지 추상화 (RN 브릿지)

- **문제**: zustand persist가 `sessionStorage`/`localStorage`에 직접 의존. RN WebView(특히 iOS)는 localStorage 영속이 보장되지 않고, "세션 단위 vs 영속 단위 vs 보안 영속" 구분을 웹 단독으로 못 함.
- **해결**: `bridgeStorage.ts`를 RPC 패턴으로 재설계하고 namespace 3종(`secure` / `persistent` / `session`) 도입. store 4종을 용도별로 매핑. 브릿지 없는 브라우저 환경은 fallback 유지(회귀 없음).

### 1-2. 인증 토큰 추상화

- **문제**: 토큰 4종이 7개 지점에서 `localStorage`를 직접 호출. 비동기 네이티브 보안 저장소(EncryptedSharedPreferences)로 옮기려면, axios 인터셉터·라우트 가드의 **동기 read** 요구와 충돌.
- **해결**: `lib/auth/tokenCache.ts` 신설 — in-memory cache + 영속 저장소 양방향 동기화. 앱 부팅 시 `bootstrapTokens()`로 hydration 후 React 트리 마운트. 9개 지점을 cache 함수로 통합.

### 1-3. 외부 링크 / 하드웨어 백 / Safe-area

- **외부 링크**: `window.open` → `openExternal()`(브릿지 경유, 미존재 시 새 탭 fallback).
- **하드웨어 백**: `nativeBackHandler.ts` + `useNativeBack` 훅. "모달 닫기 → 라우터 뒤로 → 앱 종료" 우선순위. 글로벌/바텀/풀스크린/Alert/Confirm 모달 일괄 적용.
- **Safe-area**: `viewport-fit=cover`, `pt/pb/pl/pr-safe` utility. Layout·탭바·모달·토스트·플로팅 버튼 등 적용.

### 1-4. 문서화

- `docs/RN_BRIDGE.md` — 웹에서 완료한 작업 + RN에서 해야 할 일을 섹션별로 정리. RN 작업자가 이 문서 하나로 네이티브 측 구현 가능하도록.

---

## 2. 발생한 오류와 디버깅 회고

### 2-1. 일정 수정 시 리스트 전체 사라짐 → 백엔드 이슈로 판명

- 일정 카드 수정 시 리스트가 통째로 사라지는 증상 보고.
- 우리 변경(모달 백 핸들러 등)이 원인인지 의심 → **브라우저 환경에선 `HARDWARE_BACK` 메시지가 오지 않아** 등록된 핸들러가 fire될 통로 자체가 없음을 근거로 무관함을 좁힘.
- dev 브랜치 재현 테스트 권유 → 백엔드 응답 문제로 확정. 우리 작업과 무관.
- **교훈**: "최근에 바꾼 게 원인"이라는 직관에 휘둘리지 말 것. 변경의 동작 경로를 따져 빠르게 배제하는 게 먼저.

### 2-2. dev 머지 충돌

- `CommonConfirmModalLayout.tsx`(우리: `useNativeBack` / dev: `severity`), `globals.css`(우리: safe-area utility / dev: warning keyframe) 충돌.
- 양쪽 변경이 의존성 없는 추가였으므로 둘 다 살려 해결. `globals.css`는 자동 머지 성공.

### 2-3. 캘린더 모드 레이아웃 — 가장 오래 헤맨 버그

**증상**: 캘린더 모드에서 날짜 미선택 시 회색 영역(`bg-gray-5`)이 화면을 안 채우고 콘텐츠(달력 그리드) 높이만큼만 그려짐. 캘린더가 큰 달(6주)은 회색이 거의 없고, 작은 달은 아래에 흰 빈 공간.

**빗나간 시도들** (각각 실패/regression):

| 시도 | 결과 |
|---|---|
| `CalendarView` `h-full` → `flex-1 min-h-0` | 선택+일정없음이 오히려 줄어듦 (regression) |
| 전 체인 `flex-1` 통일 | 화면이 **아예 깨짐** (흰 화면) |
| `min-h-full` | 차이 없음 |
| 미선택 시 `flex-1` spacer 추가 | 차이 없음 |

**전환점**: 화면을 못 보고 추측만으로 4번 빗나간 뒤, 사용자가 스크린샷 3장 제공. "캘린더가 크면 회색이 덮이고, 작으면 빈 공간"이라는 패턴이 결정적 단서가 됨.

**근본 원인**: `Layout.tsx`의 `<main className="flex-1 h-0 overflow-auto">`의 **`h-0`(`height: 0`)**.
CSS에서 자식의 `height: 100%`(`h-full`)는 **부모의 명시된 height 기준**으로 계산된다. 부모가 `height: 0`이면 자식 `h-full` = **0**.

- `h-full` 체인 시점: 자식들이 `h-full`=0이지만 `min-height:auto`라 콘텐츠 크기로는 그려짐 → 캘린더는 보이되 회색이 콘텐츠만큼만 (안 늘어남).
- `flex-1 + min-h-0` 체인 시점: `min-h-0`라 콘텐츠로도 안 늘어남 + 부모 0 → 전부 0, **아예 깨짐**.

→ **두 증상이 같은 원인의 양면**이었다. 그래서 하류(CalendarView/ScheduleListPage)를 아무리 만져도 소용없었다.

**해결**:
1. `Layout.tsx` main `h-0` → `min-h-0` — height % 기준을 0으로 강제하지 않아, flex로 늘어난 실제 높이가 자식에게 정상 전달.
2. 잔여: `pb-15`(탭바 회피용 패딩) 영역이 `bg-gray-5` 바깥이라 흰 띠로 남음 → calendar wrapper에 `bg-gray-5` 추가로 그 60px도 회색 처리. 탭바 회피(`pb-15`)는 유지.

---

## 3. 배운 것

1. **화면을 못 보면 추측 디버깅은 빗나간다.** 스크린샷 한 장이 추측 4번보다 빨랐다. 시각 버그는 시각 증거를 먼저 확보할 것.
2. **하류에서 아무리 고쳐도 상류 height 체인이 끊겨 있으면 소용없다.** 레이아웃 버그는 부모 방향으로 거슬러 올라가며 의심할 것. 특히 `h-0`(flexbox shrink 트릭)은 `min-h-0`로 쓰는 게 표준이며 안전하다.
3. **CSS `%` height + flexbox 함정**: percentage height는 부모의 *명시된* height 기준. flex로 stretch된 높이와 명시 height(`h-0`)가 공존하면 % 계산이 0이 된다.
4. **서드파티 컴포넌트는 flex 압력에서 보호.** `react-datepicker inline`은 고정 높이라 `flex-1` 컨테이너에 직접 넣으면 깨진다. `flex-none` wrapper로 격리해야 한다.
5. **한 번에 여러 개를 바꾸면 regression 추적이 불가능하다.** 변수를 하나씩 바꿔 검증하는 사이클로 전환한 뒤에야 원인이 좁혀졌다.
6. **"최근 변경 = 원인"이 아닐 수 있다.** 일정 수정 버그는 동작 경로 분석으로 빠르게 배제 → 백엔드 이슈로 확인.

---

## 4. 남은 일

- RN 측: `docs/RN_BRIDGE.md` §9 체크리스트 기반 네이티브 구현 (`window.BarogagiApp` inject, namespace 매핑, BackHandler, safe-area inset injection).
- RN ↔ 웹 통합 후 실기기 검증 (토큰 영속 / 하드웨어 백 / edge-to-edge).
- 브라우저 단독 검증: 로그인·세션 유지·로그아웃 + 토큰 자동 갱신(refresh)·refresh 실패 시 강제 로그아웃.
- 캘린더 모드 3케이스(미선택/일정없음/일정있음) 실기기 최종 확인.
- `Layout.tsx <main>` 변경은 전역 영향 → 머지 후 주요 화면 회귀 확인 권장.
