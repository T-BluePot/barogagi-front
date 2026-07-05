export interface HotPlaceData {
  rank: number;
  name: string;
  /** 상위 행정구역명 (시/도) — 이름과 같으면 생략 */
  area?: string;
}

/**
 * 핫플레이스 캐러셀 카드 (150px 고정)
 * - 썸네일은 서버 이미지 제공 전까지 플레이스홀더 (건물 아이콘)
 * - 1위에만 HOT 뱃지 노출
 */
const HotPlaceCard = ({ place }: { place: HotPlaceData }) => {
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
        >
          <path d="M4 21h16M6 21V8l6-4 6 4v13M10 21v-6h4v6" />
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
      {place.area && (
        <p className="mt-[3px] text-[11px] font-medium text-gray-50">
          {place.area}
        </p>
      )}
    </div>
  );
};

export default HotPlaceCard;
