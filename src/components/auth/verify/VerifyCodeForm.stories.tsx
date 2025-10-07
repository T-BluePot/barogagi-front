import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { VerifyCodeForm } from "./VerifyCodeForm";

const meta = {
  title: "Components/Auth/Verify/VerifyCodeForm",
  component: VerifyCodeForm,
  parameters: {
    layout: "fullscreen",
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
    initialSeconds: {
      control: { type: "number", min: 0, max: 600 },
    },
  },
  args: {
    onConfirm: action("onConfirm"),
    onExpired: action("onExpired"),
  },
} satisfies Meta<typeof VerifyCodeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialSeconds: 180,
    onConfirm: action("onConfirm"),
    onExpired: action("onExpired"),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-md mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const ShortTimer: Story = {
  args: {
    initialSeconds: 30,
    onConfirm: action("onConfirm"),
    onExpired: action("onExpired"),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-md mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const LongTimer: Story = {
  args: {
    initialSeconds: 600,
    onConfirm: action("onConfirm"),
    onExpired: action("onExpired"),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-md mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const WithTitle: Story = {
  args: {
    initialSeconds: 180,
    onConfirm: action("onConfirm"),
    onExpired: action("onExpired"),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-md mx-auto space-y-12">
          <div className="space-y-3">
            <h1 className="typo-title-01 text-white">인증번호 입력</h1>
            <p className="typo-body text-gray-20">
              휴대폰으로 전송된
              <br />
              인증번호를 입력해주세요
            </p>
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
};

export const Mobile: Story = {
  args: {
    initialSeconds: 180,
    onConfirm: action("onConfirm"),
    onExpired: action("onExpired"),
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-md mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};
