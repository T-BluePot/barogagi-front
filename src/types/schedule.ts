export interface Schedule {
  scheduleNum: number; // 계획 번호
  userNum: number; // 회원 번호
  date: string; // YYYY-MM-DD
  scheduleTitle: string; // 계획명
  tags: string[]; // 태그
}
