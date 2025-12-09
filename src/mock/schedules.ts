import type { Schedule, Tag } from "@/types/scheduleTypes";

export const mockTags: Tag[] = [
  { tagNum: 1, tagNm: "국내 여행", tagType: "AREA", categoryNum: 1 },
  { tagNum: 2, tagNm: "해외 여행", tagType: "AREA", categoryNum: 1 },
  { tagNum: 3, tagNm: "힐링", tagType: "THEME", categoryNum: 2 },
  { tagNum: 4, tagNm: "맛집", tagType: "THEME", categoryNum: 2 },
  { tagNum: 5, tagNm: "액티비티", tagType: "THEME", categoryNum: 3 },
  { tagNum: 6, tagNm: "업무", tagType: "THEME", categoryNum: 4 },
  { tagNum: 7, tagNm: "가족", tagType: "THEME", categoryNum: 4 },
];

export const mockSchedules: Schedule[] = [
  {
    scheduleNum: 1,
    membershipNo: 100,
    scheduleNm: "여행 준비",
    startDate: "2025-01-02",
    endDate: "2025-01-05",
    radius: 5,
    regDate: "2025-01-01 09:00:00",
    delYn: "N",
    updDate: "2025-01-01 09:00:00",
    tags: [mockTags[0], mockTags[2], mockTags[3]], // 국내 여행, 힐링, 맛집
  },
  {
    scheduleNum: 2,
    membershipNo: 100,
    scheduleNm: "부산 출장",
    startDate: "2025-02-10",
    endDate: "2025-02-12",
    radius: 3,
    regDate: "2025-02-01 10:20:00",
    delYn: "N",
    updDate: "2025-02-01 10:20:00",
    tags: [mockTags[0], mockTags[5]], // 국내 여행, 업무
  },
  {
    scheduleNum: 3,
    membershipNo: 100,
    scheduleNm: "동기 모임",
    startDate: "2025-03-03",
    endDate: "2025-03-03",
    radius: 2,
    regDate: "2025-02-28 14:00:00",
    delYn: "N",
    updDate: "2025-02-28 14:00:00",
    tags: [mockTags[3]], // 맛집
  },
  {
    scheduleNum: 4,
    membershipNo: 100,
    scheduleNm: "주말 휴식",
    startDate: "2025-03-15",
    endDate: "2025-03-16",
    radius: 1,
    regDate: "2025-03-01 12:30:00",
    delYn: "N",
    updDate: "2025-03-01 12:30:00",
    tags: [mockTags[2]], // 힐링
  },
  {
    scheduleNum: 5,
    membershipNo: 100,
    scheduleNm: "헬스 루틴",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    radius: 10,
    regDate: "2025-03-29 17:10:00",
    delYn: "N",
    updDate: "2025-03-29 17:10:00",
    tags: [mockTags[4]], // 액티비티
  },
  {
    scheduleNum: 6,
    membershipNo: 100,
    scheduleNm: "개발 프로젝트",
    startDate: "2025-05-02",
    endDate: "2025-05-31",
    radius: 4,
    regDate: "2025-05-01 09:15:00",
    delYn: "N",
    updDate: "2025-05-01 09:15:00",
    tags: [mockTags[5]], // 업무
  },
  {
    scheduleNum: 7,
    membershipNo: 100,
    scheduleNm: "가족 여행",
    startDate: "2025-06-10",
    endDate: "2025-06-15",
    radius: 8,
    regDate: "2025-06-01 18:00:00",
    delYn: "N",
    updDate: "2025-06-01 18:00:00",
    tags: [mockTags[0], mockTags[6]], // 국내 여행, 가족
  },
  {
    scheduleNum: 8,
    membershipNo: 100,
    scheduleNm: "친구 생일파티",
    startDate: "2025-07-20",
    endDate: "2025-07-20",
    radius: 2,
    regDate: "2025-07-01 11:40:00",
    delYn: "N",
    updDate: "2025-07-01 11:40:00",
    tags: [mockTags[3]], // 맛집
  },
  {
    scheduleNum: 9,
    membershipNo: 100,
    scheduleNm: "스터디 모임",
    startDate: "2025-08-05",
    endDate: "2025-08-05",
    radius: 1,
    regDate: "2025-08-01 16:00:00",
    delYn: "N",
    updDate: "2025-08-01 16:00:00",
    tags: [mockTags[5]], // 업무
  },
  {
    scheduleNum: 10,
    membershipNo: 100,
    scheduleNm: "연말 정산",
    startDate: "2025-12-20",
    endDate: "2025-12-22",
    radius: 3,
    regDate: "2025-12-01 08:30:00",
    delYn: "N",
    updDate: "2025-12-01 08:30:00",
    tags: [], // 태그 없음
  },
];

export const pastMockSchedules: Schedule[] = [
  {
    scheduleNum: 101,
    membershipNo: 100,
    scheduleNm: "겨울 방학 스키 여행",
    startDate: "2024-12-20",
    endDate: "2024-12-22",
    radius: 5,
    regDate: "2024-12-01 10:00:00",
    delYn: "N",
    updDate: "2024-12-01 10:00:00",
    tags: [mockTags[4]], // 액티비티
  },
  {
    scheduleNum: 102,
    membershipNo: 100,
    scheduleNm: "친구들과 연말 모임",
    startDate: "2024-12-28",
    endDate: "2024-12-28",
    radius: 2,
    regDate: "2024-12-15 14:30:00",
    delYn: "N",
    updDate: "2024-12-15 14:30:00",
    tags: [mockTags[3]], // 맛집
  },
  {
    scheduleNum: 103,
    membershipNo: 100,
    scheduleNm: "가을 힐링 캠핑",
    startDate: "2024-10-05",
    endDate: "2024-10-06",
    radius: 6,
    regDate: "2024-09-20 09:40:00",
    delYn: "N",
    updDate: "2024-09-20 09:40:00",
    tags: [mockTags[2]], // 힐링
  },
  {
    scheduleNum: 104,
    membershipNo: 100,
    scheduleNm: "해외 단기 출장",
    startDate: "2024-09-01",
    endDate: "2024-09-03",
    radius: 3,
    regDate: "2024-08-20 11:00:00",
    delYn: "N",
    updDate: "2024-08-20 11:00:00",
    tags: [mockTags[1], mockTags[5]], // 해외 여행 + 업무
  },
  {
    scheduleNum: 105,
    membershipNo: 100,
    scheduleNm: "부모님과 여름 가족 여행",
    startDate: "2024-07-10",
    endDate: "2024-07-12",
    radius: 8,
    regDate: "2024-07-01 15:20:00",
    delYn: "N",
    updDate: "2024-07-01 15:20:00",
    tags: [mockTags[0], mockTags[6]], // 국내 여행 + 가족
  },
];
