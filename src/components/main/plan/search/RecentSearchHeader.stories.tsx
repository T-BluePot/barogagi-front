import type { Meta, StoryObj } from "@storybook/react-vite";
import RecentSearchHeader from "./RecentSearchHeader";

const meta = {
  title: "Components/Main/Plan/Search/RecentSearchHeader",
  component: RecentSearchHeader,
  tags: ["autodocs"],
  args: {
    onClick: () => console.log("Clear recent searches clicked"),
  },
} satisfies Meta<typeof RecentSearchHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
