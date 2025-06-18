import type { Meta, StoryObj } from "@storybook/react-vite";

import { TitleHeader } from "./TitleHeader";

const meta = {
  title: "Example/TitleHeader",
  component: TitleHeader,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isDarkBg: {
      control: "boolean",
      description: "배경이 어두운지 여부",
      defaultValue: false,
    },
  },
} satisfies Meta<typeof TitleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "기본 텍스트 헤더",
  },
};
