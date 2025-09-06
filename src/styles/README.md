# CSS 구조 가이드

## 📁 CSS 파일 구조

### 1. `src/globals.css` - 전역 스타일

- 전역 CSS 변수 정의
- 기본 HTML 요소 스타일 (body, h1-h6, p 등)
- Tailwind CSS 커스텀 테마
- 타이포그래피 유틸리티 클래스 (`.typo-*`)

### 2. `src/styles/animations.css` - 공통 애니메이션

- 재사용 가능한 애니메이션 정의
- fade, scale, slide, bounce 등 범용 애니메이션
- 여러 컴포넌트에서 사용할 수 있는 애니메이션 유틸리티

### 3. `src/components/[feature]/[ComponentName].css` - 컴포넌트별 전용 스타일

- 특정 컴포넌트에만 사용되는 애니메이션
- 복잡한 컴포넌트별 스타일
- 예: `src/components/auth/landing/LogoAnimations.css`

## 🎯 사용 원칙

### ✅ 좋은 예시

```tsx
// 컴포넌트별 전용 CSS import
import "./ComponentName.css";

// 공통 애니메이션 사용 시
import "@/styles/animations.css";
```

### ❌ 피해야 할 것

```tsx
// globals.css에 컴포넌트별 애니메이션 추가 (X)
// 모든 스타일을 인라인으로 작성 (X)
```

## 📋 파일별 역할

| 파일                    | 용도                   | 예시                    |
| ----------------------- | ---------------------- | ----------------------- |
| `globals.css`           | 전역 설정, 기본 스타일 | 색상 변수, 타이포그래피 |
| `styles/animations.css` | 공통 애니메이션        | fadeIn, slideUp, bounce |
| `components/*/*.css`    | 컴포넌트별 전용 스타일 | LogoAnimations.css      |

이런 구조로 관리하면 유지보수가 쉽고 재사용성이 높아집니다! 🚀
