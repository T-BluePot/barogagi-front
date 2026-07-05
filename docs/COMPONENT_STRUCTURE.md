# 컴포넌트 구조 (Component Structure)

핏플(Fitpl) 프론트엔드의 `src/` 디렉토리와 `src/components/` 구성 가이드입니다.
새 컴포넌트를 어디에 만들지, 기존 컴포넌트를 어디서 찾을지의 기준을 제공합니다.

> 이 문서는 **폴더 구조·배치 규칙**을 다룹니다. 헤더 자동 렌더링 시스템은
> [`src/components/layout/README.md`](../src/components/layout/README.md), 프로젝트 소개는 루트 [`README.md`](../README.md)를 참고하세요.

---

## 1. `src/` 최상위 구조

| 폴더 | 역할 |
|------|------|
| `api/` | 서버 통신 계층 — 엔드포인트, axios 클라이언트/인터셉터, DTO 타입(`api/types/`), 쿼리 함수(`api/queries/`), 쿼리 키 팩토리(`api/keyFactories/`) |
| `components/` | 화면을 구성하는 React 컴포넌트 (아래 2장) |
| `pages/` | 라우트에 매핑되는 페이지 컴포넌트 (`pages/auth/`, `pages/main/`) |
| `routes/` | 라우터 정의(`MainRoutes`, `AuthRoutes`) 및 가드 |
| `hooks/` | 재사용 훅 — `hooks/queries/`(조회), `hooks/mutations/`(변경), 그 외 UI/도메인 훅 |
| `stores/` | Zustand 전역 상태 (모달, 일정 draft, 지역 선택 등) |
| `types/` | UI 도메인 타입 (서버 DTO는 `api/types/`) |
| `utils/` | 순수 함수 유틸 — `utils/api/`(DTO↔UI 매퍼) 포함 |
| `constants/` | 라우트 경로, 헤더 설정, 텍스트 상수 |
| `lib/` | 외부 연동 초기화 (firebase, auth 토큰 캐시, RN 브릿지 등) |
| `styles/` · `globals.css` | 전역 스타일·디자인 토큰(`@theme`) |
| `mock/` · `stories/` | 목 데이터, Storybook 전역 설정 |

---

## 2. `src/components/` 구성 원칙

컴포넌트는 **재사용 범위**로 나눕니다.

```
components/
├── common/     # 도메인 무관 재사용 UI (버튼·모달·헤더·입력·태그·탭바 …)
├── layout/     # 앱 셸 레이아웃 (MainLayout, TabBarLayout)
├── route/      # 라우팅 가드 (PrivateRoute 등)
├── auth/       # 인증 플로우 전용 (로그인·회원가입·본인확인·아이디/비번 찾기)
└── main/       # 로그인 후 메인 기능 (home·plan·profile·settings)
```

- **`common/`**: 여러 기능에서 공유하는 순수 UI. 특정 도메인 로직을 몰라야 함.
- **`main/`**: 기능(feature)별 하위 폴더. 해당 기능 화면에서만 쓰는 컴포넌트.
- 어떤 컴포넌트가 두 기능 이상에서 재사용되기 시작하면 `common/`으로 승격을 검토.

### 2-1. `common/` 상세

| 폴더 | 담는 것 |
|------|---------|
| `buttons/` | `CommonButton`·`SmallButton`·`TextButton`·`ToggleSwitch` 등. 색상은 `buttonStyles.ts` 한 곳에서 관리 |
| `modal/` | 모달 3계열 (아래 2-3) + 전역 모달 마운트(`GlobalAlertModal`·`GlobalConfirmModal`) |
| `headers/` | 화면 상단 헤더 (`BackHeader`·`TitleHeader`·`CloseHeader`·`CommonHeader`) |
| `inputs/` | 공통 입력 (`CommonSelectBox`·`PillSelect` 등) |
| `tab-bar/` | 하단 플로팅 탭바 (`BottomTabBar`·`TabItem`) |
| `fab/` | 플로팅 액션 버튼 (`CreateScheduleActionButton`) |
| `tags/` | 태그·칩 (`CommonTag`·`SelectTag`) — 홈 전용 pill은 `common/Chip.tsx` |
| `loading/` | 스켈레톤 빌딩블록(`SkeletonBlock`) |
| `menu/`·`tab-menu/` | 메뉴·탭 메뉴 |
| (직속) | `SectionHeader`·`Chip`·`EmptyContent`·`IconBox` 등 소형 공통 요소 |

