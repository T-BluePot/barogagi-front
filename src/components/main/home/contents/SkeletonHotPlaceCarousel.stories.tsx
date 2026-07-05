import type { Meta, StoryObj } from "@storybook/react-vite";

import SkeletonHotPlaceCarousel from "./SkeletonHotPlaceCarousel";

const meta: Meta<typeof SkeletonHotPlaceCarousel> = {
  title: "Components/Main/Home/SkeletonHotPlaceCarousel",
  component: SkeletonHotPlaceCarousel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 핫플레이스 캐러셀 로딩 스켈레톤 (카드 3장 실루엣) */
export const Default: Story = {};
