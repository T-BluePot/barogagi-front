# 앱 전달 — 카카오톡 공유 무반응 (일정 상세)

- 작성: 2026-08-07 / 대상: fitpl 안드로이드 앱 (플레이스토어 배포본)
- 관련 웹 파일: `src/lib/kakao/kakaoShare.ts`, `src/components/main/plan/route/ShareBottomSheet.tsx`
- 상세 명세: `docs/RN_BRIDGE.md` §11

---

## 한 줄 요약

**앱에서 `intent://` 스킴이 처리되지 않아 카카오톡이 열리지 않습니다.** 웹 수정으로는 해결이 안 되고 앱 수정 + 스토어 배포가 필요합니다. 수정 범위는 `shouldAllowNavigation` 한 곳입니다.

---

## 증상

| 환경 | 결과 |
| --- | --- |
| 앱 (플레이스토어 배포본) | 일정 상세 > 공유 > 카카오톡 → **아무 반응 없음.** 카카오톡도 안 열리고 에러 모달도 안 뜸 |
| 모바일 브라우저 (`fitpl.xyz` 직접 접속) | 정상. 카카오톡 공유창 뜸 |

브라우저에서 되고 앱에서만 안 되므로 WebView 전용 문제입니다.

---

## 원인

### 1. 카카오 SDK는 Android에서 `intent://` 로 카카오톡을 엽니다 (실측)

`https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js` 를 직접 받아 확인한 코드입니다.

```js
// kakao.min.js 2.7.5 (난독화 해제 없이 원문)
var n = "".concat(Vt.os.ios ? rn.talkLinkScheme : "kakaolink://send", "?").concat(e),
    r = ["intent://send?".concat(e, "#Intent"),
         "scheme=kakaolink",
         "launchFlags=0x14008000"]
        .concat(["package=".concat(rn.talkAndroidPackage)], ["end;"]).join(";");
Qr(n, r);   // n = 평문 스킴, r = intent URI
```

즉 **Android에서는 `r`(intent URI)로 `location.href` 이동**합니다.

```text
intent://send?<params>#Intent;scheme=kakaolink;launchFlags=0x14008000;package=com.kakao.talk;end;
```

### 2. `Linking.openURL` 은 이 스킴을 처리하지 못합니다 (⚠️ 확인 필요 — 아래 30초 검증 참고)

`docs/RN_BRIDGE.md` §4-B의 `shouldAllowNavigation` 이 http(s)가 아닌 요청을 `Linking.openURL` 로 위임하는데,
**RN Android의 `LinkingModule` 은 내부적으로 `new Intent(ACTION_VIEW, Uri.parse(url))` 를 씁니다.**
`intent://` 는 `Uri.parse` 가 아니라 `Intent.parseUri(url, Intent.URI_INTENT_SCHEME)` 로 파싱해야 하는 형식이라,
`Uri.parse` 로는 scheme 이 `intent` 인 무의미한 Uri 가 되고 이를 처리할 액티비티가 없어 `ActivityNotFoundException` 이 납니다.

> 이 부분은 웹에서 직접 실행해 확인할 수 없었습니다. 아래 "30초 검증"으로 확정 부탁드립니다.

### 3. 실패가 양쪽에서 삼켜져 아무 신호도 안 남습니다 (실측)

| 위치 | 코드 | 결과 |
| --- | --- | --- |
| 앱 `WebViewScreen.tsx:274` | `Linking.openURL(url)` — **catch 없음** | 실패가 unhandled rejection 으로 날아감 |
| 카카오 SDK | `function Qr(e,t){ ... try { Wr(n) } catch (e) {} }` | 예외 무시 → `sendDefault` 가 throw 하지 않음 |

> **정정 (앱 팀 확인).** 이 문서 초안은 `docs/RN_BRIDGE.md` §4-B의 *템플릿* 코드(`.catch(() => {})`)를 기준으로 썼는데,
> 실제 앱 코드에는 `catch` 가 아예 없습니다. 문서보다 실제가 더 조용한 상태입니다.
>
> 이게 중요한 이유: **unhandled rejection 은 release 빌드에서 아무 데도 안 찍힙니다.** LogBox 는 dev 전용입니다.
> 즉 지금 플레이스토어 빌드에서는 로그를 아무리 뒤져도 단서가 안 나옵니다. 아래 검증은 반드시
> **`catch` 를 먼저 넣고 dev/debug 빌드에서** 돌려야 합니다.

그래서 웹에는 성공/실패 어떤 신호도 오지 않습니다. 웹은 성공으로 판단했고, 화면은 그대로였습니다.
**"무반응"의 정체가 이겁니다.**

---

## 30초 검증 (수정 전에 이것부터)

`shouldAllowNavigation` 의 `Linking.openURL` 에 **`catch` 를 추가**하고(현재 없음), dev/debug 빌드로
실기기에서 공유 → 카카오톡을 눌러보세요. release 빌드는 unhandled rejection 이 안 찍혀 소용없습니다.

```ts
const shouldAllowNavigation = (req) => {
  // ... 기존 http(s) + APP_HOST 허용 분기 ...

  console.log('[nav] 외부 위임 시도:', req.url);           // ← 추가
  Linking.openURL(req.url)
    .catch((e) => console.log('[nav] openURL 실패:', req.url, e));  // ← catch(()=>{}) 대신
  return false;
};
```

기대 출력:

