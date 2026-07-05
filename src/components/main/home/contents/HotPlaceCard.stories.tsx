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
