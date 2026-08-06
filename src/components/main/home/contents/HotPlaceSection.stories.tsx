import type { Meta, StoryObj } from "@storybook/react-vite";

import HotPlaceSection from "./HotPlaceSection";
import type { HotPlaceDTO } from "@/api/types";

/**
 * `GET /api/v1/home/regions/hot-place` 실측 응답(10건) 그대로.
 * 임의로 만든 값이 아니라 test 서버가 실제로 준 데이터라 화면 검증에 그대로 쓸 수 있다.
 */
const HOT_PLACES_FIXTURE: HotPlaceDTO[] = [
  {
    popularReplaceNo: 1,
    baseYm: "202605",
    mapX: "126.980649304391000",
    mapY: "37.601597640276800",
    areaCd: "11",
    areaNm: "서울특별시",
    signguCd: "11110",
    signguNm: "종로구",
    hubTatsCd: "9dac72fa7ebfaa2eca0d9f9e4e8ddcff",
    hubTatsNm: "팔각정북악스카이",
    hubCtgryLclsNm: "관광지",
    hubCtgryMclsNm: "문화관광",
    hubRank: "1",
  },
  {
    popularReplaceNo: 2,
    baseYm: "202605",
    mapX: "126.975427855759000",
    mapY: "37.570740067096400",
    areaCd: "11",
    areaNm: "서울특별시",
    signguCd: "11110",
    signguNm: "종로구",
    hubTatsCd: "7413592f5ac37e38d9a557c9872eb497",
    hubTatsNm: "포시즌스호텔/서울",
    hubCtgryLclsNm: "숙박",
    hubCtgryMclsNm: "숙박",
    hubRank: "2",
  },
  {
    popularReplaceNo: 3,
    baseYm: "202605",
    mapX: "126.975733092081000",
    mapY: "37.600625500122000",
    areaCd: "11",
    areaNm: "서울특별시",
    signguCd: "11110",
    signguNm: "종로구",
    hubTatsCd: "0a1ce1c3edf210408700cc3c81c6ac0e",
    hubTatsNm: "북악스카이웨이",
    hubCtgryLclsNm: "관광지",
    hubCtgryMclsNm: "기타관광",
    hubRank: "3",
  },
  {
    popularReplaceNo: 4,
    baseYm: "202605",
    mapX: "126.999286815743000",
    mapY: "37.570045850495400",
    areaCd: "11",
    areaNm: "서울특별시",
    signguCd: "11110",
    signguNm: "종로구",
    hubTatsCd: "42eaa57b48549bc6c48d6377a40419d5",
    hubTatsNm: "광장시장",
    hubCtgryLclsNm: "관광지",
    hubCtgryMclsNm: "쇼핑",
    hubRank: "4",
  },
  {
    popularReplaceNo: 5,
    baseYm: "202605",
    mapX: "126.980280089502000",
    mapY: "37.578649936467900",
    areaCd: "11",
    areaNm: "서울특별시",
    signguCd: "11110",
    signguNm: "종로구",
    hubTatsCd: "72052bd332dcb27c72a17ad8b6cf960a",
    hubTatsNm: "국립현대미술관/서울관",
    hubCtgryLclsNm: "관광지",
    hubCtgryMclsNm: "문화관광",
    hubRank: "5",
  },
  {
    popularReplaceNo: 6,
    baseYm: "202605",
    mapX: "126.976899873351000",
    mapY: "37.578072561267100",
    areaCd: "11",
    areaNm: "서울특별시",
    signguCd: "11110",
    signguNm: "종로구",
    hubTatsCd: "48d711bc1a903d95d891501dd96cdf06",
    hubTatsNm: "경복궁",
    hubCtgryLclsNm: "관광지",
    hubCtgryMclsNm: "역사관광",
    hubRank: "6",
  },
  {
    popularReplaceNo: 7,
    baseYm: "202605",
    mapX: "126.985176868789000",
    mapY: "37.581516658439900",
    areaCd: "11",
    areaNm: "서울특별시",
    signguCd: "11110",
    signguNm: "종로구",
    hubTatsCd: "5877109bc88136ac4ee7f265d9568d0a",
    hubTatsNm: "북촌한옥마을",
    hubCtgryLclsNm: "관광지",
    hubCtgryMclsNm: "역사관광",
    hubRank: "7",
  },
  {
    popularReplaceNo: 8,
    baseYm: "202605",
    mapX: "127.007807606043060",
    mapY: "37.570546247609610",
    areaCd: "11",
    areaNm: "서울특별시",
    signguCd: "11110",
    signguNm: "종로구",
    hubTatsCd: "4c625f7eb0034dc906c595e832042589",
    hubTatsNm: "동대문종합시장",
    hubCtgryLclsNm: "관광지",
    hubCtgryMclsNm: "쇼핑",
    hubRank: "8",
  },
  {
    popularReplaceNo: 9,
    baseYm: "202605",
    mapX: "126.981816135952000",
    mapY: "37.573906406944800",
    areaCd: "11",
    areaNm: "서울특별시",
    signguCd: "11110",
    signguNm: "종로구",
    hubTatsCd: "efe0cec96bdcb5d3a95caa3c9e3062e7",
    hubTatsNm: "조계사",
    hubCtgryLclsNm: "관광지",
    hubCtgryMclsNm: "역사관광",
    hubRank: "9",
  },
  {
    popularReplaceNo: 10,
    baseYm: "202605",
    mapX: "126.976927668386670",
    mapY: "37.576045018222850",
    areaCd: "11",
    areaNm: "서울특별시",
    signguCd: "11110",
    signguNm: "종로구",
    hubTatsCd: "79df877bdf5c79a7c30ed697c542b575",
    hubTatsNm: "광화문",
    hubCtgryLclsNm: "관광지",
    hubCtgryMclsNm: "역사관광",
    hubRank: "10",
  },
];

