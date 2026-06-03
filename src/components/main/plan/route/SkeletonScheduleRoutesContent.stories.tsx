import type { Meta, StoryObj } from "@storybook/react-vite";
import SkeletonScheduleRoutesContent from "./SkeletonScheduleRoutesContent";

const meta: Meta<typeof SkeletonScheduleRoutesContent> = {
  title: "Components/Main/Plan/Route/SkeletonScheduleRoutesContent",
  component: SkeletonScheduleRoutesContent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
