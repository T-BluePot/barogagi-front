import type { Meta, StoryObj } from "@storybook/react-vite";

import { SelectTagConfirmModal } from "./SelectTagConfirmModal";

const mockTags = [
  { id: "1", label: "분위기좋은" },
  { id: "2", label: "사진이 맛집" },
  { id: "3", label: "뷰가좋은" },
  { id: "4", label: "서정적" },
  { id: "5", label: "차" },
  { id: "6", label: "외출" },
  { id: "7", label: "사색이 편한" },
  { id: "8", label: "자취가 편한" },
  { id: "9", label: "자취가 편한" },
  { id: "10", label: "자취가 편함" },
];

const meta = {
  title: "Components/Main/Plan/Modal/SelectTagConfirmModal",
  component: SelectTagConfirmModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onConfirm: { action: "confirm" },
    onCancel: { action: "cancel" },
  },
  args: {
    isOpen: true,
    tags: mockTags,
  },
} satisfies Meta<typeof SelectTagConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const WithInitialSelection: Story = {
  args: {
    initialSelectedIds: ["1", "3"],
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const WithMaxSelection: Story = {
  args: {
    maxSelection: 3,
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onConfirm: () => {},
    onCancel: () => {},
  },
};
