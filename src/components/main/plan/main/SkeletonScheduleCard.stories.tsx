import type { Meta, StoryObj } from "@storybook/react-vite";
import SkeletonScheduleCard from "./SkeletonScheduleCard";

const meta: Meta<typeof SkeletonScheduleCard> = {
  title: "Components/Main/Plan/Main/SkeletonScheduleCard",
  component: SkeletonScheduleCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
