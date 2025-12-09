import type { Meta, StoryObj } from "@storybook/react-vite";

import ListViewSectionDivider from "./ListViewSectionDivider";

const meta: Meta<typeof ListViewSectionDivider> = {
  title: "Components/Main/Plan/Main/ListViewSectionDivider",
  component: ListViewSectionDivider,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#111827",
        },
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
