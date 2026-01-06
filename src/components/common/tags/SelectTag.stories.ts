import type { Meta, StoryObj } from "@storybook/react-vite";

import { SelectTag } from "./SelectTag";

const meta = {
  title: "Components/Common/Tag/SelectTag",
  component: SelectTag,
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
  args: { onClick: () => {} },
} satisfies Meta<typeof SelectTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "지역 태그",
  },
};
