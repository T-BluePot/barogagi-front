import type { Meta, StoryObj } from "@storybook/react-vite";

import { PlanCategoryBottomModal } from "./PlanCategoryBottomModal";

const meta = {
  title: "Components/Main/Plan/Modal/PlanCategoryBottomModal",
  component: PlanCategoryBottomModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onClose: { action: "close" },
    onSelectOption: { action: "select-option" },
  },
  args: {
    isOpen: true,
  },
} satisfies Meta<typeof PlanCategoryBottomModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => {},
    onSelectOption: () => {},
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onSelectOption: () => {},
  },
};
