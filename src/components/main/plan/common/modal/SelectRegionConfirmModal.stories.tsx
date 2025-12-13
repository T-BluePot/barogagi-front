import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { SelectRegionConfirmModal } from "./SelectRegionConfirmModal";

const mockRegions = [
  { id: "1", label: "서울 강동구" },
  { id: "2", label: "부산 동래구" },
  { id: "3", label: "대구 수성구" },
  { id: "4", label: "인천 연수구" },
  { id: "5", label: "광주 서구" },
];

const meta = {
  title: "Components/Main/Plan/Modal/SelectRegionConfirmModal",
  component: SelectRegionConfirmModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    isOpen: true,
    regions: mockRegions,
    onConfirm: action("confirm"),
    onCancel: action("cancel"),
  },
} satisfies Meta<typeof SelectRegionConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInitialSelection: Story = {
  args: {
    initialSelectedId: "2",
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};