```text
[nav] 외부 위임 시도: intent://send?...#Intent;scheme=kakaolink;launchFlags=0x14008000;package=com.kakao.talk;end;
[nav] openURL 실패: intent://send?... [Error: Could not open URL / No Activity found to handle Intent]
```

이 두 줄이 나오면 원인 확정입니다.

---

## 수정 (앱 측)

`intent://` 요청을 별도 분기해서, `scheme=` 파라미터에 들어 있는 **평문 스킴으로 되돌려** 엽니다.
평문 `kakaolink://` 는 `Linking.openURL` 이 정상 처리합니다.

```ts
/**
 * intent:// 는 Linking.openURL(내부적으로 Uri.parse)이 처리하지 못한다.
 * intent://<body>#Intent;scheme=<s>;...;S.browser_fallback_url=<url>;end;
 * → scheme 을 뽑아 <s>://<body> 평문 스킴으로 되돌려 연다.
 */
const openIntentUrl = async (url: string): Promise<void> => {
  const body = url.slice('intent://'.length).split('#Intent')[0];
  const scheme = url.match(/;scheme=([^;]+)/)?.[1];
  const fallback = url.match(/;S\.browser_fallback_url=([^;]+)/)?.[1];
  const pkg = url.match(/;package=([^;]+)/)?.[1];

  if (scheme) {
    try {
      await Linking.openURL(`${scheme}://${body}`);
      return;
    } catch (e) {
      console.log('[nav] 평문 스킴 실패(앱 미설치 추정):', scheme, e);
    }
  }

  // 카카오톡 미설치 등 — intent URI 가 지정한 폴백 웹페이지
  if (fallback) {
    try {
      await Linking.openURL(decodeURIComponent(fallback));
      return;
    } catch {}
  }

  // 최후: 스토어로 유도
  if (pkg) {
    try {
      await Linking.openURL(`market://details?id=${pkg}`);
      return;
    } catch {}
  }

  console.log('[nav] intent 처리 전부 실패:', url);
};
```

`shouldAllowNavigation` 에 연결합니다.

```ts
const shouldAllowNavigation = (req) => {
  const url = req.url;
  if (url.startsWith('about:')) return true;

  try {
    const { host, protocol } = new URL(url);
    const isHttp = protocol === 'http:' || protocol === 'https:';
    const isAppHost = host === APP_HOST || host.endsWith(`.${APP_HOST}`);
    if (isHttp && isAppHost) return true;
  } catch {}

  // intent:// 전용 분기 — 반드시 일반 openURL 위임보다 먼저
  if (url.startsWith('intent://')) {
    void openIntentUrl(url);
    return false;
  }

  void Linking.openURL(url).catch((e) => console.log('[nav] openURL 실패:', url, e));
  return false;
};
```

> 대안: `react-native-send-intent` 를 쓰거나, 네이티브 모듈에서 `Intent.parseUri(url, Intent.URI_INTENT_SCHEME)` 로 직접 처리해도 됩니다.
> 위 방식은 라이브러리 추가 없이 되고 `launchFlags` 를 잃는 것 외엔 동작 차이가 없어 이걸 우선 제안합니다.

---

## 함께 확인 부탁드릴 것

- **`setSupportMultipleWindows={false}`** 가 걸려 있는지. 카카오 SDK가 중간에 `window.open` 을 타는 경로가 있는데, 이게 없으면 그 경로도 조용히 무시됩니다. (`docs/RN_BRIDGE.md` §3, §11-B)
- **`catch` 없이 `Linking.openURL` / RPC 를 부르는 다른 지점**. 이번 건의 원인 파악이 오래 걸린 이유가 실패가 아무 데도 안 남아서였습니다. 최소한 `console.log` 는 남기는 쪽으로 부탁드립니다.

---

## 웹 측 임시 대응 (이미 배포 예정 — 알아만 두시면 됩니다)

앱 재배포 전까지 버튼이 무반응으로 죽어 있는 걸 막기 위해, 웹이 **앱 전환이 실제로 일어났는지 관찰**합니다.

- `sendDefault` 호출 후 `visibilitychange(hidden)` / `pagehide` 를 1.2초 대기
- 아무 이벤트도 없으면 전환 실패로 판단
- 실패 시 **공유 링크를 자동으로 클립보드에 복사**하고 "카카오톡을 열지 못했어요. 링크를 복사했으니 붙여넣어 공유해 주세요." 안내

구현: `src/lib/kakao/kakaoShare.ts` 의 `waitForAppSwitch()`

**앱이 고쳐지면 전환이 성공하므로 이 폴백은 자동으로 발동하지 않습니다.** 웹 코드를 되돌릴 필요 없습니다.
반대로 말하면, 앱 수정 후 테스트할 때 **"링크를 복사했으니" 안내가 더 이상 안 뜨는 것**이 성공 판정 기준입니다.

---

## 체크리스트

- [ ] `WebViewScreen.tsx:274` 에 `catch` 추가 (현재 없음) + dev/debug 빌드로 30초 검증
- [ ] `intent://` + `openURL 실패` 로그 확인
- [ ] `shouldAllowNavigation` 에 `intent://` 분기 추가
- [ ] `setSupportMultipleWindows={false}` 확인
- [ ] 실기기: 일정 상세 > 공유 > 카카오톡 → 카카오톡 공유창이 뜨는지
- [ ] 카카오톡 **미설치** 단말에서 스토어 유도까지 동작하는지
- [ ] 성공 시 웹의 "링크를 복사했으니" 안내가 **안 뜨는지**
