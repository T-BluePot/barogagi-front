# 레이아웃 & 헤더 관리 시스템 (`src/components/layout`)

> 이 문서는 **`src/components/layout` 폴더**의 앱 셸 레이아웃과 **경로별 헤더 자동 렌더링 시스템**만 다룹니다.
> 프로젝트 전체 소개는 루트 [`README.md`](../../../README.md), 컴포넌트 폴더 전반의 구조는
> [`docs/COMPONENT_STRUCTURE.md`](../../../docs/COMPONENT_STRUCTURE.md)를 참고하세요.

## 📁 이 폴더의 파일

| 파일 | 역할 |
|------|------|
| `MainLayout.tsx` | 앱 셸 — 모든 페이지를 감싸며 경로별 헤더를 자동 렌더링. `App.tsx`에서 사용 |
| `TabBarLayout.tsx` | 하단 탭바 화면용 셸 — `<Outlet />` + 플로팅 탭바 + FAB. `MainRoutes`의 탭 라우트에서 사용 |
| `PageLoading.tsx` | 전체 화면 로딩 표시 |
| `SectionSpacer.tsx` | 섹션 간 간격용 스페이서 |

> 모달 레이아웃(`CommonAlertModalLayout` 등)은 각 모달 컴포넌트와 함께 `common/modal/*`로 이동했습니다.

---

## 🎯 헤더 관리 시스템 개요

경로(route)에 따라 다른 헤더 컴포넌트를 자동으로 렌더링하는 시스템입니다.

### 구조

1. **`MainLayout.tsx`** — 모든 페이지를 감싸는 최상위 레이아웃. 현재 경로에 맞는 헤더를 자동 렌더링하고 `App.tsx`에서 사용합니다.
2. **`useHeaderConfig` 훅 (`src/hooks/useHeaderConfig.ts`)** — 경로별 헤더 설정 관리, 동적 경로 매칭, 런타임 설정 변경 지원.

## 🎨 사용 가능한 Header 타입

| 타입     | 설명                      | 사용 예시              |
| -------- | ------------------------- | ---------------------- |
| `none`   | 헤더 없음                 | 랜딩 페이지, 풀스크린  |
| `back`   | 뒤로가기 버튼             | 상세 페이지, 폼 페이지 |
| `title`  | 제목만 표시               | 메인 페이지            |
| `close`  | 닫기 버튼                 | 모달 페이지            |
| `common` | 기본 헤더 (프로필 아이콘) | 일반 페이지            |

## ⚙️ 헤더 설정 방법

### 1. 기본 설정 (`useHeaderConfig.ts` / `constants/headerConfig.ts`)

```typescript
const HEADER_CONFIG: Record<string, HeaderConfig> = {
  "/": { type: "none" },
  "/auth/signin": {
    type: "back",
    label: "로그인",
  },
  "/profile": {
    type: "back",
    label: "프로필",
  },
};
```

### 2. 동적 경로 설정

```typescript
"/user/:id": {
  type: "back",
  label: "사용자 프로필"
}
```

### 3. 런타임에서 헤더 변경

```tsx
const updateHeaderConfig = useUpdateHeaderConfig();

useEffect(() => {
  updateHeaderConfig("/current-path", {
    type: "title",
    label: "새로운 제목",
  });
}, [someCondition]);
```

## 🔧 HeaderConfig 인터페이스

```typescript
interface HeaderConfig {
  type: "none" | "back" | "title" | "close" | "common";
  label?: string; // 헤더 제목
  isHeaderDark?: boolean; // 헤더 다크 배경 여부 (현재 라이트 테마 전환으로 전 경로 false)
  isContentDark?: boolean; // 콘텐츠 다크 배경 여부 (미지정 시 isHeaderDark 따라감)
  rightAction?: () => void; // 우측 버튼 액션 (향후 확장)
  rightIcon?: ReactNode; // 우측 아이콘 (향후 확장)
}
```

> ⚠️ 리디자인으로 다크 테마가 폐기되어 `isHeaderDark`/`isContentDark`는 현재 모든 경로에서 `false`입니다. 필드는 향후 확장을 위해 유지합니다.

## 📋 사용 예시

### App.tsx

```tsx
function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
```

### 새로운 페이지 추가 시

1. `constants/headerConfig.ts`의 `HEADER_CONFIG`에 경로 추가
2. 경로 설정만으로 자동으로 헤더 적용됨

## 🚀 장점

1. **중앙 집중식 관리**: 모든 헤더 설정이 한 곳에서 관리
2. **자동화**: 경로 변경 시 헤더 자동 변경
3. **타입 안정성**: TypeScript로 헤더 설정 타입 보장
4. **확장성**: 새로운 헤더 타입 쉽게 추가 가능
5. **동적 변경**: 런타임에서 헤더 설정 변경 가능

## 🔄 확장 방법 — 새로운 헤더 타입 추가

1. `HeaderType`에 새 타입 추가
2. `MainLayout.tsx`의 `renderHeader()`에 케이스 추가
3. 해당하는 Header 컴포넌트 생성 (`common/headers/`)
