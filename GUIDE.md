# 🍼 API 연동 및 TanStack Query 사용 가이드

안녕하세요! 이 문서는 우리 프로젝트의 API 연동 방식과 TanStack Query 사용법을 쉽게 설명하기 위해 작성되었습니다.

## 📁 폴더 구조 설명

```
src/api/
├── endpoints.ts            # API 주소들이 모여있는 곳 (변경되면 여기서만 고치면 돼요!)
├── http.ts                 # Axios 설정 (토큰 자동 삽입, 에러 처리 등이 되어 있어요)
├── keyFactories/           # Query Key를 만드는 공장 (Key 실수 방지용)
├── queries/                # 실제 API를 호출하는 함수들
└── types/                  # API 요청/응답 타입 정의 (Swagger 보면서 만들었어요)
```

## 🚀 새로운 API 추가하는 법 (3단계)

### 1단계: 타입 만들기 (`src/api/types/`)

Swagger를 보고 `ReqDTO` (요청)와 `ResDTO` (응답) 타입을 만듭니다.

```typescript
// src/api/types/sampleTypes.ts
export interface SampleReqDTO {
  name: string;
}
```

### 2단계: 주소 추가하기 (`src/api/endpoints.ts`)

```typescript
export const ENDPOINTS = {
  SAMPLE: {
    GET: "/api/v1/sample",
  },
};
```

### 3단계: 함수 만들기 (`src/api/queries/`)

```typescript
// src/api/queries/sampleQueries.ts
import { http } from "../http";
import { ENDPOINTS } from "../endpoints";

export const getSample = async () => {
  const response = await http.get(ENDPOINTS.SAMPLE.GET);
  return response.data; // .data 안에는 실제 데이터가 들어있어요
};
```

---

## ⚡️ 컴포넌트에서 사용하기

### 데이터 조회 (useQuery)

`keyFactories`에서 키를 가져오고, `queries`에서 함수를 가져와서 사용합니다.

```typescript
import { useQuery } from "@tanstack/react-query";
import { scheduleKeys } from "@/api/keyFactories";
import { getScheduleList } from "@/api/queries";

const MyComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: scheduleKeys.lists(), // 키 생성
    queryFn: getScheduleList,       // 함수 연결
  });

  if (isLoading) return <div>로딩중...</div>;

  return (
    <ul>
      {data?.map(schedule => (
        <li key={schedule.scheduleNum}>{schedule.scheduleNm}</li>
      ))}
    </ul>
  );
};
```

### 데이터 수정/삭제 (useMutation)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSchedule } from "@/api/queries";
import { scheduleKeys } from "@/api/keyFactories";

const MyComponent = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      // 성공하면 목록을 새로고침해요!
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });

  return <button onClick={() => mutate(1)}>삭제하기</button>;
};
```

## 꿀팁 🍯

- **`BaseResponse`**: 모든 응답은 `code`, `message`, `data` 형태입니다. 공통 응답 타입이 적용되어 있으니 `response.data` 까지만 리턴하면 됩니다.
- **`http.ts`**: 토큰은 자동으로 헤더에 들어가니 신경 쓰지 않아도 됩니다!

궁금한 점이 있다면 언제든 물어봐주세요! 화이팅! 🐣
