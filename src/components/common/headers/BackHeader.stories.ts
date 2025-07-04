import type { Meta, StoryObj } from "@storybook/react-vite";

import { action } from "storybook/actions";

import { BackHeader } from "./BackHeader";

const meta = {
  title: "Components/BackHeader",
  component: BackHeader,
  tags: ["autodocs"],
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
  args: { onClick: action("clicked") },
} satisfies Meta<typeof BackHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Text: Story = {
  args: {
    label: "뒤로 가기",
  },
};
