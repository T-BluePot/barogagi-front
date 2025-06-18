import type { Meta, StoryObj } from "@storybook/react-vite";

import { action } from "storybook/actions";

import { SelectTag } from "./SelectTag";

const meta = {
  title: "Example/SelectTag",
  component: SelectTag,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: { onClick: action("clicked") },
} satisfies Meta<typeof SelectTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "지역 태그",
  },
};
