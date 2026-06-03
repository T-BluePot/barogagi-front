import type { Meta, StoryObj } from "@storybook/react-vite";
import SkeletonListView from "./SkeletonListView";

const meta: Meta<typeof SkeletonListView> = {
  title: "Components/Main/Plan/Main/SkeletonListView",
  component: SkeletonListView,
  argTypes: {
    count: {
      control: { type: "number", min: 1, max: 10 },
      description: "표시할 스켈레톤 카드 수",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 3,
  },
};

export const FiveCards: Story = {
  args: {
    count: 5,
  },
};
