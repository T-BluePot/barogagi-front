/**
 * 메인 홈(Home) 관련 API 타입 정의
 */

/** 유저 일정 요약 정보 */
export interface UserInfoResponseDTO {
  scheduleNum: number;
  scheduleNm: string;
  startDate: string;
  planNum: number;
  categoryNm: string;
}

/** 태그 정보 */
export interface TagInfoDTO {
  tagNum: number;
  tagNm: string;
  tagType: string;
}

/** 지역 정보 */
export interface RegionInfoDTO {
  regionLevel1?: string;
  regionLevel2?: string;
  regionLevel3?: string;
  regionLevel4?: string;
}

/** GET /api/v1/home/me/schedules 응답 타입 */
export interface HomeScheduleResponseDTO {
  resultCode: string;
  message: string;
  userInfoResponseDTO: UserInfoResponseDTO | null;
  tagInfoList: TagInfoDTO[];
  regionInfoDTO: RegionInfoDTO | null;
}

/** GET /api/v1/home/tags/popular 응답 타입 */
export interface PopularTagResponseDTO {
  resultCode: string;
  message: string;
  tagInfoList: TagInfoDTO[];
}

/** 인기 지역 API 원본 응답 아이템 */
export interface PopularRegionDTO {
  regionLevel1: string;
  regionLevel2: string;
  regionLevel3: string;
  regionLevel4: string;
  rankNo: number;
}

/** GET /api/v1/home/regions/popular 응답 타입 */
export interface PopularRegionResponseDTO {
  code: string;
  message: string;
  data: PopularRegionDTO[];
}

/**
 * 공공기관 지역코드 응답 아이템
 * GET /api/v1/home/regions/code?type=HOT-PLACE
 *
 * 실측 기준(test 서버) 응답 키 9개 전부. **여기 없는 필드는 서버가 주지 않는다.**
 * - 총 252건 / 17개 시도. 누락값 0건이고 `sigunguCd` 는 전부 `areaCd` 접두로 시작한다.
 * - `type` 은 요청 파라미터(`HOT-PLACE`)와 값이 다르다 — 응답은 전부 `"areaBasedList1"`.
 * - 코드류는 숫자가 아니라 string (앞자리 0 보존 목적으로 보임)
 *
 * 봉투는 새 타입을 만들지 않고 기존 `BaseResponse<RegionCodeDTO[] | null>` 을 쓴다.
 */
export interface RegionCodeDTO {
  /** 행 식별자. 순서 보장용으로만 쓰고 의미는 부여하지 않는다 */
  localCodeNo: number;
  /** 데이터 출처 구분. 실측 전부 "areaBasedList1" */
  type: string;
  /** 시/도 코드 (예: "11") */
  areaCd: string;
  /** 시/도명 (예: "서울특별시") */
  areaNm: string;
  /** 시군구 코드 (예: "11110"). areaCd 접두로 시작한다 */
  sigunguCd: string;
  /** 시군구명 (예: "종로구", "수원시 장안구") */
  sigunguNm: string;
  /** 기상청 단기예보 격자 X */
  weatherNx: string;
  /** 기상청 단기예보 격자 Y */
  weatherNy: string;
  /** 기상청 중기예보 구역 코드 (예: "11B10101") */
  weatherMidRegId: string;
}

/**
 * 오늘의 핫플레이스(한국관광공사 데이터 기반) 응답 아이템
 * GET /api/v1/home/regions/hot-place
 *
 * 실측 기준 응답 키 13개 전부. **여기 없는 필드는 서버가 주지 않는다.**
 * - 이미지 URL 필드 없음 → 카드 썸네일은 플레이스홀더 유지
 * - regionNum 없음 → 일정 생성 플로우 지역 연동 불가 (이슈 #99와 동일 제약)
 * - mapX / mapY / hubRank / areaCd / signguCd 는 숫자가 아니라 string
 * - 요청 파라미터는 sigunguCd, 응답 필드는 signguCd 로 철자가 다르다 (u 하나 차이, 실측)
 *
 * 응답 봉투는 새 타입을 만들지 않고 기존 `BaseResponse<HotPlaceDTO[] | null>` 을 쓴다.
 */
export interface HotPlaceDTO {
  /**
   * 용도 미확인. 실측 10건에서 `Number(hubRank)` 와 값이 일치(1~10)하나
   * 행 ID가 우연히 일치한 것일 수 있어 **순위 판정에는 쓰지 않는다.**
   */
  popularReplaceNo: number;
  /** 배치 기준 연월 (yyyyMM). 실측 전부 "202605" */
  baseYm: string;
  /** 경도로 보임 (좌표계 미확인) */
  mapX: string;
  /** 위도로 보임 (좌표계 미확인) */
  mapY: string;
  /** 시/도 코드 */
  areaCd: string;
  /** 시/도명 (예: "서울특별시") */
  areaNm: string;
  /** 시군구 코드 — 응답은 signguCd (요청 파라미터는 sigunguCd) */
  signguCd: string;
  /** 시군구명 (예: "종로구") */
  signguNm: string;
  /** 관광지 식별 코드 (32자 hex). 실측 10건 전부 유니크 */
  hubTatsCd: string;
  /** 관광지명 — 카드 제목으로 사용 */
  hubTatsNm: string;
  /** 대분류 (실측: "관광지", "숙박") */
  hubCtgryLclsNm: string;
  /** 중분류 (실측: "기타관광", "문화관광", "쇼핑", "숙박", "역사관광") */
  hubCtgryMclsNm: string;
  /** 순위 "1"~"10". string 이므로 비교·정렬 시 Number() 변환 필수 */
  hubRank: string;
}
