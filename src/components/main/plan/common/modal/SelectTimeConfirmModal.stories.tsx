import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { SelectTimeConfirmModal } from "./SelectTimeConfirmModal";

const meta = {
  title: "Components/Main/Plan/Modal/SelectTimeConfirmModal",
  component: SelectTimeConfirmModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    isOpen: true,
    onConfirm: action("confirm"),
    onCancel: action("cancel"),
  },
} satisfies Meta<typeof SelectTimeConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInitialTime: Story = {
  args: {
    initialStartTime: { period: "오전", hour: "10", minute: "30" },
    initialEndTime: { period: "오후", hour: "02", minute: "00" },
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};
