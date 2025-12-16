import { useState } from "react";

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
    onClick: { action: "clicked" },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const HomeActive: Story = {
  args: {
    variant: "home",
  },
  render: (args) => {
    const [isActive, setIsActive] = useState(false);
    return (
      <TabItem
        {...args}
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
      />
    );
  },
};

export const PlanActive: Story = {
  args: {
    variant: "plan",
  },
  render: (args) => {
    const [isActive, setIsActive] = useState(false);
    return (
      <TabItem
        {...args}
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
      />
    );
  },
};

export const MyActive: Story = {
  args: {
    variant: "my",
  },
  render: (args) => {
    const [isActive, setIsActive] = useState(false);
    return (
      <TabItem
        {...args}
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
      />
    );
  },
};
