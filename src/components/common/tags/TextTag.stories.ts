import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextTag } from "./TextTag";

const meta = {
  title: "Components/Common/Tag/TextTag",
  component: TextTag,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    hasHash: {
      control: "boolean",
      description: "# 해시 존재 여부",
      defaultValue: true,
    },
  },
  args: {},
} satisfies Meta<typeof TextTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "텍스트 태그",
  },
};
