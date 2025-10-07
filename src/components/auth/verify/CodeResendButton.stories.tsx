import type { Meta, StoryObj } from "@storybook/react-vite";
import CodeResendButton from "./CodeResendButton";

const meta = {
  title: "Components/Auth/Verify/CodeResendButton",
  component: CodeResendButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "auth",
      values: [
        {
          name: "auth",
          value: "#111827",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    initialPhone: {
      control: "text",
    },
  },
} satisfies Meta<typeof CodeResendButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithValidPhone: Story = {
  args: {
    initialPhone: "01012345678",
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const WithInvalidPhone: Story = {
  args: {
    initialPhone: "010123",
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const EmptyPhone: Story = {
  args: {
    initialPhone: "",
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const InContext: Story = {
  args: {
    initialPhone: "01012345678",
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900 space-y-6">
        <div className="space-y-3">
          <h1 className="typo-title-01 text-white">인증번호 입력</h1>
          <p className="typo-body text-gray-20">
            휴대폰으로 전송된
            <br />
            인증번호를 입력해주세요
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block typo-body text-gray-20 mb-2">
              인증번호
            </label>
            <input
              type="text"
              placeholder="인증번호를 입력하세요"
              className="w-full h-12 px-4 bg-transparent border border-gray-60 rounded-lg text-white placeholder-gray-60"
            />
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
};
