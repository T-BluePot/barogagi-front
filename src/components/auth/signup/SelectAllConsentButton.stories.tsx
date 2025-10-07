import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { SelectAllConsentButton } from "./SelectAllConsentButton";

const meta = {
  title: "Components/Auth/Signup/SelectAllConsentButton",
  component: SelectAllConsentButton,
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
    label: {
      control: "text",
    },
    isChecked: {
      control: "boolean",
    },
  },
  args: {
    onCheckedChange: action("onCheckedChange"),
  },
} satisfies Meta<typeof SelectAllConsentButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "모두 동의하기",
    isChecked: false,
    onCheckedChange: action("onCheckedChange"),
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const Checked: Story = {
  args: {
    label: "모두 동의하기",
    isChecked: true,
    onCheckedChange: action("onCheckedChange"),
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const LongLabel: Story = {
  args: {
    label: "모든 이용약관 및 개인정보 처리방침에 동의합니다",
    isChecked: false,
    onCheckedChange: action("onCheckedChange"),
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
    label: "모두 동의하기",
    isChecked: false,
    onCheckedChange: action("onCheckedChange"),
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900 space-y-6">
        <div className="space-y-3">
          <h1 className="typo-title-01 text-white">이용약관 동의</h1>
          <p className="typo-body text-gray-20">
            서비스 이용을 위해
            <br />
            아래 약관에 동의해주세요
          </p>
        </div>
        <Story />
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 border border-gray-60 rounded"></div>
            <span className="typo-body text-gray-20 underline">
              이용약관 동의 (필수)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 border border-gray-60 rounded"></div>
            <span className="typo-body text-gray-20 underline">
              개인정보 처리방침 (필수)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 border border-gray-60 rounded"></div>
            <span className="typo-body text-gray-20 underline">
              마케팅 수신 동의 (선택)
            </span>
          </div>
        </div>
      </div>
    ),
  ],
};
