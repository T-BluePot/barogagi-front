# 기기 식별자(deviceId) 도입 & FCM 토큰 정리

> 기준: `https://test.fitpl.xyz/v3/api-docs` 실측 + 백엔드 API 문서 + 회의록 (2026-08-26)
> 관련: [`docs/RN_BRIDGE.md`](./RN_BRIDGE.md)

## 배경

백엔드가 FCM 토큰을 **디바이스 단위로 저장·삭제**하도록 바꿨다.
기존에는 로그아웃/탈퇴 시 서버가 알아서 무효화했으나, **기기 구분이 안 돼 삭제가 실패**하던 문제가 있었다.
해결책으로 **프론트가 만든 `deviceId`** 를 로그인 시 함께 넘기고, 로그아웃 시 삭제 API 를 직접 호출한다.

```
POST   /api/v1/auth/login     body:  { userId, password, deviceId }
POST   /api/v1/auth/logout    header: REFRESH-TOKEN   → (membershipNo, deviceId) 의 토큰 REVOKE
POST   /api/v1/push/token     body:  { fcmToken, deviceType, appVersion }
DELETE /api/v1/push/token     query: fcmToken?, deviceType?
```

### ⚠️ `deviceType` 은 기기 종류가 아니다

FCM 저장/삭제 API 의 `deviceType` 필드 설명이 로그인의 `deviceId` 와 **동일하다** —
"기기를 식별할 수 있는 고유 데이터". `"ANDROID"` / `"IOS"` 를 넣는 자리가 아니다.
필드명 때문에 오해하기 쉬우니 주의. (백엔드에 개명 요청은 하지 않기로 함)

### ⚠️ 삭제 API 의 위험한 분기

| 파라미터 | 동작 |
| --- | --- |
| 둘 다 있음 | 해당 기기 토큰 삭제 |
| 둘 다 없음 | **회원 전체** 토큰 삭제 |
| **하나만 있음** | **회원 전체** 토큰 삭제 |

→ 기기 단위 삭제는 두 값이 **모두 있을 때만** 호출한다. 전체 삭제는 파라미터 없는 별도 경로로만.

---

## 구현 결과

| 영역 | 파일 |
| --- | --- |
| 식별자 발급 (first-write-wins) | `src/utils/deviceId.ts` |
| 인증 요청 주입 | `src/api/queries/authQueries.ts`, `src/utils/auth/startOAuthLogin.ts` |
| FCM 등록/삭제/재동기화 | `src/utils/fcm.ts`, `src/api/queries/pushQueries.ts` |
| 로그아웃 (강제 / 사용자) | `src/utils/auth/handleLogout.ts`, `src/utils/auth/handleUserLogout.ts` |
| 갱신 감지 훅 | `src/hooks/useFcmTokenResync.ts` |

### deviceId 발급 규칙

```
저장소에 있으면 → 그 값 사용 (다시 묻지 않음)
없으면          → BarogagiApp.getDeviceId?.()  → { id, source: "native" }
그것도 없으면    → UUID v4 생성                → { id, source: "local" }
```

- `persistent` 네임스페이스에 저장 — `clearAuthTokens()` 는 `secure` 의 토큰 키만 지우므로 로그아웃에 딸려가지 않는다
- `crypto.randomUUID()` 는 **https 에서만** 존재한다. 실기기 테스트는 `http://<PC IP>:8080` 이라
  `crypto.getRandomValues()` 폴백이 필수 (실기기 확인 완료)
- 저장소 **읽기 실패**와 **값 없음**을 구분한다. 뭉뚱그리면 일시적 실패에 기존 식별자를 덮어써 영구히 잃는다

### 호출 순서

```
로그아웃:  FCM 삭제 → logout API → fcmStore.reset() → clearAuthTokens() → 로그인 화면
탈퇴:      FCM 전체 삭제 → withdrawMe() → reset() → clearAuthTokens()
           (탈퇴 실패 시 FCM 재등록으로 복구)
```

⚠️ 회의록에는 "로그아웃 API 호출 후 FCM 삭제" 로 적혀 있었으나 **뒤집었다.**
로그아웃 API 가 이 기기 토큰을 REVOKE 하므로, 그 뒤에 삭제를 부르면 액세스 토큰까지
무효화된 경우 401 로 튕긴다. 순서를 바꾸면 그 위험이 사라진다.

### 부팅·포그라운드 복귀 시 재동기화 (`resyncFcmRegistration`)

```
1) 레거시("WEB") 등록 정리   ← 배포 직후 1회
2) 기기 식별자 승격 (local → native)
3) 토큰 로테이션 재등록
```

1)·2) 모두 **옛 등록 삭제에 성공했을 때만** 교체한다.
지우지 않고 바꾸면 같은 FCM 토큰이 옛/새 기기 행에 동시에 남아 **푸시가 두 번** 간다.

---

## 네이티브 팀 요청 — `getDeviceId()` 🟡 없어도 동작함

폴백(UUID)이 있어 **기다리지 않고 배포 가능하다.**
다만 폴백 값은 앱 재설치 시 소실되어 서버에 유령 기기가 쌓인다.

```ts
case 'getDeviceId':
  result = await DeviceInfo.getUniqueId();   // Android: ANDROID_ID / iOS: identifierForVendor
  break;
```

| 요구사항 | 내용 |
| --- | --- |
| 타입 | `string` (빈 문자열 금지 — 못 구하면 reject) |
| 안정성 | 앱 업데이트·**재설치**·로그아웃에도 동일 값 유지 |
| 금지 | 호출마다 새로 만드는 UUID, FCM 토큰 재사용(로테이션되므로) |

- 구버전 앱에는 없으므로 웹은 **optional + `typeof` 체크**로 선언했다 (`getFcmToken` 과 동일)
- 붙는 즉시 기존 사용자도 승격 로직으로 자동 전환된다
- ⚠️ 이름 충돌: `react-native-device-info` 의 `getDeviceType()` 은 `'Handset' | 'Tablet' | ...` 을
  반환한다. 기존 `getDeviceType()`(웹 미사용, 선언 주석 처리됨)과 다른 값이니 덮어쓰지 말 것

---

## 검증 현황

**완료** — 브라우저: deviceId 4경로(정상/최초/구버전/저장소 실패), 로그아웃·탈퇴·로테이션·승격·레거시 정리
**완료** — 실기기(폰 브라우저): `crypto` 폴백, deviceId 생성·유지, 로그인 통과, 로그아웃 후 식별자 생존

**미검증** (네이티브 앱 필요):
- 브릿지 경로 (`getDeviceId`, `getFcmToken`)
- 실제 푸시 수신
- **기기 구분** — 2대 중 1대 로그아웃 시 나머지 알림 유지 여부.
  서버에 기기 목록 조회 API 가 없어 클라이언트로는 확인 불가.
  어긋나면 삭제 API 파라미터만 교체하면 된다.

## 참고 — dev 환경

API 서버 CORS 허용 목록에 `http://localhost:8080` 만 있어, 실기기 테스트(`--host`)에서는
모든 API 가 preflight 에서 차단된다. `vite.config.ts` 의 `server.proxy` 로 우회한다
(LAN IP 접속일 때만 `API_BASE_URL` 을 비워 같은 출처로 요청 → dev 서버가 중계).
