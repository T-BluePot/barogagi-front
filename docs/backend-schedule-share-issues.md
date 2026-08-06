# 백엔드 전달 — 일정 공유 링크 API 이슈 정리

- 작성: 2026-07-17 / 대상: `test.fitpl.xyz` (실측 기준)
- 관련 API: `POST /api/v1/schedule/{scheduleNum}/share`, `GET /api/v1/schedule/share/{shareToken}`
- 프론트 대응 현황: **①은 프론트에서 우회 완료**(백엔드 수정 없어도 동작). 나머지는 확인/논의 요청.

> 아래는 전부 **테스트 서버에 직접 호출해 받은 실제 응답**입니다. 추측 없음.
> 재현 커맨드의 `$API_KEY` 는 `.env.local` 의 `VITE_API_KEY` 값입니다.

---

## 요약

| # | 항목 | 심각도 | 요청 |
|---|---|---|---|
| ① | **발급되는 공유 링크가 API 주소** → 브라우저로 열면 500 | 🔴 높음 | 페이지 주소로 발급 검토 |
| ② | 호출할 때마다 **새 토큰** 발급 | 🟡 중간 | 정책 확인 (동일 일정 = 동일 토큰?) |
| ③ | **만료 기간**이 문서에 없음 | 🟡 중간 | 기간 공유 |
| ④ | 스웨거 스펙이 실제와 불일치 (POST 인증) | 🟡 중간 | 스펙 수정 |
| ⑤ | 스웨거에 `data` 구조 미정의 | 🟡 중간 | 스키마 명시 |
| ⑥ | 스웨거에 없는 코드 `SS400` | 🟢 낮음 | 문서 추가 |
| ⑦ | 실패해도 HTTP 200 | 🟢 낮음 | 의도 확인 |
| ⑧ | **공유 링크 붙여넣기 시 미리보기 카드가 안 뜸** (SPA 한계) | 🔴 높음 | 크롤러 요청에 OG 메타 주입 |

---

## ① 🔴 발급되는 공유 링크가 "공유 불가능한 주소"입니다

### 현상
`POST /api/v1/schedule/7/share?environment=TEST` 의 응답:
```json
{
  "code": "S200",
  "message": "일정 공유 링크가 생성되었습니다.",
  "data": "https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H"
}
```
`data` 로 내려오는 값이 **사용자용 페이지 주소가 아니라 API 엔드포인트 주소**입니다.

### 문제
이 주소는 `API-KEY` 헤더를 요구하는데, **브라우저는 그 헤더를 보내지 않습니다.**
즉 이 링크를 카카오톡으로 보내면 수신자는 일정이 아니라 **에러 JSON** 을 보게 됩니다.

**재현:**
```bash
# 브라우저처럼 헤더 없이 접근 (= 링크를 받은 사람의 상황)
curl -i "https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H"
```
```
HTTP/1.1 500
Content-Type: application/json
{"code":"COMMON-500","message":"서버 오류가 발생했습니다.","data":null}
```

```bash
# API-KEY 를 넣으면 정상 (= 프론트가 호출하는 상황)
curl "https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H" -H "API-KEY: $API_KEY"
```
```
HTTP/1.1 200
{"code":"S202","message":"일정 조회에 성공하였습니다.","data":{ ...정상 데이터... }}
```

→ **데이터 자체는 완벽합니다. 링크의 "형태"만 문제입니다.**

### 프론트 대응 (이미 적용, 백엔드 수정 없이 동작)
응답 URL의 마지막 경로 조각(토큰)만 추출해 SPA 라우트로 재조립합니다.
```
https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H   ← 서버 응답
                                            ^^^^^^^^^^^^ 토큰만 사용
https://test.fitpl.xyz/share/8OD5dVzR8c1H                    ← 실제 공유되는 주소 (HTTP 200 text/html 확인)
```
구현: `src/utils/shareLink.ts` 의 `toSharePageUrl()`

### 요청
가능하다면 `data` 에 **페이지 주소**(`https://{도메인}/share/{token}`)를 내려주시면 좋겠습니다.
- 프론트가 URL을 재조립하지 않아도 되고,
- 링크 형태의 단일 기준이 서버에 생깁니다.

