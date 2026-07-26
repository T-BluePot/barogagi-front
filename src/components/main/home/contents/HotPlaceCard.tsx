export interface HotPlaceData {
  rank: number;
  name: string;
  /** 상위 행정구역명 (시/도) — 이름과 같거나 목록 전체가 같은 지역이면 생략 */
  area?: string;
  /** 카테고리 중분류 (hubCtgryMclsNm). area 가 없을 때 메타 라인에 노출 */
  category?: string;
}

/**
 * 카테고리별 플레이스홀더 글리프.
 *
 * 서버가 이미지 URL을 주지 않아 카드 10장이 전부 같은 아이콘이 되면 "고장난 화면"처럼 보인다.
 * 실측된 `hubCtgryMclsNm` 5종으로 글리프를 차별화해 정보량을 만든다.
 *
 * 색은 차별화하지 않는다 — Sunset Peach 단일 브랜드 원칙이라 카테고리별 색을 만들면
 * 팔레트를 발명하는 셈이다. 글리프만 교체한다.
 */
const CATEGORY_ICON_PATH: Record<string, string> = {
  // 문화관광 — 공연/전시 (티켓)
  문화관광: "M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6ZM12 5v14",
  // 역사관광 — 전통 건축 (기와 지붕)
  역사관광: "M3 9h18L12 4 3 9Zm2 0v11m14-11v11M3 20h18M9 20v-6h6v6",
  // 쇼핑 — 쇼핑백
  쇼핑: "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
  // 숙박 — 침대
  숙박: "M3 18v-6h18v6M3 12V8m0 10h18M7 12V9h4v3",
  // 기타관광 — 지도 핀
  기타관광: "M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
};

/** 매핑에 없는 카테고리·미지정 시 폴백 (건물 아이콘) — 외부 데이터라 새 값이 언제든 들어온다 */
const DEFAULT_ICON_PATH = "M4 21h16M6 21V8l6-4 6 4v13M10 21v-6h4v6";

/**
 * 핫플레이스 캐러셀 카드 (150px 고정)
 * - 썸네일은 서버 이미지 제공 전까지 플레이스홀더 (카테고리별 글리프)
 * - 1위에만 HOT 뱃지 노출
 */
const HotPlaceCard = ({ place }: { place: HotPlaceData }) => {
  // `||` 를 쓴다 — 외부(관광공사) 데이터라 category 가 빈 문자열로 올 수 있고,
  // `??` 는 빈 문자열을 통과시켜 path 가 비어 아이콘이 사라진다.
  const iconPath =
    (place.category && CATEGORY_ICON_PATH[place.category]) ||
    DEFAULT_ICON_PATH;
  // 지역이 있으면 지역, 없으면 카테고리를 메타 라인에 노출
  const metaLabel = place.area ?? place.category;

  return (
    <div className="w-[150px] shrink-0">
      <div className="relative flex h-[104px] w-full items-center justify-center rounded-xl bg-gray-10 text-gray-30">
        <svg
          width={34}
          height={34}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={iconPath} />
        </svg>
        {place.rank === 1 && (
          <span className="absolute top-2 left-2 rounded-full bg-peach-active px-2 py-1 text-[10px] font-bold tracking-[0.04em] text-white">
            HOT
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-[13px] font-semibold tracking-[-0.02em] text-gray-black">
        {place.name}
      </p>
      {metaLabel && (
        <p className="mt-[3px] truncate text-[11px] font-medium text-gray-50">
          {metaLabel}
        </p>
      )}
    </div>
  );
};

export default HotPlaceCard;
