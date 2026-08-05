import type { Meta, StoryObj } from "@storybook/react-vite";

import RotatingText from "./RotatingText";

const meta: Meta<typeof RotatingText> = {
  title: "Components/Common/RotatingText",
  component: RotatingText,
  tags: ["autodocs"],
  args: {
    items: [
      "고민없이 바로가는 만남",
      "날씨도 좋고, 거리도 가까워요",
      "오늘은 나들이하기 좋은 날이에요",
      "가까운 코스부터 둘러볼까요?",
    ],
    intervalMs: 2000,
    className: "text-[13px] font-medium text-gray-50",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 여러 문구가 위로 넘어가며 순환 (캔버스에서 자동 재생) */
export const Default: Story = {};

/** 문구가 하나면 애니메이션 없이 정적 렌더 */
export const SingleItem: Story = {
  args: { items: ["고민없이 바로가는 만남"] },
};