> **호환성 참고:** 프론트의 변환 로직은 **마지막 경로 조각을 토큰으로 취급**하므로,
> 서버가 페이지 주소로 바꿔서 내려줘도 **결과가 동일합니다.** 즉 **이 수정으로 프론트가 깨지지 않습니다.**
> 서버 수정 후 프론트에서 변환 로직을 걷어내는 건 별도로 정리하면 됩니다.

### 참고 — `environment` 파라미터는 정상 동작
`environment=TEST` → `test.fitpl.xyz` 도메인으로 발급되는 것 확인했습니다. 이 부분은 문제 없습니다.

---

## ② 🟡 호출할 때마다 새 토큰이 발급됩니다

### 현상
**같은 일정(scheduleNum=7)** 에 대해 연속 2회 호출:

| 호출 | 발급된 토큰 |
|---|---|
| 1회차 | `8OD5dVzR8c1H` |
| 2회차 | `nqw7vOzOvcg6` |

### 질문
1. **의도된 동작**인가요? (매 호출 = 새 공유 세션)
2. 아니면 **동일 일정은 동일 토큰**(미만료 시 재사용)이 맞나요?

### 영향
사용자가 공유 버튼을 누를 때마다 토큰이 계속 발급/누적됩니다.
프론트에서는 **일정별로 링크를 캐싱**해 호출 횟수를 줄일 예정이지만,
서버가 "동일 일정 = 동일 토큰(미만료 시)" 으로 동작해주면 더 깔끔합니다.

기존에 발급된 토큰들의 **정리(TTL·revoke) 정책**도 있으면 공유 부탁드립니다.

---

## ③ 🟡 만료 기간이 문서에 없습니다

만료된/없는 토큰 조회 시:
```json
{"code":"SS400","message":"해당 공유 정보가 만료되었거나 존재하지 않습니다.","data":null}
```
메시지에 **"만료"** 가 있으니 유효기간이 존재하는 것으로 보입니다.

**질문:**
1. 유효기간이 며칠(또는 몇 시간)인가요?
2. 만료와 "존재하지 않음"이 **같은 코드(`SS400`)** 로 합쳐져 있는데, 구분이 필요할까요?
   → 프론트에서 "만료된 링크예요 / 없는 링크예요" 를 다르게 안내하려면 구분이 필요합니다. 현재는 합쳐서 안내 예정.

---

## ④ 🟡 스웨거 스펙이 실제 동작과 다릅니다 (POST 인증)

**스웨거:** `POST /api/v1/schedule/{scheduleNum}/share` 의 파라미터에 **`API-KEY` 헤더만** 명시.

**실제:** API-KEY만 넣으면 거부됩니다.
```bash
curl -i -X POST "https://test.fitpl.xyz/api/v1/schedule/1/share?environment=TEST" -H "API-KEY: $API_KEY"
```
```
HTTP/1.1 401
{"resultCode":"COMMON-400", "message":"잘못된 요청입니다."}
```
로그인 토큰(`Authorization: Bearer ...`)을 함께 보내야 성공합니다.

> **동작 자체는 정상**이라고 봅니다 — 본인 일정만 공유할 수 있어야 하니까요.
> 다만 **스웨거에 `Authorization` 이 누락**돼 있어, 스펙만 보고 구현하면 401을 만나게 됩니다.

**추가:** 이 401 응답의 봉투가 다른 API와 다릅니다.
- 이 응답: `{"resultCode": "...", "message": "..."}` ← **`resultCode`**
- 일반 응답: `{"code": "...", "message": "...", "data": ...}` ← **`code`**

인증 필터 단계에서 나가는 응답으로 추정되는데, **의도된 것인지 확인** 부탁드립니다. 클라이언트가 봉투를 두 벌 파싱해야 합니다.

---

## ⑤ 🟡 스웨거에 `data` 구조가 정의돼 있지 않습니다

두 API 모두 응답 스키마가 아래로만 정의돼 있습니다:
```json
"ApiResponse": {
  "type": "object",
  "properties": {
    "code": {"type": "string"},
    "message": {"type": "string"},
    "data": {"type": "object"}     ← 내부 구조 없음
  }
}
```

