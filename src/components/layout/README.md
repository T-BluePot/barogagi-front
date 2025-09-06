# Header Management System

## 🎯 개요

라우트별로 다른 Header 컴포넌트를 자동으로 렌더링하는 시스템입니다.

## 📁 구조

### 1. Layout 컴포넌트 (`src/components/layout/Layout.tsx`)

- 모든 페이지를 감싸는 최상위 레이아웃
- 현재 라우트에 맞는 헤더를 자동으로 렌더링
- App.tsx에서 사용

### 2. useHeaderConfig Hook (`src/hooks/useHeaderConfig.ts`)

- 라우트별 헤더 설정 관리
- 동적 라우트 매칭 지원
- 헤더 설정 동적 업데이트 기능

## 🎨 사용 가능한 Header 타입

| 타입     | 설명                      | 사용 예시              |
| -------- | ------------------------- | ---------------------- |
| `none`   | 헤더 없음                 | 랜딩 페이지, 풀스크린  |
| `back`   | 뒤로가기 버튼             | 상세 페이지, 폼 페이지 |
| `title`  | 제목만 표시               | 메인 페이지            |
| `close`  | 닫기 버튼                 | 모달 페이지            |
| `common` | 기본 헤더 (프로필 아이콘) | 일반 페이지            |

## ⚙️ 헤더 설정 방법

### 1. 기본 설정 (`useHeaderConfig.ts`에서)

```typescript
const HEADER_CONFIG: Record<string, HeaderConfig> = {
  "/": { type: "none" },
  "/auth/signin": {
    type: "back",
    label: "로그인",
    isDarkBg: true,
  },
  "/profile": {
    type: "back",
    label: "프로필",
  },
};
```

### 2. 동적 라우트 설정

```typescript
"/user/:id": {
  type: "back",
  label: "사용자 프로필"
}
```

### 3. 런타임에서 헤더 변경

```tsx
const updateHeaderConfig = useUpdateHeaderConfig();

// 특정 조건에 따라 헤더 변경
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
  isDarkBg?: boolean; // 다크 배경 여부
  rightAction?: () => void; // 우측 버튼 액션 (향후 확장)
  rightIcon?: ReactNode; // 우측 아이콘 (향후 확장)
}
```

## 📋 사용 예시

### App.tsx

```tsx
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
```

### 새로운 페이지 추가 시

1. `useHeaderConfig.ts`의 `HEADER_CONFIG`에 라우트 추가
2. 라우트 설정만으로 자동으로 헤더 적용됨

## 🚀 장점

1. **중앙 집중식 관리**: 모든 헤더 설정이 한 곳에서 관리
2. **자동화**: 라우트 변경 시 헤더 자동 변경
3. **타입 안정성**: TypeScript로 헤더 설정 타입 보장
4. **확장성**: 새로운 헤더 타입 쉽게 추가 가능
5. **동적 변경**: 런타임에서 헤더 설정 변경 가능

## 🔄 확장 방법

### 새로운 헤더 타입 추가

1. `HeaderType`에 새 타입 추가
2. `Layout.tsx`의 `renderHeader()`에 케이스 추가
3. 해당하는 Header 컴포넌트 생성

이 시스템으로 헤더 관리가 훨씬 간편하고 체계적이 됩니다! 🎉
