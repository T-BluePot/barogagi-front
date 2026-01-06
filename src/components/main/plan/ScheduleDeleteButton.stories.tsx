import type { Meta, StoryObj } from "@storybook/react-vite";
import ScheduleDeleteButton from "./ScheduleDeleteButton";

const meta = {
  title: "Components/Main/Plan/ScheduleDeleteButton",
  component: ScheduleDeleteButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof ScheduleDeleteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태
export const Default: Story = {
  args: {
    label: "삭제",
    isDisabled: false,
    onClick: () => console.log("Delete clicked"),
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    label: "삭제",
    isDisabled: true,
    onClick: () => console.log("Delete clicked"),
  },
};

// 커스텀 라벨
export const CustomLabel: Story = {
  args: {
    label: "삭제 모드",
    isDisabled: false,
    onClick: () => console.log("Delete clicked"),
  },
};
