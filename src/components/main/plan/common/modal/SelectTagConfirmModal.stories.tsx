import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TagRegistResDTO } from "@/api/types";

import { SelectTagConfirmModal } from "./SelectTagConfirmModal";

const mockTags: TagRegistResDTO[] = [
  { tagNum: 1, tagNm: "분위기좋은" },
  { tagNum: 2, tagNm: "사진이 맛집" },
  { tagNum: 3, tagNm: "뷰가좋은" },
  { tagNum: 4, tagNm: "서정적" },
  { tagNum: 5, tagNm: "차" },
  { tagNum: 6, tagNm: "외출" },
  { tagNum: 7, tagNm: "사색이 편한" },
  { tagNum: 8, tagNm: "자취가 편한" },
  { tagNum: 9, tagNm: "자취가 편한" },
  { tagNum: 10, tagNm: "자취가 편함" },
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
    initialSelectedIds: [1, 3],
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
