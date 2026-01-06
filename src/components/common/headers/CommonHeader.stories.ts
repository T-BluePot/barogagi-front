import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommonHeader } from "./CommonHeader";

const meta = {
  title: "Components/Common/Header/CommonHeader",
  component: CommonHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
  // 🎯 onClick이 필수 prop이라서 args에 넘겨야 함
  // @storybook/test의 fn()을 사용하면 action 추적이 되지만 Storybook v9와 호환 안 됨
  args: {
    onClick: () => {},
  },
} satisfies Meta<typeof CommonHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
