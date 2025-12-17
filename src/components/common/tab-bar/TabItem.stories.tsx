import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabItem } from "./TabItem";

const meta: Meta<typeof TabItem> = {
  title: "Components/Common/TabBar/TabItem",
  component: TabItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["home", "plan", "my"],
    },
    isActive: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: {
    variant: "home",
  },
};

export const Plan: Story = {
  args: {
    variant: "plan",
  },
};

export const My: Story = {
  args: {
    variant: "my",
  },
};
