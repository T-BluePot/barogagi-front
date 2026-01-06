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

/**
 * 🎯 onClick이 필수 prop이라서 빈 함수를 넣어야 함
 * - @storybook/test의 fn()을 사용하면 action 추적이 되지만,
 *   현재 Storybook v9와 호환되지 않음 (@storybook/test는 v8 필요)
 */

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
