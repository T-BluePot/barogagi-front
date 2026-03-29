export interface Tag {
  tagNum: number;
  tagNm: string;
  tagType?: string;
  categoryNum?: number;
}

export interface Schedule {
  scheduleNum: number;
  scheduleNm: string;
  startDate: string;
  endDate: string;
  tags: Tag[];
  membershipNo?: number;
  radius?: number;
  regDate?: string;
  delYn?: "Y" | "N";
  updDate?: string;
}
