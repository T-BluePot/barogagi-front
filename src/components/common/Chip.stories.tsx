import type { Meta, StoryObj } from "@storybook/react-vite";

import Chip from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Components/Common/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: {
    label: "# 서울",
    tone: "light",
    size: "md",
  },
  argTypes: {
    tone: { control: "radio", options: ["light", "onPeach", "outline"] },
    size: { control: "radio", options: ["md", "sm"] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 흰 배경 위 (피치 라이트) — 기본 */
export const Light: Story = {
  args: { tone: "light" },
};

/** 회색 보더 톤 */
export const Outline: Story = {
  args: { tone: "outline", label: "# 데이트" },
};

/** 피치 카드 위 (반투명 화이트) — 배경 데코레이터로 가시성 확보 */
export const OnPeach: Story = {
  args: { tone: "onPeach", size: "sm", label: "AI 추천" },
  decorators: [
    (Story) => (
      <div className="inline-block rounded-2xl bg-peach p-6">
        <Story />
      </div>
    ),
  ],
};
