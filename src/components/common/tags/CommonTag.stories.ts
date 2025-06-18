import type { Meta, StoryObj } from "@storybook/react-vite";

import { action } from "storybook/actions";

import { CommonTag } from "./commonTag";

const meta = {
  title: "Example/CommonTag",
  component: CommonTag,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: { onClick: action("clicked") },
} satisfies Meta<typeof CommonTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "기본 태그",
    size: "default",
    active: false,
  },
};

export const Active: Story = {
  args: {
    label: "활성화 태그",
    size: "default",
    active: true,
  },
};

export const SmallInactive: Story = {
  args: {
    label: "작은 태그",
    size: "small",
    active: false,
  },
};

export const SmallActive: Story = {
  args: {
    label: "작은 활성화 태그",
    size: "small",
    active: true,
  },
};
