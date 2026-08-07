# 백엔드 전달 — 배포해도 앱에 반영되지 않는 문제 (nginx 캐시 헤더 요청)

- 작성: 2026-08-07 / 대상: `fitpl.xyz`, `test.fitpl.xyz` (nginx)
- 요청: `index.html` 응답에 `Cache-Control` 헤더 추가
- 프론트 수정으로는 해결 불가 — 서버가 내려주는 헤더 문제입니다.

---

## 증상

프론트를 배포해도 **앱에서 화면이 그대로**입니다. 앱을 삭제하고 재설치해야만 새 화면이 보입니다.

---

## 배경 — 파일이 두 종류입니다

프론트 빌드 결과물은 성격이 다른 두 종류로 나뉩니다.

| 종류 | 예시 | 특징 |
| --- | --- | --- |
| **해시 파일** | `/assets/index-DZ29B9OA.css` | 내용이 바뀌면 **파일명이 바뀝니다**. 배포마다 새 이름이 생김 |
| **`index.html`** | `/index.html` | 이름이 **항상 같습니다**. 위 해시 파일들을 가리키는 목차 역할 |

`index.html` 안에는 이렇게 들어 있습니다.

```html
<script src="/assets/index-BAVxSIa1.js"></script>
<link  href="/assets/index-DZ29B9OA.css">
```

즉 **`index.html` 만 최신이면 나머지는 알아서 따라옵니다.** 반대로 `index.html` 이 옛날 것이면, 그 안에 적힌 옛날 해시 파일만 계속 불러오게 됩니다.

---

## 원인 — 서버가 캐시 지침을 안 주고 있습니다

현재 응답 헤더입니다. **실제로 호출해 확인한 값입니다.**

```bash
curl -sI https://fitpl.xyz
```
```text
Server: nginx
Content-Type: text/html
Last-Modified: Fri, 07 Aug 2026 01:10:06 GMT
ETag: "6a75306e-ef7"
```

`Cache-Control` 헤더가 **없습니다.** `/assets/` 파일들도 마찬가지입니다.

브라우저와 앱(WebView)은 이 헤더가 없으면 **스스로 추측해서 캐싱합니다.** (HTTP 표준상 허용된 동작이며, `Last-Modified` 를 기준으로 "이 정도면 한동안 다시 안 물어봐도 되겠다"고 판단합니다.) 안드로이드 WebView 는 이 추측이 특히 공격적입니다.

그 결과:

```text
1. 앱이 index.html 사본을 저장해 둠
2. 프론트 배포 → 서버의 index.html 이 새 해시를 가리키도록 갱신됨
3. 앱은 저장해 둔 옛 index.html 을 그냥 사용 (서버에 물어보지 않음)
4. 옛 해시 파일만 계속 불러옴 → 화면이 그대로
5. 앱을 지웠다 깔면 캐시가 비워져서 그제야 최신이 보임
```

---

## 요청

nginx 설정에 아래를 추가해 주세요.

```nginx
# index.html: 쓰기 전에 반드시 서버에 최신인지 확인시킨다
location = /index.html {
    add_header Cache-Control "no-cache, must-revalidate";
}

# /assets/: 파일명에 해시가 있어 내용이 바뀌면 이름도 바뀐다 → 영구 캐싱해도 안전
location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

> SPA 라 `try_files $uri /index.html` 로 모든 경로를 `index.html` 에 넘기고 계실 텐데,
> 그 경우 `location = /index.html` 블록이 내부 리다이렉트에도 적용되도록
> `add_header ... always;` 를 붙이거나 `location / { ... }` 쪽에 함께 지정이 필요할 수 있습니다.
> 설정 구조를 모르니 이 부분은 확인 부탁드립니다.

### 프론트에서 바꿀 것은 없습니다

빌드 결과물이 이미 위 설정을 전제하는 구조입니다. 확인한 값입니다.

```text
dist/assets/     8개 — 전부 해시가 붙어 있음 (해시 없는 파일 0개)
dist/index.html  이름 고정
```

`/assets/` 를 통째로 1년 캐싱해도 안전한 이유가 이것입니다. 빌드 설정이나 코드 수정은 필요 없습니다.

### (낮은 우선순위) 이름이 고정된 나머지 파일

`dist` 루트에 이름이 고정된 파일이 더 있습니다. 위 두 블록 어디에도 걸리지 않아 지금처럼 추측 캐싱됩니다.

| 파일 | 캐싱될 때 영향 |
| --- | --- |
| `og-image.png` | 공유 카드 이미지를 교체해도 옛 이미지가 뜸 |
| `favicon.png` | 파비콘 교체가 반영 안 됨 |
| `firebase-messaging-sw.js` | 서비스워커 갱신 지연 (브라우저가 SW 는 특별 취급해 위험은 낮음) |

자주 바뀌는 파일이 아니라 **급하지 않습니다.** 여유 되실 때 아래 정도만 얹어 주시면 충분합니다.

```nginx
location ~ ^/(og-image|favicon)\.png$ {
    add_header Cache-Control "public, max-age=86400, must-revalidate";
}
```

---

## `no-cache` 는 "캐시 금지"가 아닙니다

이름이 헷갈리는데, **"저장은 하되 쓰기 전에 서버에 물어봐라"** 라는 뜻입니다. (저장 자체를 막는 건 `no-store` 입니다.)

트래픽 부담은 거의 없습니다. 이미 `ETag` 가 정상 동작하는 것을 확인했습니다.

```bash
curl -sI -H 'If-None-Match: "6a75306e-ef7"' https://fitpl.xyz
```
```text
HTTP/1.1 304 Not Modified
```

내용이 그대로면 **본문 없이 304 만** 돌아옵니다. `index.html` 은 4KB 남짓이라, 바뀐 경우에만 그 크기를 받습니다.

그리고 `/assets/` 를 1년 캐싱으로 지정하면 **오히려 지금보다 요청이 줄어듭니다.** 지금은 추측 캐싱이라 주기적으로 재검증 요청이 나가는데, `immutable` 을 주면 그마저 사라집니다.

---

## 적용 후 확인 방법

```bash
curl -sI https://fitpl.xyz | grep -i cache-control
```

이렇게 나오면 정상입니다.

```text
Cache-Control: no-cache, must-revalidate
```

---

## 참고 — 이미 캐시된 기기

헤더를 넣어도 **이미 옛 `index.html` 을 들고 있는 기기**는 그 캐시가 만료될 때까지 옛 화면을 봅니다. 만료 후 첫 접속부터 정상화되고, **그 이후의 모든 배포는 즉시 반영됩니다.**

즉 이 작업은 "지금 나간 배포를 당장 보이게" 하는 게 아니라, **"앞으로 배포가 반영되게"** 만드는 작업입니다. 빠를수록 좋습니다.
