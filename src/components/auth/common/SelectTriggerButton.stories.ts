import type { Meta, StoryObj } from "@storybook/react-vite";

import { SelectTriggerButton } from "./SelectTriggerButton";

const meta = {
  title: "Auth/Signup/SelectTriggerButton",
  component: SelectTriggerButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    label: {
      control: "text",
      description: "TextField 상단 라벨",
      defaultValue: "이메일",
    },
    value: {
      control: "text",
      description: "현재 입력 값",
    },
    onClick: {
      action: "onClick",
      description: "버튼 클릭 시 실행되는 함수",
      table: { disable: true },
    },
  },
} satisfies Meta<typeof SelectTriggerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 🎯 onClick이 필수 prop이라서 빈 함수를 넣어야 함
 * - @storybook/test의 fn()을 사용하면 action 추적이 되지만,
 *   현재 Storybook v9와 호환되지 않음 (@storybook/test는 v8 필요)
 * - argTypes에 action: "onClick"이 있어도 필수 prop이면 args에 넘겨야 함
 */
export const Default: Story = {
  args: {
    label: "생일",
    value: "",
    onClick: () => {},
  },
};

export const Value: Story = {
  args: {
    ...Default.args,
    value: "2021.11.27",
  },
};
