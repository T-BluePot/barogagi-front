# Claude 작업 규칙

## 커밋 메시지 형식

```
영소문자타입: 작업내용 (한국어)
```

| 타입 | 용도 |
|------|------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `design` | UI/스타일 변경 |
| `chore` | 설정, 문서, 도구 변경 |
| `test` | 테스트 추가/수정 |

예시:
```
feat: 일정 상세 조회 API 연동
fix: PlanDetailCard 토글 조건 수정
refactor: Schedule 타입 absent 필드 optional 처리
design: PlanDetailCard 레이아웃 gap 제거
```

---

## TypeScript 컨벤션

### API 타입 매핑 원칙
- **absent 필드에 더미값(0, "", "N") 절대 금지** — absent는 `undefined`로 남겨야 함
- 서버가 실제로 내려주는 필드만 매핑 (서버 응답을 직접 확인 후 타입 정의)
- 목록 API vs 상세 API의 응답 구조가 다를 경우, 없는 필드는 optional(`?`)로 정의
- 태그 등 중첩 DTO도 동일 — 실제 응답에 없는 필드는 optional

### 파일/폴더 구조
```
src/api/types/          # 서버 응답/요청 DTO 타입
src/types/              # UI 컴포넌트용 도메인 타입
src/utils/api/          # DTO → UI 타입 변환 매퍼
src/hooks/queries/      # React Query 조회 훅
src/hooks/mutations/    # React Query 변경 훅
```

---

## 접근성 원칙

- 아이콘만 있는 `<button>`에는 반드시 `aria-label` 추가
- 텍스트 없는 인터랙티브 요소 모두 동일 적용

---

## UI/스타일 원칙

- `gap`이 있는 flex 컨테이너에서 `h-0`으로 숨기는 요소는 gap이 여전히 적용됨
  → 토글 요소는 gap 컨테이너 **바깥**에 배치하거나 별도 패딩으로 처리
- 토글(열기/닫기) 조건: `planLink`가 없으면 카드 열지 않음
