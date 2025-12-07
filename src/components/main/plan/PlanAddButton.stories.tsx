import type { Meta, StoryObj } from "@storybook/react-vite";
import PlanAddButton from "./PlanAddButton";

const meta = {
  title: "Components/Main/Plan/PlanAddButton",
  component: PlanAddButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    isDisabled: {
      control: "boolean",
      description: "비활성화 여부",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "360px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlanAddButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태
export const Default: Story = {
  args: {
    label: "일정 추가하기",
    onClick: () => {},
    isDisabled: false,
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    label: "일정 추가하기",
    onClick: () => {},
    isDisabled: true,
  },
};

// 커스텀 라벨
export const CustomLabel: Story = {
  args: {
    label: "새 계획 추가",
    onClick: () => {},
    isDisabled: false,
  },
};
