import type { Meta, StoryObj } from "@storybook/react-vite";

import { SelectTimeConfirmModal } from "./SelectTimeConfirmModal";

const meta = {
  title: "Components/Main/Plan/Modal/SelectTimeConfirmModal",
  component: SelectTimeConfirmModal,
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
  },
} satisfies Meta<typeof SelectTimeConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const WithInitialTime: Story = {
  args: {
    initialStartTime: { period: "오전", hour: "10", minute: "30" },
    initialEndTime: { period: "오후", hour: "02", minute: "00" },
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
