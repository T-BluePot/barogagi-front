import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";
import { CommonInput } from "./CommonInput";

const meta = {
  title: "Components/Auth/Signup/CommonInput",
  component: CommonInput,
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
    placeholder: {
      control: "text",
      description: "placeholder 값",
      defaultValue: "example@domain.com",
    },
    helperText: {
      control: "text",
      description: "도움말·오류 메시지",
    },

    /* === 불리언 === */
    error: {
      control: "boolean",
      description: "오류 상태",
      defaultValue: false,
    },
    withButton: {
      control: "boolean",
      description: "우측에 SmallButton을 표시할지 여부",
      defaultValue: false,
    },

    /* === 문자열 값 === */
    value: {
      control: "text",
      description: "현재 입력 값",
    },

    /* === 이벤트·콜백 ===  */
    setValue: {
      action: "setValue", // 액션 탭에 찍힘
      table: { disable: true }, // Controls UI에서 숨김
    },
  },
} satisfies Meta<typeof CommonInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "이메일",
    placeholder: "example@domain.com",
    helperText: "",
    error: false,
    withButton: false,
    value: "",
    setValue: () => {},
  },
  render: (args) => {
    const [email, setEmail] = useState("");
    return <CommonInput {...args} value={email} setValue={setEmail} />;
  },
};

export const WithButton: Story = {
  args: {
    ...Default.args,
    withButton: true,
    value: "test@example.com",
    buttonProps: {
      label: "확인",
    },
  },
};

export const ErrorState: Story = {
  args: {
    ...Default.args,
    error: true,
    helperText: "이미 사용 중인 이메일입니다",
    value: "duplicate@example.com",
  },
};
