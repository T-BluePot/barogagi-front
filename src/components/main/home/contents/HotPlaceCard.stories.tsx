import type { Meta, StoryObj } from "@storybook/react-vite";

import HotPlaceCard from "./HotPlaceCard";

const meta: Meta<typeof HotPlaceCard> = {
  title: "Components/Main/Home/HotPlaceCard",
  component: HotPlaceCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 1위 — HOT 뱃지 노출 */
export const Hot: Story = {
  args: {
    place: { rank: 1, name: "을지로 골목 카페", area: "서울" },
  },
};

/** 2위 이하 — 뱃지 없음 */
export const Ranked: Story = {
  args: {
    place: { rank: 3, name: "성수동 감성 편집숍", area: "서울" },
  },
};

/** 상위 행정구역 표기가 없는 경우 (area 생략) */
export const NoArea: Story = {
  args: {
    place: { rank: 2, name: "제주" },
  },
};

/** 카테고리 — 역사관광. area 가 없으면 카테고리가 메타 라인에 노출된다 */
export const CategoryHistory: Story = {
  args: {
    place: { rank: 4, name: "경복궁", category: "역사관광" },
  },
};

/** 카테고리 — 쇼핑 */
export const CategoryShopping: Story = {
  args: {
    place: { rank: 5, name: "광장시장", category: "쇼핑" },
  },
};

/** 카테고리 — 문화관광 */
export const CategoryCulture: Story = {
  args: {
    place: { rank: 6, name: "북촌한옥마을", category: "문화관광" },
  },
};

/** 카테고리 — 숙박 */
export const CategoryStay: Story = {
  args: {
    place: { rank: 7, name: "종로 게스트하우스", category: "숙박" },
  },
};

/**
 * 매핑에 없는 미지의 카테고리 → 건물 아이콘 폴백.
 * 외부(관광공사) 데이터라 새 카테고리가 언제든 들어올 수 있다.
 */
export const CategoryUnknownFallback: Story = {
  args: {
    place: { rank: 8, name: "미지의 장소", category: "레저스포츠" },
  },
};
