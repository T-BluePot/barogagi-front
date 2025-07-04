import type { Meta, StoryObj } from "@storybook/react-vite";

import { TitleHeader } from "./TitleHeader";

const meta = {
  title: "Components/TitleHeader",
  component: TitleHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    label: {
      control: "text",
      description: "헤더 좌측 텍스트",
      defaultValue: "기본 텍스트 헤더",
    },
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
    isDarkBg: false,
  },
};

export const WithChildren: Story = {
  args: {
    label: "추가 텍스트 헤더",
    isDarkBg: false,
    children: "해당 위치에 JSX 요소 추기",
  },
};
