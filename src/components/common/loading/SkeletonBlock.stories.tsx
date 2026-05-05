import type { Meta, StoryObj } from "@storybook/react-vite";
import SkeletonBlock from "./SkeletonBlock";

const meta: Meta<typeof SkeletonBlock> = {
  title: "Components/Common/Loading/SkeletonBlock",
  component: SkeletonBlock,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    width: {
      control: "text",
      description: "너비 (Tailwind 클래스)",
    },
    height: {
      control: "text",
      description: "높이 (Tailwind 클래스)",
    },
    rounded: {
      control: "text",
      description: "모서리 둥글기 (Tailwind 클래스)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: "w-48",
    height: "h-4",
    rounded: "rounded",
  },
};

export const Circle: Story = {
  args: {
    width: "w-10",
    height: "h-10",
    rounded: "rounded-full",
  },
};

export const Large: Story = {
  args: {
    width: "w-64",
    height: "h-8",
    rounded: "rounded-md",
  },
};