`data` 가 빈 객체로만 표기돼 있어, **실제로 호출해보기 전에는 타입을 만들 수 없었습니다.**
(프론트 규칙상 추측 매핑이 금지돼 있어 실제 응답을 받을 때까지 작업이 멈췄습니다)

**실측한 실제 구조:**
```jsonc
// POST .../share  → data 는 문자열
"data": "https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H"

// GET .../share/{token} → data 는 객체 (기존 일정 상세와 동일 구조)
"data": {
  "scheduleNum": 7,
  "scheduleNm": "종로로",
  "startDate": "2026-03-01",
  "endDate": "2026-03-01",
  "radius": 3000,
  "planDetailVOList": [
    {
      "planNum": 319, "planNm": "링아센",
      "planLink": "http://place.map.kakao.com/944130251",
      "planDescription": "조용한 분위기와 맛있는 음식이 일품인 맛집",
      "planAddress": "전북특별자치도 전주시 완산구 삼천동1가 629-9",
      "planSource": null,
      "startTime": "08:00", "endTime": "09:00",
      "planMemo": "진짜 맛집이지",
      "imageLink": "https://img1.kakaocdn.net/...",
      "itemNum": 7, "itemNm": "디저트카페",
      "categoryNum": 2, "categoryNm": "카페",
      "regionVOList": [{ "regionNum": 1, "regionLevel1": "강원도", "regionLevel2": "강릉시", "regionLevel3": null, "regionLevel4": null }],
      "tagDetailVOList": [{ "tagNum": 11, "tagNm": "맛집", "tagType": "P", "categoryNum": 1 }]
    }
  ]
}
```

**요청:** 스웨거에 `data` 스키마를 명시해 주시면 좋겠습니다. 특히 POST 는 `string` 이라 `data: {}` (object) 표기와 **타입이 아예 다릅니다.**

**질문:** `planSource` 필드는 용도가 무엇인가요? (조회 시 `null` 로 내려옴 — 프론트에서 사용처가 없어 매핑하지 않았습니다)

---

## ⑥ 🟢 스웨거에 없는 응답 코드 `SS400`

스웨거의 `GET /api/v1/schedule/share/{shareToken}` 응답 목록에 `SS400` 이 없습니다.
(문서상: S202 / A100 / COMMON-400 / COMMON-500 / M201)

실제로는 만료·미존재 시 `SS400` 이 내려옵니다. 문서 추가 부탁드립니다.

또한 **API-KEY 를 아예 빼면 `COMMON-500`(서버 오류)** 가 나오는데, 인증 누락은 4xx 계열이 더 적절해 보입니다. (①의 원인이기도 합니다)

---

## ⑦ 🟢 실패해도 HTTP 200 으로 내려옵니다

```
GET /api/v1/schedule/share/dummytoken123  -H "API-KEY: ..."
→ HTTP 200
  {"code":"SS400","message":"해당 공유 정보가 만료되었거나 존재하지 않습니다.","data":null}
```

HTTP 상태는 200인데 내용은 실패입니다. 클라이언트가 `status` 로 분기하면 **만료된 링크가 성공으로 처리되어 빈 화면**이 뜹니다.

프론트는 **`code` 값으로 분기**하도록 구현했으니 동작에는 문제 없습니다.
다만 **전사 공통 컨벤션인지 확인** 부탁드립니다. (일부 응답은 401/500 등 실제 상태코드를 쓰고 있어 혼재돼 있습니다)

---

## ⑧ 🔴 공유 링크를 붙여넣으면 미리보기 카드가 안 뜹니다 (2026-08-07 추가)

### 현상

`/share/{token}` 링크를 카카오톡에 **붙여넣으면** 이렇게 뜹니다:

```text
기본 세팅
여기를 눌러 링크를 확인하세요     ← 카카오 기본 문구
```

일정 이름도, 첫 장소 사진도 안 나옵니다.

