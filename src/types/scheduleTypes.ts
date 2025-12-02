export interface Tag {
  tagNum: number;
  tagNm: string;
  tagType: string;
  categoryNum: number;
}

export interface Schedule {
  scheduleNum: number;
  membershipNo: number;
  scheduleNm: string;
  startDate: string;
  endDate: string;
  radius: number;
  regDate: string;
  delYn: "Y" | "N";
  updDate: string;
  tags: Tag[]; // 여기서 Tag 재사용
}
