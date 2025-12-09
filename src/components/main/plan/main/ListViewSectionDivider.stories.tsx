import type { Meta, StoryObj } from "@storybook/react-vite";

import ListViewDivider from "./ListViewDivider";

const meta: Meta<typeof ListViewDivider> = {
  title: "Components/Main/Plan/Main/ListViewDivider",
  component: ListViewDivider,
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
