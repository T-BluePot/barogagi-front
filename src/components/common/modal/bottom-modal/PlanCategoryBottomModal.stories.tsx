import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { PlanCategoryBottomModal } from "./PlanCategoryBottomModal";

const meta = {
  title: "Components/Modal/Bottom Modal/PlanCategoryBottomModal",
  component: PlanCategoryBottomModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    isOpen: true,
    onClose: action("close"),
    onSelectOption: action("select-option"),
  },
} satisfies Meta<typeof PlanCategoryBottomModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};
