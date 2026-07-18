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

### 커밋 메시지 금지 사항
- **`Co-Authored-By: Claude ...` 트레일러를 넣지 않는다.** 어떤 AI 서명/공동작성자 트레일러도 커밋 메시지에 남기지 않는다.
- PR 본문 등 다른 산출물에도 AI 생성 표시를 넣지 않는다.

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

---

## 디자인 시스템 (필수 참조)

UI/스타일 작업(컴포넌트·페이지·색상·타이포·모션) 전에 반드시 아래 문서를 읽고 따른다.

| 문서 | 역할 |
|------|------|
| `.claude/design/DESIGN.md` | **핏플 팀 디자인 시스템 — 최우선 준수.** Sunset Peach 컬러, 타이포, 4px 그리드, 라운드/그림자, 모션, 카피 규칙의 단일 기준 |
| `.claude/design/DESIGN-apple.md` | Apple 디자인 분석 — **참고용.** 글라스모피즘(backdrop blur), 타이포 감각 등 특정 질감을 차용할 때만 참조 |

- 우선순위: **사용자 명시 요청 > DESIGN.md > DESIGN-apple.md**
- 두 문서가 충돌하면 DESIGN.md를 따르고, 사용자가 Apple 스타일을 명시적으로 요청한 부분만 예외로 한다.
- DESIGN.md의 토큰은 `src/globals.css`의 `@theme`(`--color-peach*`, `--ease-fitpl`)으로 관리한다 — 컴포넌트에 임의 hex 인라인 금지.