const meta: Meta<typeof HotPlaceSection> = {
  title: "Components/Main/Home/HotPlaceSection",
  component: HotPlaceSection,
  tags: ["autodocs"],
  // 홈은 좌우 패딩 px-5.5 안에서 캐러셀이 화면 밖으로 블리드된다 → 같은 조건으로 감싼다
  decorators: [
    (Story) => (
      <div className="w-full max-w-[390px] overflow-x-hidden bg-gray-white px-5.5 py-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 정상 — 실측 10건.
 * 1위만 HOT 뱃지, 캡션에 "서울 종로구 · 2026년 5월 기준",
 * 지역이 전부 같으므로 카드별 지역 표기는 생략되고 카테고리가 메타 라인에 온다.
 */
export const Default: Story = {
  args: { places: HOT_PLACES_FIXTURE, isLoading: false },
};

/** 로딩 — 스켈레톤 캐러셀 */
export const Loading: Story = {
  args: { places: [], isLoading: true },
};

/**
 * 빈 데이터 — `data:null` / `P400`(해당 지역 인기 장소 없음) / 빈 배열.
 * 캡션에 더미 문자열이 새지 않고 EmptyContent 로 떨어져야 한다.
 */
export const Empty: Story = {
  args: { places: [], isLoading: false },
};

/**
 * 지역이 섞인 경우 — 카드별 지역 표기가 살아나고 캡션에서는 지역이 빠진다.
 * (지역 필터 UI 착수 시 실제로 발생할 수 있는 상태)
 */
export const MixedRegions: Story = {
  args: {
    places: [
      HOT_PLACES_FIXTURE[0],
      {
        ...HOT_PLACES_FIXTURE[1],
        areaCd: "26",
        areaNm: "부산광역시",
        signguCd: "26110",
        signguNm: "중구",
        hubTatsNm: "부산 깡통시장",
        hubCtgryMclsNm: "쇼핑",
        hubRank: "2",
      },
    ],
    isLoading: false,
  },
};
