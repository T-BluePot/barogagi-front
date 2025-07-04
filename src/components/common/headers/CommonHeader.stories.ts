import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { CommonHeader } from "./CommonHeader";

const meta = {
  title: "Components/CommonHeader",
  component: CommonHeader,
  parameters: {
    layout: "fullscreen",
  },
  args: { onClick: action("clicked") },
} satisfies Meta<typeof CommonHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
