<div align="center">
  <img width="120" alt="fitpl logo" src="https://github.com/user-attachments/assets/e1da60ce-aa41-4537-be86-26798defa578" />
 
  # 🗺️ 핏플 (Fitpl)
  
  **AI 기반 스마트 일정 추천 플래너**
  
  [![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Storybook](https://img.shields.io/badge/Storybook-9.0-FF4785?logo=storybook&logoColor=white)](https://storybook.js.org/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[데모 보기](#) · [버그 리포트](https://github.com/T-BluePot/barogagi-front/issues) · [기능 제안](https://github.com/T-BluePot/barogagi-front/issues)

</div>

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 가이드](#-개발-가이드)
- [스크립트](#-스크립트)
- [컨벤션 가이드](#-컨벤션-가이드)
- [API 명세](#-api-명세)
- [로드맵](#-로드맵)
- [기여하기](#-기여하기)
- [팀](#-팀)

---

## 🎯 프로젝트 소개

> **"어디 갈지 고민하는 시간, 이제 그만!"**

친구들과 만나기로 했는데 어디를 갈지 정하느라 시간만 가고, 검색해도 원하는 결과가 안 나오는 경험, 누구나 있으시죠?

**핏플**은 키워드 기반으로 하루 일정을 자동으로 추천해주는 스마트 플래너입니다. 레고 블록을 쌓듯이 큰 일정만 선택하면, AI가 세부 장소와 루트까지 알아서 짜드립니다!

### 🤔 왜 바로가기를 만들었나요?

- 🔍 **검색의 고통**: "모밀집" 검색했는데 라멘집만 나옴
- ⏰ **시간의 낭비**: 어디 갈지 알아보는데 만남 시간의 절반 소모
- 🗺️ **루트의 혼란**: 효율적인 동선을 짜는 게 너무 어려움
- 👥 **의견 조율 지옥**: 친구들 취향 맞추기가 전쟁

### ✨ 핏플만의 해결책!

- ⚡ **키워드 기반 즉시 추천**: "카페 → 식사 → 데이트" 선택만으로 완성
- 🧩 **레고식 일정 구성**: 큰 틀만 사용자가, 세부는 AI가
- 🗺️ **스마트 루트 최적화**: 이동 시간을 고려한 효율적 동선
- 🎯 **맞춤형 추천**: 그룹 키워드 기반 모두가 만족하는 장소

---

## ✨ 주요 기능

### 🎨 홈 화면

- **트렌딩 핫플레이스**: 지금 인기 있는 장소를 실시간 랭킹으로 표시
- **롤링 애니메이션**: Framer Motion으로 구현한 부드러운 순위 변동
- **드래그 캐러셀**: 터치/드래그로 탐색하는 트렌딩 일정 목록

### 📅 스마트 일정 생성

- **키워드 기반 추천**: "카페", "맛집", "데이트" 등 키워드 선택
- **AI 자동 구성**: 선택한 키워드에 맞는 최적의 장소 추천
- **시간표 뷰**: 에브리타임처럼 직관적인 일정 시각화
- **태그 시스템**: 일정별 카테고리 분류 및 필터링

### 🗺️ 루트 최적화

- **이동 시간 계산**: 장소 간 실제 이동 시간 고려
- **효율적 동선**: 최단 거리 기반 순서 자동 조정
- **지도 시각화**: 트리플처럼 전체 루트를 지도로 표시

### 👥 그룹 기능

- **멤버 초대**: 친구들과 일정 공유
- **공동 키워드**: 그룹원들의 선호도 통합 분석
- **알림 시스템**: "이동할 시간이에요!" 실시간 알림

### 🔐 사용자 인증

- **이메일 회원가입**: 안전한 이메일 기반 계정 생성
- **OAuth 로그인**: Google, Kakao, Naver 소셜 로그인
- **계정 찾기**: 아이디/비밀번호 찾기 및 재설정

---

## 🛠️ 기술 스택

### Frontend

| 카테고리      | 기술              | 버전     | 설명                         |
| ------------- | ----------------- | -------- | ---------------------------- |
| **Core**      | React             | 19.1.0   | 사용자 인터페이스 라이브러리 |
|               | TypeScript        | 5.x      | 정적 타입 시스템             |
|               | Vite              | 6.x      | 번개같이 빠른 빌드 툴        |
| **Styling**   | Tailwind CSS      | 4.x      | 유틸리티 우선 CSS 프레임워크 |
|               | Emotion           | 11.14.0  | CSS-in-JS 라이브러리         |
|               | Material-UI       | 7.2.0    | React UI 컴포넌트            |
| **Animation** | Framer Motion     | 12.23.22 | 프로덕션 레벨 애니메이션     |
|               | React Modal Sheet | 4.4.0    | 모바일 바텀 시트             |
| **Routing**   | React Router DOM  | 7.6.3    | 클라이언트 사이드 라우팅     |
| **Form**      | Yup               | 1.6.1    | 스키마 기반 폼 검증          |
| **Date**      | date-fns          | 4.1.0    | 날짜 유틸리티                |
|               | React Datepicker  | 8.4.0    | 날짜 선택 컴포넌트           |
| **Utils**     | es-hangul         | 2.3.5    | 한글 처리 라이브러리         |
|               | clsx              | 2.1.1    | 조건부 className 유틸        |
| **Dev Tools** | Storybook         | 9.0.12   | 컴포넌트 주도 개발           |
|               | Vitest            | 3.2.3    | 단위 테스트 프레임워크       |
|               | ESLint            | 9.25.0   | 코드 품질 검사               |

### Backend (계획)

- **Database**: MariaDB (RDB)
- **API**: RESTful API
- **인증**: JWT + OAuth 2.0

---

## 🚀 시작하기

### �� 사전 요구사항

```bash
Node.js >= 18.x
npm >= 9.x (또는 yarn >= 1.22.x)
```

### ⚙️ 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone https://github.com/T-BluePot/barogagi-front.git
   cd barogagi-front
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **개발 서버 실행**

   ```bash
   npm run dev
   ```

   브라우저에서 http://localhost:8080 접속

4. **Storybook 실행**

   ```bash
   npm run storybook
   ```

   브라우저에서 http://localhost:6006 접속

5. **프로덕션 빌드**
   ```bash
   npm run build
   npm run preview  # 빌드 결과 미리보기
   ```

---

## 📁 프로젝트 구조

```
barogagi-front/
├── .storybook/              # Storybook 설정
│   └── main.ts             # Storybook 메인 설정
├── public/                  # 정적 파일
│   └── vite.svg
├── src/
│   ├── assets/             # 이미지, 아이콘
│   │   └── icons/          # SVG 아이콘
│   │       ├── barogagi.svg
│   │       ├── google-circle.png
│   │       ├── kakao-circle.png
│   │       └── naver-circle.png
│   │
│   ├── components/         # 재사용 컴포넌트
│   │   ├── auth/          # 인증 관련
│   │   │   ├── common/    # 공통 (Input, Button, etc)
│   │   │   ├── signin/    # 로그인
│   │   │   ├── signup/    # 회원가입
│   │   │   ├── find/      # 계정 찾기
│   │   │   └── verify/    # 본인 인증
│   │   │
│   │   ├── common/        # 전역 공통
│   │   │   ├── buttons/   # 버튼 컴포넌트
│   │   │   ├── headers/   # 헤더 컴포넌트
│   │   │   ├── inputs/    # 입력 컴포넌트
│   │   │   └── tags/      # 태그 컴포넌트
│   │   │
│   │   ├── layout/        # 레이아웃
│   │   │   ├── Layout.tsx
│   │   │   ├── BottomModalLayout.tsx
│   │   │   └── FullScreenModalLayout.tsx
│   │   │
│   │   ├── main/          # 메인 앱
│   │   │   ├── home/      # 홈 화면
│   │   │   │   ├── HomeGreetingSection.tsx
│   │   │   │   ├── HomeContentsSection.tsx
│   │   │   │   └── contents/
│   │   │   │       ├── ContentWrapper.tsx
│   │   │   │       ├── HotPlaceSection.tsx
│   │   │   │       ├── RankingList.tsx
│   │   │   │       ├── RankingItem.tsx
│   │   │   │       ├── TrendingCarousel.tsx
│   │   │   │       ├── TrendingCarouselItem.tsx
│   │   │   │       ├── TrendingScheduleSection.tsx
│   │   │   │       └── UpcomingScheduleSection.tsx
│   │   │   └── plan/      # 일정 관리
│   │   │       ├── CourseCard.tsx
│   │   │       └── ...
│   │   │
│   │   └── modal/         # 모달
│   │       ├── CommonAlertModal.tsx
│   │       ├── CommonConfirmModal.tsx
│   │       └── FullScreenModal.tsx
│   │
│   ├── constants/         # 상수
│   │   ├── routes.ts      # 라우트 경로
│   │   └── texts/         # 텍스트 상수
│   │       ├── auth/
│   │       └── main/
│   │
│   ├── hooks/             # 커스텀 훅
│   │   ├── useAppNavigation.ts
│   │   ├── useHeaderConfig.ts
│   │   └── usePhoneVerify.ts
│   │
│   ├── pages/             # 페이지
│   │   ├── auth/          # 인증 페이지
│   │   └── main/          # 메인 페이지
│   │       ├── HomePage.tsx
│   │       └── plan/
│   │
│   ├── routes/            # 라우팅
│   │   ├── AuthRoutes.tsx
│   │   └── MainRoutes.tsx
│   │
│   ├── styles/            # 스타일
│   │   ├── animations.css
│   │   └── README.md
│   │
│   ├── types/             # 타입 정의
│   │   ├── modalTypes.ts
│   │   ├── schedule.ts
│   │   └── auth/
│   │
│   ├── utils/             # 유틸리티
│   │   ├── authSchema.ts
│   │   ├── date.ts
│   │   └── regionFilter.ts
│   │
│   ├── App.tsx            # 루트 컴포넌트
│   ├── main.tsx           # 엔트리 포인트
│   └── globals.css        # 전역 CSS
│
├── .eslintrc.js           # ESLint 설정
├── .prettierrc            # Prettier 설정
├── tailwind.config.js     # Tailwind 설정
├── tsconfig.json          # TypeScript 설정
├── vite.config.ts         # Vite 설정
└── package.json           # 의존성 관리
```

---

## 💻 개발 가이드

### 컴포넌트 개발

1. **새 컴포넌트 생성**

   ```tsx
   // src/components/example/MyComponent.tsx
   import React from "react";

   interface MyComponentProps {
     title: string;
     onClick?: () => void;
   }

   export const MyComponent: React.FC<MyComponentProps> = ({
     title,
     onClick,
   }) => {
     return (
       <button
         onClick={onClick}
         className="typo-title-01 bg-main px-4 py-2 rounded-lg"
       >
         {title}
       </button>
     );
   };
   ```

2. **Storybook 스토리 작성**

   ```tsx
   // src/components/example/MyComponent.stories.tsx
   import type { Meta, StoryObj } from "@storybook/react-vite";
   import { MyComponent } from "./MyComponent";

   const meta: Meta<typeof MyComponent> = {
     title: "Components/Example/MyComponent",
     component: MyComponent,
     tags: ["autodocs"],
   };

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {
     args: {
       title: "Click Me",
     },
   };
   ```

### 스타일링 가이드

**Tailwind 유틸리티 우선**

```tsx
<div className="flex items-center gap-4 p-6 bg-main rounded-lg">
  <h1 className="typo-title-01">Title</h1>
</div>
```

**커스텀 타이포그래피**

- `typo-title-01`: 대제목 (28px, Bold)
- `typo-title-02`: 중제목 (20px, Bold)
- `typo-subtitle`: 소제목 (16px, SemiBold)
- `typo-body`: 본문 (14px, Regular)
- `typo-caption`: 캡션 (12px, Regular)
- `typo-tag`: 태그 (10px, Medium)

### 라우팅

```tsx
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const navigate = useNavigate();
navigate(ROUTES.MAIN.HOME);
```

---

## 📜 스크립트

| 명령어                    | 설명                             |
| ------------------------- | -------------------------------- |
| `npm run dev`             | 개발 서버 실행 (포트: 8080)      |
| `npm run build`           | 프로덕션 빌드 생성               |
| `npm run preview`         | 빌드 결과 미리보기               |
| `npm run lint`            | ESLint 코드 검사                 |
| `npm run storybook`       | Storybook 개발 서버 (포트: 6006) |
| `npm run build-storybook` | Storybook 정적 빌드              |

---

## 📐 컨벤션 가이드

### 커밋 메시지

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드, 패키지 매니저 설정 등
- `design`: CSS 등 UI 디자인 변경

**예시**

```bash
feat(auth): 이메일 로그인 기능 구현

- 이메일/비밀번호 검증 로직 추가
- 로그인 실패 시 에러 메시지 표시
- 로딩 상태 UI 구현

Closes #123
```

### 브랜치 전략

```
main              # 프로덕션 배포
├── develop       # 개발 통합
    ├── feature/  # 기능 개발
    ├── fix/      # 버그 수정
    ├── design/   # UI/UX 작업
    └── docs/     # 문서 작업
```

**브랜치 네이밍**

- `feature/login-page`
- `fix/ranking-animation`
- `design/main-page`
- `docs/readme`

### 코드 스타일

**파일/폴더 네이밍**

- 컴포넌트: `PascalCase` (MyComponent.tsx)
- 유틸/훅: `camelCase` (useAuth.ts)
- 상수: `UPPER_SNAKE_CASE`
- 타입/인터페이스: `PascalCase`

**컴포넌트 구조**

```tsx
// 1. Import
import React from "react";
import { useNavigate } from "react-router-dom";

// 2. Type/Interface
interface Props {
  title: string;
}

// 3. Component
export const MyComponent: React.FC<Props> = ({ title }) => {
  // 3-1. Hooks
  const navigate = useNavigate();

  // 3-2. State
  const [state, setState] = useState("");

  // 3-3. Effects
  useEffect(() => {
    // ...
  }, []);

  // 3-4. Handlers
  const handleClick = () => {
    // ...
  };

  // 3-5. Render
  return <div>{title}</div>;
};
```

---

## 📡 API 명세

> **작업 중** - 추후 업데이트 예정

### 인증 API

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/verify` - 토큰 검증

### 일정 API

- `GET /api/schedules` - 일정 목록 조회
- `POST /api/schedules` - 일정 생성
- `GET /api/schedules/:id` - 일정 상세 조회
- `PUT /api/schedules/:id` - 일정 수정
- `DELETE /api/schedules/:id` - 일정 삭제

### 추천 API

- `POST /api/recommend` - AI 기반 장소 추천
- `GET /api/trending` - 트렌딩 핫플레이스

---

## 🗺️ 로드맵

### Phase 1: MVP (현재)

- [x] 프로젝트 초기 설정
- [x] 인증 시스템 (회원가입/로그인)
- [x] 홈 화면 UI
- [x] 일정 생성 기본 UI
- [ ] 키워드 기반 추천 시스템
- [ ] 지도 연동

### Phase 2: 핵심 기능

- [ ] AI 기반 장소 추천
- [ ] 루트 최적화 알고리즘
- [ ] 시간표 뷰 구현
- [ ] 그룹 멤버 초대
- [ ] 실시간 알림

### Phase 3: 고도화

- [ ] 소셜 로그인 (Google, Kakao, Naver)
- [ ] 사용자 선호도 학습
- [ ] 일정 공유 기능
- [ ] 리뷰 시스템

### Phase 4: 최적화

- [ ] 성능 최적화
- [ ] SEO 개선
- [ ] PWA 적용
- [ ] 다국어 지원

---

## 🤝 기여하기

바로가기 프로젝트에 기여해주셔서 감사합니다!

### 기여 프로세스

1. **Fork** 이 저장소
2. **브랜치 생성** (`git checkout -b feature/AmazingFeature`)
3. **커밋** (`git commit -m 'feat: Add some AmazingFeature'`)
4. **Push** (`git push origin feature/AmazingFeature`)
5. **Pull Request 생성**

### 개발 미팅

- **주기**: 2주에 1회
- **요일**: 유동적 (매주 월요일 논의)
- **방식**: 온라인 또는 오프라인

### 다음 회의 TODO

- [ ] 컨벤션 가이드 최종 확정
- [ ] API 명세서 작성
- [ ] 플로우 차트 작성
- [ ] Use Case Diagram 작성
- [ ] GitHub 프로젝트 설정
- [ ] README 업데이트

---

## 👥 팀

**T-BluePot** - 열정 넘치는 개발자들의 모임

| 역할       | 담당자 | GitHub                                             |
| ---------- | ------ | -------------------------------------------------- |
| 프론트엔드 | 은우   | [@jeong-eun-woo](https://github.com/jeong-eun-woo) |
| 프론트엔드 | 서림   | [@Leeseoleem](https://github.com/Leeseoleem)       |
| 백엔드     | 효경   | [@dksgyrud1349](https://github.com/dksgyrud1349)   |
| 백엔드     | 다민   | [@RohDamin](https://github.com/RohDamin)           |

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- [React](https://reactjs.org/) - UI 라이브러리
- [Vite](https://vitejs.dev/) - 빌드 툴
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Framer Motion](https://www.framer.com/motion/) - 애니메이션
- [Storybook](https://storybook.js.org/) - 컴포넌트 개발 환경

---

<div align="center">
  
  **⭐ 이 프로젝트가 마음에 드셨다면 Star를 눌러주세요! ⭐**
  
  Made with ❤️ by T-BluePot Team
  
  © 2025 Barogagi. All rights reserved.
  
</div>