> 참고: 앱 안에서 **공유 > 카카오톡** 버튼으로 보내면 카드가 정상입니다.
> 그 경로는 카카오 SDK 가 카드 정보(제목·설명·썸네일)를 **직접 실어보내기** 때문에 OG 태그와 무관합니다.
> 이 이슈는 **URL 복사 후 붙여넣기 / 네이티브 공유 시트** 경로에만 해당합니다.

### 원인 — 프론트에서 해결이 불가능합니다

카카오톡 스크래퍼(`kakaotalk-scrap`)는 **JavaScript 를 실행하지 않습니다.**
이 앱은 SPA 라, 일정 데이터는 브라우저에서 JS 가 API 를 호출한 뒤에야 생깁니다.
스크래퍼가 받아가는 건 JS 실행 전의 빈 `index.html` 뿐이고, 거기엔 일정 정보가 없습니다.

React 로 `<meta>` 를 런타임에 주입해도 **스크래퍼는 그걸 못 봅니다.** 우회 방법이 없습니다.
→ **서버가 HTML 을 내려줄 때 메타 태그가 이미 박혀 있어야 합니다.**

### 요청 — `/share/{token}` 요청에 OG 메타 주입

기획상 카드에 넣기로 한 값은 아래와 같습니다.
**일정별로 달라지는 두 값(`og:title`, `og:image`)은 이미 공유 조회 API 응답 안에 있습니다.**
나머지 둘은 서버가 만들면 됩니다 — `og:description` 은 고정 문구, `og:url` 은 도메인과 토큰 조합입니다.

| OG 속성 | 값 | 출처 (`GET /api/v1/schedule/share/{token}` 응답) |
| --- | --- | --- |
| `og:title` | 일정 이름 | `data.scheduleNm` |
| `og:description` | `"새로운 일정이 기다리고 있어요. 핏플에서 확인해보세요."` | 고정 문구 |
| `og:image` | **일정의 첫 번째 장소 사진** | `data.planDetailVOList` 에서 `imageLink` 가 있는 첫 항목 |
| `og:url` | 공유 페이지 주소 | `https://{도메인}/share/{token}` |

```html
<meta property="og:type"        content="website" />
<meta property="og:site_name"   content="핏플" />
<meta property="og:title"       content="{scheduleNm}" />
<meta property="og:description" content="새로운 일정이 기다리고 있어요. 핏플에서 확인해보세요." />
<meta property="og:image"       content="{첫 장소 imageLink}" />
<meta property="og:url"         content="https://fitpl.xyz/share/{token}" />
```

> **문구를 임의로 바꾸지 말아 주세요.** 앱 안에서 **공유 > 카카오톡** 버튼으로 보내는 카드와
> 문구가 같아야 합니다. 같은 일정을 어떤 경로로 공유하든 수신자가 보는 카드가 동일해야 하는데,
> 지금은 SDK 경로(`src/constants/texts/main/share/index.ts`)와 이 OG 경로 두 벌로 관리됩니다.
>
> **선택 사항:** SDK 경로는 닉네임이 있으면 `"{닉네임}님이 일정을 공유했어요. 핏플에서 확인해보세요."` 를 씁니다.
> 서버가 일정 소유자 닉네임을 알 수 있다면 `og:description` 도 같은 형태로 내려주시면 더 잘 맞습니다.
> 어렵다면 위 고정 문구로 충분합니다.

구현 방식은 편하신 쪽으로 부탁드립니다. 떠오르는 선택지:

1. **크롤러 UA 분기 (가장 가벼움).** nginx 에서 `User-Agent` 가 `kakaotalk-scrap` / `facebookexternalhit` / `Twitterbot` 이면
   백엔드의 메타 렌더링 엔드포인트로 프록시하고, 일반 사용자는 지금처럼 `index.html` 을 그대로 받습니다.
   SPA 동작에 전혀 영향이 없습니다.
2. **`/share/{token}` 을 백엔드가 직접 서빙.** `index.html` 을 읽어 `</head>` 앞에 메타를 삽입해 응답합니다.

### 확인 부탁드릴 것

