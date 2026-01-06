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
  args: {
    onClick: () => {},
  },
} satisfies Meta<typeof CommonHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