### 2-2. `main/` 상세 (기능별)

| 폴더 | 기능 |
|------|------|
| `home/` | 홈 화면 — 인사말·히어로 카드·핫플레이스·나의 일정·인기 태그 (`home/contents/`) |
| `plan/` | 일정 생성/조회 플로우 — `main/`(리스트·카드), `create/`·`route/`·`search/`, `common/modal/`(일정 폼·확인 모달) |
| `profile/` | 프로필 조회·수정·회원탈퇴 |
| `settings/` | 앱 설정 |

### 2-3. 모달 구조 (중요)

모달은 **"표현 컴포넌트 + Layout" 쌍**으로 구성하며, 계열별 하위 폴더에 함께 둡니다.

```
common/modal/
├── common-modal/        # 알럿·확인 다이얼로그
│   ├── CommonAlertModal.tsx        + CommonAlertModalLayout.tsx
│   ├── CommonConfirmModal.tsx      + CommonConfirmModalLayout.tsx
│   └── CommonModalContent.tsx
├── bottom-modal/        # 바텀시트 (react-modal-sheet 기반)
│   ├── CommonBottomModal / ActionBottomModal / ComfirmBottomModal
│   └── BottomModalLayout.tsx
├── full-screen-modal/   # 풀스크린 모달
│   ├── FullScreenModal.tsx         + FullScreenModalLayout.tsx
│   └── FullScreenModalContent.tsx
├── GlobalAlertModal.tsx / GlobalConfirmModal.tsx   # App에 1회 마운트, store로 제어
```

- `*Layout.tsx`는 **오버레이·애니메이션·safe-area·하드웨어 백 처리**를 담당하고,
  `*Modal.tsx`는 렌더링 여부·콘텐츠를 조립합니다. Layout은 반드시 대응 모달과 **같은 폴더**에 둡니다.
- 전역 모달은 store(`stores/*ModalStore.ts`)로 열고 닫습니다. 배경 클릭/하드웨어 백은
  취소 콜백을 실행하지 않고 **닫기만** 합니다(오작동 방지).

---

## 3. 컨벤션

- **파일명**: 컴포넌트는 PascalCase(`ScheduleCard.tsx`). 폴더는 kebab-case(`tab-bar/`).
- **스켈레톤**: 원본과 **같은 폴더**에 `Skeleton` 접두어로 생성(`SkeletonScheduleCard.tsx`).
- **Storybook**: 컴포넌트와 같은 폴더에 `*.stories.tsx` 공존.
- **데이터 매핑**: 서버 DTO(`api/types/`) → UI 타입(`types/`) 변환은 `utils/api/` 매퍼에서.
  absent 필드에 더미값 금지 — `undefined`/optional 유지.
- **색상**: `globals.css @theme` 토큰만 사용(`peach-*`·`main*`·`gray-*`). 컴포넌트에 임의 hex 금지.
- **접근성**: 아이콘만 있는 버튼은 `aria-label` 필수.

---

## 4. 데이터 흐름 요약

```
page (pages/*) 
  └─ 쿼리 훅(hooks/queries/*) → 쿼리 함수(api/queries/*) → axios(api/client) → 서버
       └─ DTO(api/types/*) ── 매퍼(utils/api/*) ──▶ UI 타입(types/*)
  └─ 컴포넌트(components/*)에 props 전달 → 렌더
  └─ 전역 상태는 stores/* (Zustand), 서버 캐시는 React Query
```
