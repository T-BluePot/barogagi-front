import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

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

export const Default: Story = {
  args: {
    label: "생일",
    value: "",
    onClick: action("모달창 열림"),
  },
};

export const Value: Story = {
  args: {
    ...Default.args,
    value: "2021.11.27",
  },
};
