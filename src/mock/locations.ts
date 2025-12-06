// 서버 연동 전 임시 타입: 이후 실제 API 스펙에 맞춰 확정 예정
export type location = {
  placeNum: number; // 내부 DB PK 역할
  locationNm: string;
  locationAddress: string;
};

export const mockRecentLocations: location[] = [
  {
    placeNum: 1,
    locationNm: "롯데월드타워",
    locationAddress: "서울특별시 송파구 올림픽로 300",
  },
  {
    placeNum: 2,
    locationNm: "링크아트센터 벅스홀",
    locationAddress: "서울특별시 종로구 혜화동 163-24 2층",
  },
  {
    placeNum: 3,
    locationNm: "서울숲",
    locationAddress: "서울특별시 성동구 뚝섬로 273",
  },
  {
    placeNum: 4,
    locationNm: "코엑스",
    locationAddress: "서울특별시 강남구 영동대로 513",
  },
  {
    placeNum: 5,
    locationNm: "한강시민공원 반포지구",
    locationAddress: "서울특별시 서초구 신반포로 11길 40",
  },
];

export const mockLocations: location[] = [
  {
    placeNum: 101,
    locationNm: "브런치 카페 그라운드",
    locationAddress: "경기 부천시 원미구 조마루로386번길 22",
  },
  {
    placeNum: 102,
    locationNm: "어반포레스트 카페",
    locationAddress: "서울 강남구 도산대로 318",
  },
  {
    placeNum: 103,
    locationNm: "성수 연무장길 카페거리",
    locationAddress: "서울 성동구 연무장길 25",
  },
  {
    placeNum: 104,
    locationNm: "카페 진정성",
    locationAddress: "서울 송파구 위례성대로 12",
  },
  {
    placeNum: 105,
    locationNm: "망원 한강공원",
    locationAddress: "서울 마포구 마포나루길 435",
  },
  {
    placeNum: 106,
    locationNm: "카페 템포",
    locationAddress: "서울 서초구 나루터로 55",
  },
  {
    placeNum: 107,
    locationNm: "해운대 블루라인파크",
    locationAddress: "부산 해운대구 구남로 13",
  },
  {
    placeNum: 108,
    locationNm: "동백공원",
    locationAddress: "부산 해운대구 동백로 99",
  },
  {
    placeNum: 109,
    locationNm: "카페 노티드 성수",
    locationAddress: "서울 성동구 성수이로 78",
  },
  {
    placeNum: 110,
    locationNm: "제주 함덕해수욕장",
    locationAddress: "제주 제주시 조함해안로 525",
  },
  {
    placeNum: 111,
    locationNm: "애월 더선셋",
    locationAddress: "제주 제주시 애월읍 애월해안로 2546",
  },
  {
    placeNum: 112,
    locationNm: "대구 앞산전망대",
    locationAddress: "대구 남구 조암로 19",
  },
  {
    placeNum: 113,
    locationNm: "카페 오브제",
    locationAddress: "경기 성남시 분당구 성남대로 381",
  },
  {
    placeNum: 114,
    locationNm: "인천 송도 센트럴파크",
    locationAddress: "인천 연수구 테크노파크로 196",
  },
  {
    placeNum: 115,
    locationNm: "속초 영금정",
    locationAddress: "강원 속초시 영랑해안길 35",
  },
  {
    placeNum: 116,
    locationNm: "강릉 안목해변 카페거리",
    locationAddress: "강원 강릉시 창해로 17",
  },
  {
    placeNum: 117,
    locationNm: "전주 한옥마을",
    locationAddress: "전북 전주시 완산구 기린대로 99",
  },
  {
    placeNum: 118,
    locationNm: "광주 국립아시아문화전당",
    locationAddress: "광주 동구 문화전당로 38",
  },
  {
    placeNum: 119,
    locationNm: "울산 대왕암공원",
    locationAddress: "울산 동구 등대로 95",
  },
  {
    placeNum: 120,
    locationNm: "수원 광교호수공원",
    locationAddress: "경기 수원시 영통구 광교호수로 57",
  },
];