- `og:image` 로 쓸 `imageLink` 가 **외부에서 인증 없이 접근 가능한** URL 인가요?
  카카오 서버가 직접 가져가므로 API-KEY 가 필요하면 이미지가 안 뜹니다.
  (①번 이슈와 같은 계열입니다. 실측값은 `https://img1.kakaocdn.net/...` 라 공개 CDN 으로 보이는데 확인 부탁드립니다)
- 사진이 **하나도 없는 일정**일 때는 아래 기본 이미지를 써 주세요. 프론트에서 준비해 뒀습니다.
  `https://fitpl.xyz/og-image.png` (1200x630, 불투명 흰 배경)
- 카카오는 OG 를 캐싱합니다. 일정 이름이 바뀌어도 한동안 옛 카드가 뜰 수 있는데, 허용 범위인지 확인 부탁드립니다.

### 프론트에서 한 것 (부분 완화)

`index.html` 에 **고정** OG 태그를 넣었습니다 (제목·설명·사이트명·locale·이미지).
최소한 "기본 세팅 / 여기를 눌러 링크를 확인하세요" 는 더 이상 안 뜨고, 핏플 카드가 뜹니다.
다만 이건 **모든 링크에 동일한 값**이라, 일정별 제목·사진은 위 서버 작업이 있어야 나옵니다.

---

## 배포 인프라 공유 — 추가된 GitHub Secrets / 환경변수

공유 기능 때문에 **빌드 시점에 필요한 환경변수 2개**가 새로 생겼습니다. 배포 워크플로(`.github/workflows/deploy.yml`)는 GitHub Actions에서 빌드 후 산출물(`dist`)을 서버로 scp 하는 구조라, 이 값들이 **Actions 빌드 환경**에 있어야 번들에 반영됩니다.

| 변수 | 값 관리 방식 | 비고 |
| --- | --- | --- |
| `VITE_KAKAO_JS_KEY` | **GitHub Secret으로 추가함** (`Settings > Secrets and variables > Actions`) | 카카오 JS 앱키. 없으면 카카오톡 공유 버튼이 렌더되지 않음. 공개용 키라 노출돼도 무방(도메인 등록으로 보호) |
| `VITE_ENVIRONMENT` | 워크플로에 **리터럴로 직접 기입** (`main`→`TEST`, `release`→`PROD`) | 시크릿 아님. 서버가 이 값으로 발급할 공유 링크의 도메인을 결정 |

- `deploy.yml`의 `.env` 생성 스텝에 위 두 줄을 추가하는 변경은 **이 PR에 포함**됨.
- **운영/테스트 서버 자체 설정에는 영향 없음** (프론트 빌드 산출물만 바뀜). 서버 쪽에서 하실 일은 없습니다.
- 🔴 단, **카카오 개발자센터 도메인 등록**은 인프라와 무관하게 필요합니다:
  - `플랫폼 키 > JavaScript SDK 도메인` 과 `제품 링크 관리 > 웹 도메인` 양쪽에 `https://fitpl.xyz`(+`https://test.fitpl.xyz`) 등록.

> 참고: 배포 워크플로가 `npm install`로 빌드하는데 레포는 pnpm이라 lockfile이 무시되는 별개 이슈가 있습니다.
> 프론트 자체 이슈라 백엔드와 무관하며, `docs/ci-pnpm-migration.md`에 별도 정리해 두었습니다.

## 참고 — 배포 관련

- **SPA fallback 은 이미 정상입니다.** `fitpl.xyz` / `test.fitpl.xyz` 모두 `/share/{token}` 같은 임의 경로에 `index.html` 을 반환하는 것 확인했습니다 (`/` 와 md5 동일). **별도 요청 드릴 것 없습니다.**
- **`test.fitpl.xyz` 에 배포된 빌드가 현재 `dev` 보다 구버전**으로 보입니다. (배포본 `index.html` 에 `viewport-fit=cover` 가 없는데 레포에는 있음) 테스트 시 참고 부탁드립니다.
- `index.html` 에 **OG 태그가 없고 `<title>기본 세팅</title>`** 상태입니다. 카카오톡 링크 미리보기가 필요하면 별도 논의가 필요합니다. (카카오 SDK 공유는 SDK가 카드 정보를 직접 실어보내므로 영향 없음)
